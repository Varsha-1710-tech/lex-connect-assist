import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Fingerprint, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FingerprintInputProps {
  onVerified: (verified: boolean) => void;
  className?: string;
}

export function FingerprintInput({ onVerified, className }: FingerprintInputProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate fingerprint scanning
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      onVerified(true);
    }, 2000);
  };

  return (
    <div className={cn("flex flex-col items-center space-y-3", className)}>
      <Button
        type="button"
        variant={isVerified ? "default" : "outline"}
        size="lg"
        onClick={handleScan}
        disabled={isScanning || isVerified}
        className={cn(
          "h-16 w-16 rounded-full p-0 transition-all duration-300",
          isVerified && "bg-green-600 hover:bg-green-700",
          isScanning && "animate-pulse"
        )}
      >
        {isVerified ? (
          <Check className="h-8 w-8" />
        ) : (
          <Fingerprint className={cn("h-8 w-8", isScanning && "animate-spin")} />
        )}
      </Button>
      <p className="text-sm text-muted-foreground">
        {isVerified ? "Verified" : isScanning ? "Scanning..." : "Touch to verify"}
      </p>
    </div>
  );
}