import { useState, useEffect } from "react";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ImageUploadZone from "@/components/ImageUploadZone";
import ResultDisplay from "@/components/ResultDisplay";

const RoomDecoration = () => {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [furnitureImage, setFurnitureImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGenerating && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, startTime]);

  const handleGenerate = async () => {
    if (!roomImage || !furnitureImage) return;
    
    const start = Date.now();
    setStartTime(start);
    setElapsedTime(0);
    setIsGenerating(true);
    // TODO: Integrate with AI backend
    setTimeout(() => {
      setResult(roomImage); // Placeholder
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Room Decoration</h1>
          <p className="text-sm text-muted-foreground">Visualize furniture in your space</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6 bg-card shadow-[var(--shadow-soft)]">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Images
              </h2>
              
              <div className="space-y-6">
                <ImageUploadZone
                  label="Room Photo"
                  onImageUpload={setRoomImage}
                  image={roomImage}
                />
                
                <ImageUploadZone
                  label="Furniture/Decor Item"
                  onImageUpload={setFurnitureImage}
                  image={furnitureImage}
                />
              </div>
            </Card>

            <Card className="p-6 bg-card shadow-[var(--shadow-soft)]">
              <h2 className="text-lg font-semibold mb-4">Placement Prompt</h2>
              <Textarea
                placeholder="e.g., place sofa near window, add lamp in corner..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </Card>

            <Button
              onClick={handleGenerate}
              disabled={!roomImage || !furnitureImage || isGenerating}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Design
                </>
              )}
            </Button>
          </div>

          <ResultDisplay result={result} isGenerating={isGenerating} elapsedTime={elapsedTime} />
        </div>
      </main>
    </div>
  );
};

export default RoomDecoration;
