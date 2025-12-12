import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days within the US. Express shipping (2-3 days) is available at checkout. International orders typically arrive within 10-14 business days.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, contact us for a full refund or exchange. Items must be in original condition.",
  },
  {
    question: "Do posters come framed?",
    answer: "We offer both framed and unframed options. Our premium frames are handcrafted from solid wood with UV-protective glass. Select your preferred option on each product page.",
  },
  {
    question: "What sizes are available?",
    answer: "Our posters are available in multiple sizes: Small (12×16\"), Medium (18×24\"), Large (24×36\"), and Extra Large (36×48\"). Size availability varies by design.",
  },
  {
    question: "How do I care for my poster?",
    answer: "Avoid direct sunlight to prevent fading. For framed posters, dust the glass regularly with a soft cloth. Unframed prints should be stored flat in a cool, dry place.",
  },
];

export function FAQSection() {
  return (
    <section className="py-10 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">Frequently Asked Questions</h2>
        <p className="text-sm text-muted-foreground">Everything you need to know</p>
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-sm font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
