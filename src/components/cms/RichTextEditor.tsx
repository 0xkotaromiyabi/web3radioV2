
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  List,
  Link2,
  Heading1,
  Heading2,
  Quote,
  Code,
  Image,
  Eye,
  Edit3,
  ListOrdered
} from "lucide-react";

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
  rows = 10
}) => {
  const [activeTab, setActiveTab] = useState<string>("write");

  const insertText = (before: string, after: string = '', newLine: boolean = false) => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const prefix = newLine && start > 0 && value[start - 1] !== '\n' ? '\n' : '';
    const newText = value.substring(0, start) + prefix + before + selectedText + after + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newStart = start + prefix.length + before.length;
      textarea.setSelectionRange(newStart, newStart + selectedText.length);
    }, 0);
  };

  // Simple markdown to HTML converter for preview
  const renderPreview = (markdown: string): string => {
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-green-400 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-green-400 mt-5 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-green-300 mt-6 mb-3">$1</h1>')
      // Bold and Italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-white"><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-gray-200">$1</em>')
      // Code
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 rounded text-green-400">$1</code>')
      // Blockquote
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-green-500 pl-4 my-2 text-gray-300 italic">$1</blockquote>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-green-400 underline hover:text-green-300">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2" />')
      // Unordered lists
      .replace(/^- (.*$)/gm, '<li class="text-gray-200 ml-4">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gm, '<li class="text-gray-200 ml-4">$1</li>')
      // Line breaks
      .replace(/\n/g, '<br />');

    return html;
  };

  const toolbarButtons = [
    { icon: Heading1, action: () => insertText('# ', '', true), title: 'Heading 1' },
    { icon: Heading2, action: () => insertText('## ', '', true), title: 'Heading 2' },
    { icon: Bold, action: () => insertText('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Italic' },
    { icon: Quote, action: () => insertText('> ', '', true), title: 'Quote' },
    { icon: Code, action: () => insertText('`', '`'), title: 'Code' },
    { icon: List, action: () => insertText('- ', '', true), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertText('1. ', '', true), title: 'Numbered List' },
    { icon: Link2, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: Image, action: () => insertText('![alt text](', ')'), title: 'Image' },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="rich-editor" className="text-white text-lg font-semibold flex items-center gap-2">
        <Edit3 className="h-5 w-5 text-green-400" />
        {label}
      </Label>

      <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-800">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-gray-700 border-b border-gray-600">
          {toolbarButtons.map((btn, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={btn.action}
              className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600"
              title={btn.title}
            >
              <btn.icon className="h-4 w-4" />
            </Button>
          ))}

          <div className="flex-1" />

          {/* View Toggle */}
          <div className="flex border border-gray-600 rounded overflow-hidden">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("write")}
              className={`h-8 px-3 rounded-none ${activeTab === "write" ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-600"}`}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Write
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("preview")}
              className={`h-8 px-3 rounded-none ${activeTab === "preview" ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-600"}`}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "write" ? (
          <Textarea
            id="rich-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="border-0 rounded-none bg-gray-800 text-white focus:ring-0 focus:border-0 font-mono text-sm resize-none"
            style={{ minHeight: `${rows * 24}px` }}
          />
        ) : (
          <div
            className="p-4 min-h-[240px] text-gray-200 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) || '<p class="text-gray-500">Nothing to preview</p>' }}
          />
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">
          Supports Markdown: # headings, **bold**, *italic*, `code`, [links](url), and lists
        </p>
        <p className="text-xs text-gray-500">
          {value.length} characters
        </p>
      </div>
    </div>
  );
};

export default RichTextEditor;
