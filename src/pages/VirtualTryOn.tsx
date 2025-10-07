import { useState, useEffect } from "react";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ImageUploadZone from "@/components/ImageUploadZone";
import ResultDisplay from "@/components/ResultDisplay";

const VirtualTryOn = () => {
  const [images, setImages] = useState<string[]>([]);
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

  const handleImageUpload = (index: number, image: string | null) => {
    if (image) {
      const newImages = [...images];
      newImages[index] = image;
      setImages(newImages);
    } else {
      // Remove image at index
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleGenerate = async () => {
    if (images.length === 0) return;
    
    // Log Base64 encoded images array
    console.log('Images Array (Base64):', images);
    console.log('Refinement Prompt:', prompt);
    
    const start = Date.now();
    setStartTime(start);
    setElapsedTime(0);
    setIsGenerating(true);
    // TODO: Integrate with AI backend
    setTimeout(() => {
      setResult(images[0]); // Placeholder
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Virtual Try-On</h1>
            <p className="text-sm text-muted-foreground">Visualize clothing on your model</p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={images.length === 0 || isGenerating}
            className="h-10 px-6"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Try-On
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          <div className="space-y-6">
            <Card className="p-6 bg-card shadow-[var(--shadow-soft)]">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Images
              </h2>
              
              <div className="space-y-6">
                {images.map((image, index) => (
                  <ImageUploadZone
                    key={index}
                    onImageUpload={(img) => handleImageUpload(index, img)}
                    image={image}
                  />
                ))}
                
                {/* Always show an empty slot to add a new image */}
                <ImageUploadZone
                  onImageUpload={(img) => handleImageUpload(images.length, img)}
                  image={null}
                />
              </div>
            </Card>

            <Card className="p-6 bg-card shadow-[var(--shadow-soft)]">
              <h2 className="text-lg font-semibold mb-4">Refinement Prompt</h2>
              <Textarea
                placeholder="e.g., make the dress longer, adjust the fit..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </Card>
          </div>

          <ResultDisplay result={result} isGenerating={isGenerating} elapsedTime={elapsedTime} />
        </div>
      </main>
    </div>
  );
};

export default VirtualTryOn;
