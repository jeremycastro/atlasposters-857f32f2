import AdminLayout from "@/layouts/AdminLayout";
import { useCategories } from "@/hooks/useTags";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Tag, Hash, Sparkles } from "lucide-react";

export default function TagAnalytics() {
  const { data: categories } = useCategories();

  // Mock data for demo - in production, this would come from database aggregations
  const categoryUsageData = categories?.map((cat: any) => ({
    name: cat.display_name,
    count: Math.floor(Math.random() * 100) + 10,
  })) || [];

  const tagTypeData = [
    { name: 'System Tags', value: 300, color: '#8B5CF6' },
    { name: 'Custom Tags', value: 50, color: '#06B6D4' },
    { name: 'AI Generated', value: 120, color: '#F59E0B' },
  ];

  const topTags = [
    { tag: 'Abstract', category: 'Art Style', usage: 156 },
    { tag: 'Hawaii', category: 'Islands', usage: 134 },
    { tag: 'Surfing', category: 'Sport', usage: 112 },
    { tag: 'Canvas Print', category: 'Product Type', usage: 98 },
    { tag: 'Tropical', category: 'Travel', usage: 87 },
  ];

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tag Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Insights and statistics about tag usage across the platform
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Total Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">470</div>
              <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground mt-1">Currently in use</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Total Taggings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground mt-1">Tags applied to entities</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground mt-1">Generated this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tag Usage by Category</CardTitle>
              <CardDescription>Number of active tags per category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tag Type Distribution</CardTitle>
              <CardDescription>Breakdown of tag types in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tagTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tagTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Most Used Tags</CardTitle>
            <CardDescription>Top performing tags across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTags.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{item.tag}</div>
                      <div className="text-sm text-muted-foreground">{item.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{item.usage}</div>
                    <div className="text-xs text-muted-foreground">usages</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
