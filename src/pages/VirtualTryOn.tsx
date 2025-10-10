import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploadZone from "@/components/ImageUploadZone";
import CompactResultDisplay from "@/components/CompactResultDisplay";
import PromptMakerModal from "@/components/PromptMakerModal";

const VirtualTryOn = () => {
  const [images, setImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("google/gemini-2.5-flash");
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showPromptMaker, setShowPromptMaker] = useState(false);

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
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleGenerate = async () => {
    if (images.length === 0) return;
    
    console.log('Images Array (Base64):', images);
    console.log('Prompt:', prompt);
    console.log('Selected Model:', model);
    
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

  const handleApplyPrompt = (generatedPrompt: string) => {
    setPrompt(prev => prev ? `${prev}, ${generatedPrompt}` : generatedPrompt);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Virtual Try-On</h1>
            <p className="text-xs text-muted-foreground">Visualize clothing on your model</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[200px] h-9 text-sm">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                <SelectItem value="google/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</SelectItem>
                <SelectItem value="openai/gpt-5">GPT-5</SelectItem>
                <SelectItem value="openai/gpt-5-mini">GPT-5 Mini</SelectItem>
                <SelectItem value="openai/gpt-5-nano">GPT-5 Nano</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerate}
              disabled={images.length === 0 || isGenerating}
              className="h-9 px-4 text-sm"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-[280px_1fr_280px] gap-4">
          {/* Left sidebar - Image uploads */}
          <div className="space-y-3">
            <Card className="p-3 bg-card shadow-[var(--shadow-soft)]">
              <h2 className="text-sm font-semibold mb-3">Upload Images</h2>
              
              <div className="space-y-3">
                {images.map((image, index) => (
                  <ImageUploadZone
                    key={index}
                    onImageUpload={(img) => handleImageUpload(index, img)}
                    image={image}
                  />
                ))}
                
                <ImageUploadZone
                  onImageUpload={(img) => handleImageUpload(images.length, img)}
                  image={null}
                />
              </div>
            </Card>
          </div>

          {/* Center - Result */}
          <CompactResultDisplay result={result} isGenerating={isGenerating} elapsedTime={elapsedTime} />

          {/* Right sidebar - Prompt */}
          <div className="space-y-3">
            <Card className="p-3 bg-card shadow-[var(--shadow-soft)]">
              <h2 className="text-sm font-semibold mb-2">Prompt</h2>
              <Textarea
                placeholder="Describe the virtual try-on transformation..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[180px] resize-none text-sm"
              />
              <button
                onClick={() => setShowPromptMaker(true)}
                className="text-xs text-primary hover:underline mt-2 font-medium"
              >
                Advanced Prompting →
              </button>
            </Card>
          </div>
        </div>
      </main>

      <PromptMakerModal
        open={showPromptMaker}
        onOpenChange={setShowPromptMaker}
        onApplyPrompt={handleApplyPrompt}
      />
    </div>
  );
};

export default VirtualTryOn;
