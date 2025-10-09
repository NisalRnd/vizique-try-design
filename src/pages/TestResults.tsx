import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, ZoomIn } from "lucide-react";

interface TestResult {
  _id?: string;
  model: string;
  prompt: string;
  input_images: string[];
  result_image_base64: string | null;
  user_experience_latency_ms: number | null;
  api_execution_time_ms: number | null;
  generation_api_time_ms: number | null;
  created_at: string | null;
  updated_at: string | null;
}

// Mock data for testing - replace with actual API call
const mockData: TestResult[] = Array.from({ length: 25 }, (_, i) => ({
  _id: `result-${i + 1}`,
  model: `Model ${(i % 3) + 1}`,
  prompt: `Test prompt ${i + 1} with some description`,
  input_images: Array.from({ length: (i % 5) + 1 }, (_, j) => `data:image/png;base64,iVBORw0KGgo...${j}`),
  result_image_base64: `data:image/png;base64,iVBORw0KGgo...result${i}`,
  user_experience_latency_ms: Math.floor(Math.random() * 5000) + 1000,
  api_execution_time_ms: Math.floor(Math.random() * 3000) + 500,
  generation_api_time_ms: Math.floor(Math.random() * 2000) + 300,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date(Date.now() - i * 86400000).toISOString(),
}));

const TestResults = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TestResult[]>([]);
  
  const itemsPerPage = 15;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1500);
  }, []);

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const formatLatency = (ms: number | null) => {
    if (ms === null) return "N/A";
    return `${ms}ms`;
  };

  const handleViewAllImages = (images: string[]) => {
    setSelectedImages(images);
    setShowAllImages(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Test Results</h1>
          <p className="text-muted-foreground mt-2">
            View and analyze image generation test results
          </p>
        </header>

        <Card className="p-6 shadow-[var(--shadow-medium)]">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Model</TableHead>
                    <TableHead className="w-[200px]">Prompt</TableHead>
                    <TableHead className="w-[150px]">Input Images</TableHead>
                    <TableHead className="w-[100px]">Result</TableHead>
                    <TableHead className="w-[100px]">UX Latency</TableHead>
                    <TableHead className="w-[100px]">API Time</TableHead>
                    <TableHead className="w-[100px]">Gen Time</TableHead>
                    <TableHead className="w-[150px]">Created</TableHead>
                    <TableHead className="w-[150px]">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((result) => (
                    <TableRow key={result._id}>
                      <TableCell className="font-medium">{result.model}</TableCell>
                      <TableCell>
                        <p className="truncate max-w-[200px]" title={result.prompt}>
                          {result.prompt}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {result.input_images.slice(0, 3).map((img, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className="w-8 h-8 rounded border border-border overflow-hidden hover:ring-2 hover:ring-ring transition-all"
                              >
                                <img
                                  src={img}
                                  alt={`Input ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                          {result.input_images.length > 3 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAllImages(result.input_images)}
                              className="h-7 px-2"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              +{result.input_images.length - 3}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {result.result_image_base64 ? (
                          <button
                            onClick={() => setSelectedImage(result.result_image_base64)}
                            className="w-12 h-12 rounded border border-border overflow-hidden hover:ring-2 hover:ring-ring transition-all"
                          >
                            <img
                              src={result.result_image_base64}
                              alt="Result"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatLatency(result.user_experience_latency_ms)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatLatency(result.api_execution_time_ms)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatLatency(result.generation_api_time_ms)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatTimestamp(result.created_at)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatTimestamp(result.updated_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
      </div>

      {/* Single Image Viewer Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* All Images Viewer Dialog */}
      <Dialog open={showAllImages} onOpenChange={setShowAllImages}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>All Input Images ({selectedImages.length})</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 max-h-[70vh] overflow-y-auto">
            {selectedImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImage(img);
                  setShowAllImages(false);
                }}
                className="relative group aspect-square rounded-lg border border-border overflow-hidden hover:ring-2 hover:ring-ring transition-all"
              >
                <img
                  src={img}
                  alt={`Input ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestResults;
