import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface ResultDisplayProps {
  result: string | null;
  isGenerating: boolean;
  elapsedTime: number;
}

const ResultDisplay = ({ result, isGenerating, elapsedTime }: ResultDisplayProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      
      {(isGenerating || (elapsedTime > 0 && result)) && (
        <div className="mb-4 text-sm text-muted-foreground text-center py-2 px-4 bg-muted rounded-md">
          {isGenerating ? (
            <span className="animate-pulse">Loading: {(elapsedTime / 1000).toFixed(2)}s</span>
          ) : (
            <span>Generated in {(elapsedTime / 1000).toFixed(2)}s</span>
          )}
        </div>
      )}
      
      <div className="aspect-[4/3] rounded-lg border border-border overflow-hidden bg-muted max-h-[600px]">
        {isGenerating ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Skeleton className="w-48 h-64 mx-auto" />
              <p className="text-sm text-muted-foreground animate-pulse">Generating...</p>
            </div>
          </div>
        ) : result ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="relative w-full h-full cursor-pointer group">
                <img
                  src={result}
                  alt="Generated result"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-screen max-h-screen w-screen h-screen p-4 flex items-center justify-center">
              <img
                src={result}
                alt="Generated result - Full view"
                className="max-w-full max-h-full object-contain"
              />
            </DialogContent>
          </Dialog>
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
