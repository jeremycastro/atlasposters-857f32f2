import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmailSignupModalProps {
  triggerAfterMs?: number;
  onClose?: () => void;
}

export function EmailSignupModal({ triggerAfterMs = 5000, onClose }: EmailSignupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if already dismissed
    const dismissed = sessionStorage.getItem("emailModalDismissed");
    if (dismissed) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, triggerAfterMs);

    return () => clearTimeout(timer);
  }, [triggerAfterMs]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("emailModalDismissed", "true");
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup
    console.log("Email signup:", email);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-background rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-4">
            <span className="inline-block text-4xl sm:text-5xl font-bold text-amber-600">£20</span>
            <span className="text-lg text-muted-foreground"> OFF</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Get £20 off your first artwork
          </h2>
          
          <p className="text-sm text-muted-foreground mb-6">
            Join the Atlas community for early access to new collections and limited editions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-center"
            />
            <Button 
              type="submit" 
              className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
            >
              Sign Up & Get £20 Off
            </Button>
          </form>

          <button
            onClick={handleClose}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}
