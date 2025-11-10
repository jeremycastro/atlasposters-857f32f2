import { Navigation } from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container py-16 flex-1">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About Atlas Posters</h1>
            <p className="text-xl text-muted-foreground">
              Curating exceptional art from around the world
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Atlas Posters was born from a simple belief: exceptional art should be accessible to everyone. 
              We partner with talented artists from around the globe to bring their unique perspectives 
              and creative visions into homes and spaces worldwide.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're building the world's most curated collection of poster art. Every piece is carefully 
              selected for its artistic merit, originality, and ability to transform a space. We believe 
              in fair compensation for artists, sustainable production practices, and delivering museum-quality 
              prints that will be cherished for years to come.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Quality Promise</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Premium Printing</h3>
                <p className="text-muted-foreground">
                  All posters are printed on archival-quality paper using advanced giclée printing techniques 
                  for exceptional color accuracy and longevity.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Sustainable Materials</h3>
                <p className="text-muted-foreground">
                  We use responsibly sourced materials and eco-friendly production methods to minimize 
                  our environmental impact.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Expert Curation</h3>
                <p className="text-muted-foreground">
                  Our team works directly with artists to ensure each piece meets our high standards 
                  for artistic excellence.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Artist Support</h3>
                <p className="text-muted-foreground">
                  We believe in fair compensation and long-term partnerships with the artists who make 
                  our collection possible.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Looking Ahead</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're just getting started. Our vision is to build a catalog of one million unique pieces, 
              partnering with artists and brands worldwide while maintaining our commitment to quality 
              and curation. Join us on this journey to bring exceptional art into every home.
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Atlas Posters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
