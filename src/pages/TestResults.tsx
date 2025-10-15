import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  usage?: Record<string, any>;
  error?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Mock data for testing - replace with actual API call
const mockData: TestResult[] = Array.from({ length: 25 }, (_, i) => ({
  _id: `result-${i + 1}`,
  model: `Model ${(i % 3) + 1}`,
  prompt: `Test prompt ${i + 1} with some description`,
  input_images: Array.from({ length: (i % 5) + 1 }, (_, j) => `data:image/png;base64,iVBORw0KGgo...${j}`),
  result_image_base64: i % 7 === 0 ? null : `data:image/png;base64,iVBORw0KGgo...result${i}`,
  user_experience_latency_ms: Math.floor(Math.random() * 5000) + 1000,
  api_execution_time_ms: Math.floor(Math.random() * 3000) + 500,
  generation_api_time_ms: Math.floor(Math.random() * 2000) + 300,
  usage: {
    prompt_tokens: Math.floor(Math.random() * 1000) + 100,
    completion_tokens: Math.floor(Math.random() * 500) + 50,
    total_tokens: Math.floor(Math.random() * 1500) + 150,
  },
  error: i % 7 === 0 ? "Failed to generate image: API timeout error" : null,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date(Date.now() - i * 86400000).toISOString(),
}));

const TestResults = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
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
      
      // Show error toasts for failed generations
      const errorResults = mockData.filter(result => result.error);
      errorResults.forEach(result => {
        toast({
          variant: "destructive",
          title: "Image Generation Failed",
          description: result.error || "An error occurred during image generation",
        });
      });
    }, 1500);
  }, [toast]);

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const formatLatency = (ms: number | null) => {
    if (ms === null) return "N/A";
    return `${ms}ms`;
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
                    <TableHead className="w-[60px]">View</TableHead>
                    <TableHead className="w-[120px]">Model</TableHead>
                    <TableHead className="w-[200px]">Prompt</TableHead>
                    <TableHead className="w-[120px]">Result Image</TableHead>
                    <TableHead className="w-[100px]">API Time</TableHead>
                    <TableHead className="w-[200px]">Usage</TableHead>
                    <TableHead className="w-[150px]">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((result) => (
                    <TableRow key={result._id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedResult(result)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{result.model}</TableCell>
                      <TableCell>
                        <p className="truncate max-w-[200px]" title={result.prompt}>
                          {result.prompt}
                        </p>
                      </TableCell>
                      <TableCell>
                        {result.result_image_base64 ? (
                          <img
                            src={result.result_image_base64}
                            alt="Result"
                            className="w-20 h-20 object-cover rounded border border-border"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {result.error ? "Error" : "N/A"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatLatency(result.api_execution_time_ms)}
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={result.usage ? JSON.stringify(result.usage, null, 2) : "N/A"}
                          readOnly
                          className="min-h-[60px] max-h-[80px] text-xs font-mono resize-none"
                        />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatTimestamp(result.created_at)}
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

      {/* Result Details Dialog */}
      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Test Result Details</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <div className="space-y-6 p-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Model</label>
                  <p className="text-base font-semibold">{selectedResult.model}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Result ID</label>
                  <p className="text-base font-mono">{selectedResult._id}</p>
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Prompt</label>
                <Textarea
                  value={selectedResult.prompt}
                  readOnly
                  className="mt-1 min-h-[80px]"
                />
              </div>

              {/* Error Message */}
              {selectedResult.error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <label className="text-sm font-medium text-destructive">Error</label>
                  <p className="text-sm text-destructive mt-1">{selectedResult.error}</p>
                </div>
              )}

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <label className="text-xs font-medium text-muted-foreground">UX Latency</label>
                  <p className="text-xl font-bold mt-1">
                    {formatLatency(selectedResult.user_experience_latency_ms)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <label className="text-xs font-medium text-muted-foreground">API Time</label>
                  <p className="text-xl font-bold mt-1">
                    {formatLatency(selectedResult.api_execution_time_ms)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <label className="text-xs font-medium text-muted-foreground">Generation Time</label>
                  <p className="text-xl font-bold mt-1">
                    {formatLatency(selectedResult.generation_api_time_ms)}
                  </p>
                </div>
              </div>

              {/* Usage */}
              {selectedResult.usage && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Usage Data</label>
                  <Textarea
                    value={JSON.stringify(selectedResult.usage, null, 2)}
                    readOnly
                    className="mt-1 min-h-[120px] font-mono text-sm resize-none"
                  />
                </div>
              )}

              {/* Input Images */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Input Images ({selectedResult.input_images.length})
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {selectedResult.input_images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg border border-border overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`Input ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Image */}
              {selectedResult.result_image_base64 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Result Image
                  </label>
                  <div className="flex justify-center p-4 bg-muted rounded-lg">
                    <img
                      src={selectedResult.result_image_base64}
                      alt="Result"
                      className="max-w-full max-h-[400px] object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Created At</label>
                  <p className="text-sm">{formatTimestamp(selectedResult.created_at)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Updated At</label>
                  <p className="text-sm">{formatTimestamp(selectedResult.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestResults;
