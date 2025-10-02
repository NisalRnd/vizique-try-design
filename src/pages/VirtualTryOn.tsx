import { useState } from "react";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ImageUploadZone from "@/components/ImageUploadZone";
import ResultDisplay from "@/components/ResultDisplay";

const VirtualTryOn = () => {
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [poseImage, setPoseImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!avatarImage || !garmentImage || !backgroundImage || !poseImage) return;
    
    setIsGenerating(true);
    // TODO: Integrate with AI backend
    setTimeout(() => {
      setResult(avatarImage); // Placeholder
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Virtual Try-On</h1>
          <p className="text-sm text-muted-foreground">Visualize clothing on your model</p>
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
                  label="Avatar Image"
                  onImageUpload={setAvatarImage}
                  image={avatarImage}
                />
                
                <ImageUploadZone
                  label="Garment Image"
                  onImageUpload={setGarmentImage}
                  image={garmentImage}
                />
                
                <ImageUploadZone
                  label="Background"
                  onImageUpload={setBackgroundImage}
                  image={backgroundImage}
                />
                
                <ImageUploadZone
                  label="Pose Image"
                  onImageUpload={setPoseImage}
                  image={poseImage}
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

            <Button
              onClick={handleGenerate}
              disabled={!avatarImage || !garmentImage || !backgroundImage || !poseImage || isGenerating}
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
                  Generate Try-On
                </>
              )}
            </Button>
          </div>

          <ResultDisplay result={result} isGenerating={isGenerating} />
        </div>
      </main>
    </div>
  );
};

export default VirtualTryOn;
