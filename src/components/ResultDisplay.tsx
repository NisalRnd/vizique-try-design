import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultDisplayProps {
  result: string | null;
  isGenerating: boolean;
}

const ResultDisplay = ({ result, isGenerating }: ResultDisplayProps) => {
  const handleDownload = () => {
    if (!result) return;
    
    const link = document.createElement("a");
    link.href = result;
    link.download = "generated-result.png";
    link.click();
  };

  return (
    <Card className="p-6 bg-card shadow-[var(--shadow-soft)] h-fit sticky top-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Result</h2>
        {result && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </div>
      
      <div className="aspect-[3/4] rounded-lg border border-border overflow-hidden bg-muted">
        {isGenerating ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Skeleton className="w-48 h-64 mx-auto" />
              <p className="text-sm text-muted-foreground animate-pulse">Generating...</p>
            </div>
          </div>
        ) : result ? (
          <img
            src={result}
            alt="Generated result"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">Your result will appear here</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResultDisplay;
