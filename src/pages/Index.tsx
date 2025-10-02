import { Shirt, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">AI Vision Studio</h1>
          <p className="text-muted-foreground mt-1">Transform your ideas with AI-powered visualization</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Module</h2>
            <p className="text-lg text-muted-foreground">
              Select a visualization tool to get started
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-card hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)] border-border">
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Shirt className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">Virtual Try-On</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Visualize clothing and accessories on models with AI-powered precision. Perfect for fashion retailers and online shoppers.
                </p>
                
                <Link to="/virtual-try-on" className="w-full">
                  <Button className="w-full" size="lg">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-8 bg-card hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)] border-border">
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">Room Decoration</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Place furniture and décor items in your space with intelligent AI visualization. Ideal for interior designers and home decorators.
                </p>
                
                <Link to="/room-decoration" className="w-full">
                  <Button className="w-full" size="lg">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="mt-16 p-8 rounded-xl bg-gradient-to-br from-accent to-accent/50 border border-border">
            <h3 className="text-xl font-semibold mb-2">How It Works</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li>1. Upload your base image (model or room)</li>
              <li>2. Upload the item you want to visualize (clothing or furniture)</li>
              <li>3. Add refinement prompts for precise control</li>
              <li>4. Generate and download your AI-created visualization</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
