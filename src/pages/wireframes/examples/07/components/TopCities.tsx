import { Button } from "@/components/ui/button";

const cities = [
  "Paris",
  "London", 
  "New York",
  "Tokyo",
  "Rome",
  "Barcelona",
  "Venice",
  "Amsterdam",
  "Vienna",
];

export function TopCities() {
  return (
    <section className="px-4 py-8">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">Shop by City</h2>
        <p className="text-sm text-muted-foreground">
          Find posters from your favorite destinations
        </p>
      </div>

      {/* 3x3 Grid of City Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {cities.map((city) => (
          <Button
            key={city}
            variant="outline"
            className="h-12 text-sm font-medium hover:bg-amber-50 hover:border-amber-600 hover:text-amber-700 transition-colors"
          >
            {city}
          </Button>
        ))}
      </div>
    </section>
  );
}
