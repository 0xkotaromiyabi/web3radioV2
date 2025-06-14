
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import FileUpload from './FileUpload';
import RichTextEditor from './RichTextEditor';
import { addEvent } from '@/lib/supabase';

interface EventEditorProps {
  onSave: () => void;
}

const EventEditor: React.FC<EventEditorProps> = ({ onSave }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    image_url: ''
  });
  
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!eventData.title || !eventData.location || !eventData.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title, location and description",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await addEvent({
        title: eventData.title,
        date: eventData.date,
        location: eventData.location,
        description: eventData.description,
        image_url: eventData.image_url
      });

      if (error) throw error;

      toast({
        title: "Event created",
        description: "Your event has been created successfully",
      });

      // Reset form
      setEventData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        description: '',
        image_url: ''
      });
      
      onSave();
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-green-500">
      <CardHeader>
        <CardTitle className="text-green-400">Create Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="event-title" className="text-white">Event Title</Label>
            <Input
              id="event-title"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              placeholder="Enter event title..."
              className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
            />
          </div>
          <div>
            <Label htmlFor="event-date" className="text-white">Event Date</Label>
            <Input
              id="event-date"
              type="date"
              value={eventData.date}
              onChange={(e) => setEventData({...eventData, date: e.target.value})}
              className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="event-location" className="text-white">Location</Label>
          <Input
            id="event-location"
            value={eventData.location}
            onChange={(e) => setEventData({...eventData, location: e.target.value})}
            placeholder="Enter event location..."
            className="bg-gray-700 text-white border-gray-600 focus:border-green-500"
          />
        </div>

        <FileUpload
          onFileUploaded={(url) => setEventData({...eventData, image_url: url})}
          currentImageUrl={eventData.image_url}
        />

        <RichTextEditor
          label="Event Description"
          value={eventData.description}
          onChange={(description) => setEventData({...eventData, description})}
          placeholder="Describe your event details..."
          rows={6}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? 'Creating...' : 'Create Event'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventEditor;
