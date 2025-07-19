
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Link2 } from "lucide-react";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter content...",
  rows = 6
}) => {
  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="rich-editor" className="text-white">{label}</Label>
      
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('**', '**')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('*', '*')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('\n- ')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertText('[', '](url)')}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
      
      <Textarea
        id="rich-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-gray-700 text-white border-gray-600 focus:border-green-500 font-mono"
      />
      
      <p className="text-xs text-gray-400">
        Supports basic markdown: **bold**, *italic*, [links](url), and bullet lists
      </p>
    </div>
  );
};

export default RichTextEditor;
