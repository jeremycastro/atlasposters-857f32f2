import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PromotionalBanner() {
  return (
    <section className="mx-4 my-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
      <div className="text-center">
        {/* Icon */}
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Gift className="h-6 w-6 text-amber-600" />
        </div>
        
        {/* Headline */}
        <h2 className="text-xl font-bold mb-1">
          Get <span className="text-amber-600">£20 OFF</span>
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your first order when you sign up for our newsletter
        </p>
        
        {/* Form */}
        <div className="flex gap-2 max-w-sm mx-auto">
          <Input 
            type="email" 
            placeholder="Enter your email"
            className="flex-1 bg-background"
          />
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            Get Code
          </Button>
        </div>
        
        {/* Terms */}
        <p className="text-[10px] text-muted-foreground mt-3">
          By signing up, you agree to our Terms & Privacy Policy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
