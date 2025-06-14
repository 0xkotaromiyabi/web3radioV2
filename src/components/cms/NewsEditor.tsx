
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import FileUpload from './FileUpload';
import RichTextEditor from './RichTextEditor';
import { addNewsItem } from '@/lib/supabase';

interface NewsEditorProps {
  onSave: () => void;
}

const NewsEditor: React.FC<NewsEditorProps> = ({ onSave }) => {
  const [newsData, setNewsData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    image_url: ''
  });
  
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!newsData.title || !newsData.content) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await addNewsItem({
        title: newsData.title,
        content: newsData.content,
        date: newsData.date,
        image_url: newsData.image_url
      });

      if (error) throw error;

      toast({
        title: "News article saved",
        description: "Your news article has been published successfully",
      });

      // Reset form
      setNewsData({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        image_url: ''
      });
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save news article",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-green-500">
      <CardHeader>
        <CardTitle className="text-green-400">Create News Article</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="news-title" className="text-white">Title</Label>
            <Input
              id="news-title"
              value={newsData.title}
              onChange={(e) => setNewsData({...newsData, title: e.target.value})}
              placeholder="Enter news title..."
              className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
            />
          </div>
          <div>
            <Label htmlFor="news-date" className="text-white">Publication Date</Label>
            <Input
              id="news-date"
              type="date"
              value={newsData.date}
              onChange={(e) => setNewsData({...newsData, date: e.target.value})}
              className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
            />
          </div>
        </div>

        <FileUpload
          onFileUploaded={(url) => setNewsData({...newsData, image_url: url})}
          currentImageUrl={newsData.image_url}
        />

        <RichTextEditor
          label="Article Content"
          value={newsData.content}
          onChange={(content) => setNewsData({...newsData, content})}
          placeholder="Write your news article content here..."
          rows={8}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? 'Publishing...' : 'Publish Article'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsEditor;
