import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PromptMakerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyPrompt: (prompt: string) => void;
}

const promptOptions = {
  styleAndMood: {
    photographyStyles: [
      "Editorial fashion photography",
      "Documentary",
      "Street photography",
      "Minimalist",
      "Abstract",
      "Portrait",
      "Landscape",
      "Photojournalism",
      "Conceptual art",
      "Other"
    ],
    aesthetics: [
      "Cinematic",
      "Cyberpunk",
      "Vintage",
      "Retro",
      "Futuristic",
      "Ethereal",
      "Gritty",
      "Clean and contemporary",
      "Moody",
      "Serene",
      "Vibrant",
      "Other"
    ],
    artistInfluence: [
      "Style of Annie Leibovitz",
      "Vogue Magazine aesthetic",
      "Style of Ansel Adams",
      "Other"
    ]
  },
  compositionFraming: {
    shotTypes: [
      "Close-up",
      "Extreme close-up",
      "Medium shot",
      "Full-body shot",
      "Wide shot",
      "Establishing shot",
      "Other"
    ],
    angles: [
      "Low-angle",
      "High-angle",
      "Eye-level",
      "Profile shot",
      "Dutch angle",
      "Other"
    ],
    focusBackground: [
      "Sharp focus",
      "Soft focus",
      "Shallow depth of field",
      "Minimalist background",
      "Detailed background",
      "Bokeh",
      "Motion blur",
      "Other"
    ],
    subjectPosition: [
      "Centered subject",
      "Rule of thirds",
      "Off-center",
      "Looking directly at camera",
      "Looking away",
      "Other"
    ]
  },
  lighting: {
    qualityMood: [
      "Soft light",
      "Harsh light",
      "Dramatic lighting",
      "Cinematic lighting",
      "Chiaroscuro",
      "Other"
    ],
    direction: [
      "Backlight",
      "Rim lighting",
      "Side lighting",
      "Front lighting",
      "Underlit",
      "Other"
    ],
    sourceColor: [
      "Natural light",
      "Golden hour",
      "Blue hour",
      "Studio lighting",
      "Neon lighting",
      "Ambient light",
      "Volumetric light",
      "Other"
    ]
  },
  technicalSpecs: {
    realism: [
      "Ultra-realistic",
      "Hyperrealistic",
      "Photorealistic",
      "Highly detailed",
      "Intricate detail",
      "Other"
    ],
    resolution: ["4K", "8K", "High resolution", "Other"],
    lensCamera: [
      "35mm lens",
      "85mm portrait lens",
      "Telephoto lens",
      "Shot on film",
      "Kodak Portra 400",
      "DSLR",
      "Vintage film",
      "Other"
    ],
    color: [
      "Vibrant color",
      "Monochromatic",
      "Black and white",
      "Cool color palette",
      "Warm tones",
      "Desaturated",
      "Other"
    ]
  },
  subjectDetails: {
    emotion: [
      "Proud expression",
      "Serene",
      "Determined",
      "Joyful",
      "Contemplative",
      "Other"
    ],
    action: [
      "Standing confidently",
      "Walking with urgency",
      "Mid-stride",
      "At rest",
      "Other"
    ],
    details: [
      "Water droplets on face",
      "Freckles",
      "Flawless skin",
      "Windblown hair",
      "Other"
    ]
  }
};

const PromptMakerModal = ({ open, onOpenChange, onApplyPrompt }: PromptMakerModalProps) => {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const handleSelectionChange = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    if (value !== "Other") {
      setCustomInputs(prev => {
        const newInputs = { ...prev };
        delete newInputs[key];
        return newInputs;
      });
    }
  };

  const handleCustomInput = (key: string, value: string) => {
    setCustomInputs(prev => ({ ...prev, [key]: value }));
  };

  const generatePrompt = () => {
    const values: string[] = [];
    Object.entries(selections).forEach(([key, value]) => {
      if (value === "Other" && customInputs[key]) {
        values.push(customInputs[key]);
      } else if (value && value !== "Other") {
        values.push(value);
      }
    });
    return values.join(", ");
  };

  const handleDone = () => {
    const prompt = generatePrompt();
    if (prompt) {
      onApplyPrompt(prompt);
    }
    onOpenChange(false);
  };

  const renderSelect = (label: string, key: string, options: string[]) => (
    <div key={key} className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Select value={selections[key] || ""} onValueChange={(val) => handleSelectionChange(key, val)}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option} className="text-xs">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selections[key] === "Other" && (
        <Input
          placeholder="Enter custom value..."
          value={customInputs[key] || ""}
          onChange={(e) => handleCustomInput(key, e.target.value)}
          className="h-8 text-xs"
        />
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle>Advanced Prompt Maker</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="px-6 pb-4 max-h-[calc(85vh-140px)]">
          <div className="space-y-6">
            {/* Style & Mood */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Style & Mood</h3>
              <div className="grid grid-cols-3 gap-3">
                {renderSelect("Photography Style", "photographyStyle", promptOptions.styleAndMood.photographyStyles)}
                {renderSelect("Aesthetic", "aesthetic", promptOptions.styleAndMood.aesthetics)}
                {renderSelect("Artist/Magazine Influence", "artistInfluence", promptOptions.styleAndMood.artistInfluence)}
              </div>
            </div>

            {/* Composition & Framing */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Composition & Framing</h3>
              <div className="grid grid-cols-3 gap-3">
                {renderSelect("Shot Type", "shotType", promptOptions.compositionFraming.shotTypes)}
                {renderSelect("Angle", "angle", promptOptions.compositionFraming.angles)}
                {renderSelect("Focus & Background", "focusBackground", promptOptions.compositionFraming.focusBackground)}
                {renderSelect("Subject Position", "subjectPosition", promptOptions.compositionFraming.subjectPosition)}
              </div>
            </div>

            {/* Lighting */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Lighting</h3>
              <div className="grid grid-cols-3 gap-3">
                {renderSelect("Quality & Mood", "lightingQuality", promptOptions.lighting.qualityMood)}
                {renderSelect("Direction", "lightingDirection", promptOptions.lighting.direction)}
                {renderSelect("Source & Color", "lightingSource", promptOptions.lighting.sourceColor)}
              </div>
            </div>

            {/* Technical Specs & Quality */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Technical Specs & Quality</h3>
              <div className="grid grid-cols-3 gap-3">
                {renderSelect("Realism", "realism", promptOptions.technicalSpecs.realism)}
                {renderSelect("Resolution", "resolution", promptOptions.technicalSpecs.resolution)}
                {renderSelect("Lens & Camera", "lensCamera", promptOptions.technicalSpecs.lensCamera)}
                {renderSelect("Color", "color", promptOptions.technicalSpecs.color)}
              </div>
            </div>

            {/* Subject Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Subject Details</h3>
              <div className="grid grid-cols-3 gap-3">
                {renderSelect("Emotion", "emotion", promptOptions.subjectDetails.emotion)}
                {renderSelect("Action", "action", promptOptions.subjectDetails.action)}
                {renderSelect("Details", "details", promptOptions.subjectDetails.details)}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6 pt-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDone}>
            Apply Prompt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptMakerModal;
