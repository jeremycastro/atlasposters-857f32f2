import { useState, useEffect } from "react";

const announcements = [
  "Free UK Delivery on Orders Over £50",
  "30-Day Returns • Money Back Guarantee",
  "Museum-Quality Prints • Handcrafted Frames",
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-foreground text-background py-2 px-4">
      <div className="container mx-auto">
        <p className="text-center text-xs sm:text-sm font-medium transition-opacity duration-300">
          {announcements[currentIndex]}
        </p>
      </div>
    </div>
  );
}
