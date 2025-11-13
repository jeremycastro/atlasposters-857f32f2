import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entityType, entityId, imageUrl, metadata } = await req.json();

    if (!entityType || !entityId) {
      throw new Error("entityType and entityId are required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch available categories and tags from database
    const { data: categories } = await supabase
      .from("category_definitions")
      .select(`
        id,
        category_key,
        display_name,
        tag_definitions (
          id,
          tag_key,
          display_name
        )
      `)
      .eq("is_active", true);

    if (!categories || categories.length === 0) {
      throw new Error("No categories available");
    }

    // Build taxonomy context for AI
    const taxonomyContext = categories
      .map((cat: any) => 
        `${cat.display_name}: ${cat.tag_definitions.map((t: any) => t.display_name).join(", ")}`
      )
      .join("\n");

    // Build AI prompt
    let userContent = `Analyze this ${entityType} and suggest relevant tags from our taxonomy.\n\nAvailable categories and tags:\n${taxonomyContext}\n\n`;
    
    if (metadata) {
      userContent += `Metadata: ${JSON.stringify(metadata, null, 2)}\n\n`;
    }

    userContent += `Suggest 5-10 most relevant tags with confidence scores (0.0-1.0) and brief reasons.`;

    const messages: any[] = [
      {
        role: "system",
        content: "You are an expert art and product categorization system. Analyze content and suggest relevant tags from the provided taxonomy. Be specific and confident in your suggestions."
      },
      {
        role: "user",
        content: userContent
      }
    ];

    // Add image if provided
    if (imageUrl) {
      messages[1].content = [
        { type: "text", text: userContent },
        { type: "image_url", image_url: { url: imageUrl } }
      ];
    }

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        tools: [{
          type: "function",
          function: {
            name: "suggest_tags",
            description: "Return tag suggestions with confidence scores",
            parameters: {
              type: "object",
              properties: {
                tags: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category_key: { type: "string", description: "Category key from taxonomy" },
                      tag_key: { type: "string", description: "Tag key from taxonomy" },
                      confidence: { type: "number", description: "Confidence score 0.0-1.0" },
                      reason: { type: "string", description: "Brief reason for suggestion" }
                    },
                    required: ["category_key", "tag_key", "confidence", "reason"]
                  }
                }
              },
              required: ["tags"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "suggest_tags" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (aiResponse.status === 402) {
        throw new Error("Payment required. Please add credits to your Lovable AI workspace.");
      }
      
      throw new Error("AI gateway error");
    }

    const aiResult = await aiResponse.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const suggestedTags = JSON.parse(toolCall.function.arguments).tags;

    // Map tag keys to tag IDs from database
    const enrichedSuggestions = [];
    
    for (const suggestion of suggestedTags) {
      const category = categories.find((c: any) => c.category_key === suggestion.category_key);
      if (!category) continue;

      const tag = category.tag_definitions.find((t: any) => t.tag_key === suggestion.tag_key);
      if (!tag) continue;

      enrichedSuggestions.push({
        tag_id: tag.id,
        tag_name: tag.display_name,
        category_name: category.display_name,
        confidence: suggestion.confidence,
        reason: suggestion.reason
      });
    }

    // Store suggestions in cache
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    await supabase
      .from("tag_suggestions")
      .upsert({
        entity_type: entityType,
        entity_id: entityId,
        suggested_tags: enrichedSuggestions,
        expires_at: expiresAt.toISOString()
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        suggestions: enrichedSuggestions 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("Error in suggest-tags function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
