import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadZoneProps {
  label?: string;
  onImageUpload: (image: string | null) => void;
  image: string | null;
}

const ImageUploadZone = ({ label, onImageUpload, image }: ImageUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="w-32 h-32 border-2 border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-[var(--transition-smooth)] flex flex-col items-center justify-center"
        >
          <Upload className="w-5 h-5 mb-1 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground">Click or drag</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">PNG, JPG</p>
        </div>
      ) : (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border bg-muted">
          <img
            src={image}
            alt={label}
            className="w-full h-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploadZone;
