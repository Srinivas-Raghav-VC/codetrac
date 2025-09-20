import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ResetOnboardingProps {
  onReset: () => void;
}

export function ResetOnboarding({ onReset }: ResetOnboardingProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    // Clear all localStorage data
    localStorage.removeItem('codeTracPreferences');
    localStorage.removeItem('codeTracOnboardingComplete');
    
    toast.success("Settings reset! Redirecting to onboarding...");
    
    // Trigger app reset
    setTimeout(() => {
      onReset();
    }, 1000);
    
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="border-catppuccin-surface2 hover:bg-catppuccin-surface1 text-catppuccin-overlay1"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset App
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-catppuccin-surface0 border-catppuccin-surface1">
          <DialogHeader>
            <DialogTitle className="text-catppuccin-red flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Reset Application</span>
            </DialogTitle>
            <DialogDescription className="text-catppuccin-overlay1">
              This will clear all your preferences and restart the onboarding process. 
              Your problems and notes data will remain intact.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-catppuccin-surface2 hover:bg-catppuccin-surface1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReset}
              className="bg-catppuccin-red hover:bg-catppuccin-red/80 text-catppuccin-surface0"
            >
              Reset Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}