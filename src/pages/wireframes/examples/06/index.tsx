import { Link } from "react-router-dom";
import { ArrowRight, Type, Palette, Layout, Grid, Frame, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const designNotes = [
  {
    icon: Type,
    title: "Typography",
    description: "Clean sans-serif with bold headings for clarity and readability",
  },
  {
    icon: Palette,
    title: "Colors",
    description: "White background with red accents, warm neutral tones",
  },
  {
    icon: Layout,
    title: "Layout",
    description: "Traditional e-commerce grid with category cards and hero carousel",
  },
  {
    icon: Grid,
    title: "Categories",
    description: "Visual category navigation with overlay text labels",
  },
];

const pages = [
  {
    name: "Homepage",
    path: "/wireframes/examples/06/home",
    description: "Hero carousel, style categories, room inspiration, and featured collections",
  },
  {
    name: "Product Page",
    path: "/wireframes/examples/06/product",
    description: "Frame customization, room preview, size selection, and customer reviews",
  },
  {
    name: "Collection Page",
    path: "/wireframes/examples/06/collection",
    description: "Filterable grid with style/room/subject filters and sorting options",
  },
];

export default function WireframeIndex06() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-6">
              <Frame className="h-4 w-4" />
              Version 06 — Classic E-Commerce
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              FramedArt.com Inspired
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              A classic, approachable e-commerce experience with traditional navigation, 
              category-focused browsing, and a warm, trustworthy aesthetic that appeals 
              to mainstream art buyers.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/wireframes/examples/06/home">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2">
                  View Homepage
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/wireframes">
                <Button size="lg" variant="outline">
                  Back to Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Design Principles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {designNotes.map((note) => (
              <Card key={note.title} className="border-gray-200">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 mb-4">
                    <note.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-600">{note.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Wireframe Pages
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pages.map((page) => (
              <Link key={page.path} to={page.path}>
                <Card className="h-full hover:shadow-lg transition-shadow border-gray-200 hover:border-red-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{page.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{page.description}</p>
                    <span className="text-red-600 text-sm font-medium inline-flex items-center gap-1">
                      View Page
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Trust Signals</h3>
                <p className="text-sm text-gray-600">Customer reviews, ratings badges, and satisfaction guarantees prominently displayed</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Grid className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Category Navigation</h3>
                <p className="text-sm text-gray-600">Browse by room, style, subject, and more with visual category cards</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Frame className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Frame Customization</h3>
                <p className="text-sm text-gray-600">Interactive frame previewer with multiple frame and mat options</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Layout className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Room Visualization</h3>
                <p className="text-sm text-gray-600">See artwork in different room settings to help buying decisions</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
