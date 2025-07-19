
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import FileUpload from './FileUpload';
import RichTextEditor from './RichTextEditor';
import { addStation } from '@/lib/supabase';

interface StationEditorProps {
  onSave: () => void;
}

const StationEditor: React.FC<StationEditorProps> = ({ onSave }) => {
  const [stationData, setStationData] = useState({
    name: '',
    genre: '',
    description: '',
    streaming: true,
    image_url: ''
  });
  
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!stationData.name || !stationData.genre || !stationData.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, genre and description",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await addStation({
        name: stationData.name,
        genre: stationData.genre,
        description: stationData.description,
        streaming: stationData.streaming,
        image_url: stationData.image_url
      });

      if (error) throw error;

      toast({
        title: "Station created",
        description: "Your radio station has been created successfully",
      });

      // Reset form
      setStationData({
        name: '',
        genre: '',
        description: '',
        streaming: true,
        image_url: ''
      });
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to create station",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-green-500">
      <CardHeader>
        <CardTitle className="text-green-400">Create Radio Station</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="station-name" className="text-white">Station Name</Label>
            <Input
              id="station-name"
              value={stationData.name}
              onChange={(e) => setStationData({...stationData, name: e.target.value})}
              placeholder="Enter station name..."
              className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
            />
          </div>
          <div>
            <Label htmlFor="station-genre" className="text-white">Genre</Label>
            <Input
              id="station-genre"
              value={stationData.genre}
              onChange={(e) => setStationData({...stationData, genre: e.target.value})}
              placeholder="e.g., Electronic, Rock, Jazz..."
              className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="streaming-status"
            checked={stationData.streaming}
            onCheckedChange={(streaming) => setStationData({...stationData, streaming})}
          />
          <Label htmlFor="streaming-status" className="text-white">Currently Streaming</Label>
        </div>

        <FileUpload
          onFileUploaded={(url) => setStationData({...stationData, image_url: url})}
          currentImageUrl={stationData.image_url}
        />

        <RichTextEditor
          label="Station Description"
          value={stationData.description}
          onChange={(description) => setStationData({...stationData, description})}
          placeholder="Describe your radio station..."
          rows={5}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? 'Creating...' : 'Create Station'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StationEditor;
