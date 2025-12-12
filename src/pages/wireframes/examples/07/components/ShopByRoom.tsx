import { WireframePlaceholder } from "./WireframePlaceholder";

const rooms = [
  { name: "Living Room", count: 156 },
  { name: "Bedroom", count: 89 },
  { name: "Office", count: 72 },
  { name: "Dining Room", count: 45 },
];

export function ShopByRoom() {
  return (
    <section className="py-10 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">Shop by Room</h2>
        <p className="text-sm text-muted-foreground">Find the perfect piece for every space</p>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {rooms.map((room) => (
          <div
            key={room.name}
            className="relative rounded-lg overflow-hidden group cursor-pointer"
          >
            <WireframePlaceholder 
              aspectRatio="square" 
              label={room.name}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3">
              <h3 className="text-white font-medium text-sm">{room.name}</h3>
              <p className="text-white/70 text-xs">{room.count} posters</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
