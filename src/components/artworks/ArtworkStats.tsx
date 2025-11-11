import { useArtworkStats } from '@/hooks/useArtworks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CheckCircle, FileText, Archive } from 'lucide-react';

export const ArtworkStats = () => {
  const { data: stats, isLoading } = useArtworkStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Artworks',
      value: stats?.total || 0,
      icon: Package,
      description: 'All artworks',
    },
    {
      title: 'Active',
      value: stats?.active || 0,
      icon: CheckCircle,
      description: 'Published artworks',
    },
    {
      title: 'Draft',
      value: stats?.draft || 0,
      icon: FileText,
      description: 'Work in progress',
    },
    {
      title: 'Archived',
      value: stats?.archived || 0,
      icon: Archive,
      description: 'Archived artworks',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
