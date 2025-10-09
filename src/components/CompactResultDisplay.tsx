import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompactResultDisplayProps {
  result: string | null;
  isGenerating: boolean;
  elapsedTime: number;
}

const CompactResultDisplay = ({ result, isGenerating, elapsedTime }: CompactResultDisplayProps) => {
  const handleDownload = () => {
    if (!result) return;
    
    const link = document.createElement("a");
    link.href = result;
    link.download = "generated-result.png";
    link.click();
  };

  return (
    <Card className="p-3 bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">Result</h2>
        {result && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            className="h-7 w-7"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
      
      {(isGenerating || (elapsedTime > 0 && result)) && (
        <div className="mb-2 text-xs text-muted-foreground text-center py-1 px-2 bg-muted rounded">
          {isGenerating ? (
            <span className="animate-pulse">Loading: {(elapsedTime / 1000).toFixed(2)}s</span>
          ) : (
            <span>Generated in {(elapsedTime / 1000).toFixed(2)}s</span>
          )}
        </div>
      )}
      
      <div className="aspect-[4/3] rounded-lg border border-border overflow-hidden bg-muted">
        {isGenerating ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <Skeleton className="w-32 h-40 mx-auto" />
              <p className="text-xs text-muted-foreground animate-pulse">Generating...</p>
            </div>
          </div>
        ) : result ? (
          <img
            src={result}
            alt="Generated result"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <p className="text-xs">Your result will appear here</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompactResultDisplay;
