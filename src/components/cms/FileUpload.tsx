
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface FileUploadProps {
  onFileUploaded: (url: string) => void;
  currentImageUrl?: string;
  accept?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  currentImageUrl,
  accept = "image/*",
  maxSize = 10
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Construct full URL for the uploaded file
      const fullUrl = `${API_URL}${result.data.url}`;
      onFileUploaded(fullUrl);

      toast({
        title: "File uploaded successfully",
        description: "Your image has been uploaded and is ready to use.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeImage = () => {
    onFileUploaded('');
  };

  return (
    <div className="space-y-4">
      <Label className="text-white flex items-center gap-2">
        <Image className="h-4 w-4" />
        Featured Image
      </Label>

      {currentImageUrl ? (
        <div className="relative group">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-green-500/50"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
            <Button
              variant="destructive"
              size="sm"
              onClick={removeImage}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Remove Image
            </Button>
          </div>
          <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            Featured Image Set
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${dragOver
              ? 'border-green-400 bg-green-500/20 scale-[1.02]'
              : 'border-gray-600 hover:border-green-500 hover:bg-gray-700/50'
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <div className="flex flex-col items-center space-y-3">
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-green-500 animate-spin" />
                <p className="text-green-400 font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-gray-700 rounded-full">
                  <Upload className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    PNG, JPG, GIF, WebP up to {maxSize}MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

