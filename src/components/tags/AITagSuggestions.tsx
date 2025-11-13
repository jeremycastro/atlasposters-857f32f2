import { useState } from "react";
import { useAITagSuggestions, useTagEntity, useBulkTagEntities } from "@/hooks/useTags";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AITagSuggestionsProps {
  entityType: string;
  entityId: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

interface SuggestedTag {
  tag_id: string;
  tag_name: string;
  category_name: string;
  confidence: number;
  reason: string;
}

export const AITagSuggestions = ({ 
  entityType, 
  entityId, 
  imageUrl,
  metadata 
}: AITagSuggestionsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  
  const { data: suggestions, refetch } = useAITagSuggestions(entityType, entityId);
  const addTag = useTagEntity();
  const bulkAddTags = useBulkTagEntities();

  const suggestedTags: SuggestedTag[] = Array.isArray(suggestions?.suggested_tags) 
    ? suggestions.suggested_tags as unknown as SuggestedTag[]
    : [];

  const handleGenerateSuggestions = async () => {
    if (!imageUrl && !metadata) {
      toast.error("No image or metadata available for AI analysis");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-tags', {
        body: {
          entityType,
          entityId,
          imageUrl,
          metadata,
        },
      });

      if (error) throw error;
      
      toast.success("AI tag suggestions generated successfully");
      refetch();
    } catch (error: any) {
      console.error('AI suggestion error:', error);
      toast.error(error.message || "Failed to generate AI suggestions");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptTag = async (tagId: string) => {
    await addTag.mutateAsync({
      entityType,
      entityId,
      tagId,
      source: 'ai',
      confidenceScore: suggestedTags.find(t => t.tag_id === tagId)?.confidence,
    });
    setAccepted(prev => new Set(prev).add(tagId));
  };

  const handleRejectTag = (tagId: string) => {
    setRejected(prev => new Set(prev).add(tagId));
  };

  const handleAcceptAll = async () => {
    const highConfidenceTags = suggestedTags
      .filter(t => t.confidence >= 0.7 && !rejected.has(t.tag_id) && !accepted.has(t.tag_id))
      .map(t => t.tag_id);

    if (highConfidenceTags.length === 0) {
      toast.info("No high-confidence tags to accept");
      return;
    }

    await bulkAddTags.mutateAsync({
      entityType,
      entityId,
      tagIds: highConfidenceTags,
      source: 'ai',
    });

    highConfidenceTags.forEach(id => setAccepted(prev => new Set(prev).add(id)));
  };

  const visibleSuggestions = suggestedTags.filter(
    t => !accepted.has(t.tag_id) && !rejected.has(t.tag_id)
  );

  if (!suggestions && !isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Tag Suggestions
          </CardTitle>
          <CardDescription>
            Let AI analyze your content and suggest relevant tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGenerateSuggestions}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (visibleSuggestions.length === 0 && !isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Tag Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No more suggestions available. You can regenerate suggestions to get fresh recommendations.
          <Button 
            onClick={handleGenerateSuggestions}
            disabled={isGenerating}
            variant="outline"
            className="w-full mt-3"
          >
            Regenerate Suggestions
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI Tag Suggestions
            </CardTitle>
            <CardDescription>
              Review and accept AI-generated tag recommendations
            </CardDescription>
          </div>
          <Button
            onClick={handleAcceptAll}
            disabled={bulkAddTags.isPending || visibleSuggestions.filter(t => t.confidence >= 0.7).length === 0}
            size="sm"
          >
            Accept All High Confidence
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {visibleSuggestions.map((tag) => (
          <div
            key={tag.tag_id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{tag.tag_name}</span>
                <Badge variant="outline" className="text-xs">
                  {tag.category_name}
                </Badge>
                <Badge 
                  variant={tag.confidence >= 0.7 ? "default" : "secondary"}
                  className="text-xs"
                >
                  {Math.round(tag.confidence * 100)}%
                </Badge>
              </div>
              {tag.reason && (
                <p className="text-xs text-muted-foreground">{tag.reason}</p>
              )}
            </div>
            <div className="flex gap-1 ml-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAcceptTag(tag.tag_id)}
                disabled={addTag.isPending}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRejectTag(tag.tag_id)}
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
