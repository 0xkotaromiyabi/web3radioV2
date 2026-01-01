import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, Trash2, Copy, Loader2, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface MediaItem {
    filename: string;
    url: string;
    uploadedAt: string;
}

interface MediaLibraryProps {
    onSelectImage?: (url: string) => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelectImage }) => {
    const [files, setFiles] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { toast } = useToast();

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const response = await fetch(`${API_URL}/api/upload`);
            const result = await response.json();
            if (result.data) {
                setFiles(result.data.map((f: any) => ({
                    ...f,
                    url: `${API_URL}${f.url}`
                })));
            }
        } catch (error) {
            console.error('Error loading files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            toast({
                title: "File uploaded",
                description: "Your file has been uploaded successfully.",
            });

            loadFiles();
        } catch (error: any) {
            toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (filename: string) => {
        try {
            const response = await fetch(`${API_URL}/api/upload/${filename}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Delete failed');

            toast({
                title: "File deleted",
                description: "The file has been removed.",
            });

            loadFiles();
        } catch (error: any) {
            toast({
                title: "Delete failed",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast({
            title: "URL copied",
            description: "Image URL copied to clipboard.",
        });
    };

    return (
        <div className="card-apple">
            <div className="p-6 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                        <Image className="h-5 w-5 text-blue-500" />
                    </div>
                    <h2 className="font-semibold text-foreground">Media Library</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex rounded-xl overflow-hidden border border-border/50">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            <Grid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                    <label className="cursor-pointer">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                        <div className="btn-apple-primary flex items-center gap-2">
                            {uploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                            <span>Upload</span>
                        </div>
                    </label>
                </div>
            </div>
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                            <Image className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-foreground font-medium">No media files yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Upload images to use in your content</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {files.map((file) => (
                            <div
                                key={file.filename}
                                className="group relative aspect-square rounded-xl overflow-hidden hover-lift cursor-pointer"
                            >
                                <img
                                    src={file.url}
                                    alt={file.filename}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => copyUrl(file.url)}
                                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    {onSelectImage && (
                                        <button
                                            onClick={() => onSelectImage(file.url)}
                                            className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                                        >
                                            Select
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(file.filename)}
                                        className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {files.map((file) => (
                            <div
                                key={file.filename}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <img
                                    src={file.url}
                                    alt={file.filename}
                                    className="w-14 h-14 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-foreground font-medium truncate">{file.filename}</p>
                                    <p className="text-muted-foreground text-sm">
                                        {new Date(file.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyUrl(file.url)}
                                        className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.filename)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaLibrary;
