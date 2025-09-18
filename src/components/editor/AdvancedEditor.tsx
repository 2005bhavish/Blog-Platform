import React, { useCallback, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, Bold, Italic, List, Link2, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdvancedEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  excerpt: string;
  onExcerptChange: (excerpt: string) => void;
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
}

const AdvancedEditor: React.FC<AdvancedEditorProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  excerpt,
  onExcerptChange,
  featuredImage,
  onFeaturedImageChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      toast({
        title: "Image uploaded successfully!",
        description: "Your image has been added to the post.",
      });

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFeaturedImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await handleImageUpload(file);
    if (url) {
      onFeaturedImageChange(url);
    }
  }, [handleImageUpload, onFeaturedImageChange]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      const file = imageFiles[0];
      const url = await handleImageUpload(file);
      if (url && !featuredImage) {
        onFeaturedImageChange(url);
      }
    }
  }, [handleImageUpload, featuredImage, onFeaturedImageChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const insertImageInContent = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const url = await handleImageUpload(file);
      if (url) {
        const imageHtml = `<img src="${url}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
        onContentChange(content + imageHtml);
      }
    };
    input.click();
  }, [handleImageUpload, content, onContentChange]);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: insertImageInContent
      }
    },
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'align', 'list', 'bullet',
    'blockquote', 'code-block', 'link', 'image'
  ];

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter your post title..."
          className="text-lg p-4 h-auto"
        />
      </div>

      {/* Featured Image Upload */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Featured Image</Label>
        <div 
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
          } ${featuredImage ? 'bg-muted/30' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {featuredImage ? (
            <div className="space-y-4">
              <img 
                src={featuredImage} 
                alt="Featured" 
                className="max-w-full h-48 object-cover mx-auto rounded-lg shadow-md"
              />
              <Button
                variant="outline"
                onClick={() => onFeaturedImageChange('')}
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-muted">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">
                  Drag and drop an image here, or click to upload
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                  id="featured-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('featured-upload')?.click()}
                  disabled={uploading}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Choose Image'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Excerpt Input */}
      <div className="space-y-2">
        <Label htmlFor="excerpt" className="text-lg font-semibold">Excerpt</Label>
        <Input
          id="excerpt"
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="A brief description of your post..."
          className="p-3"
        />
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold">Content</Label>
        <div className="border rounded-lg overflow-hidden bg-background">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={onContentChange}
            modules={modules}
            formats={formats}
            placeholder="Start writing your story..."
            style={{
              height: '400px',
              marginBottom: '42px'
            }}
          />
        </div>
      </div>

      {/* Quick Formatting Tips */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Quote className="w-4 h-4" />
          Formatting Tips
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Bold className="w-3 h-3" />
            <span>Ctrl+B for bold</span>
          </div>
          <div className="flex items-center gap-2">
            <Italic className="w-3 h-3" />
            <span>Ctrl+I for italic</span>
          </div>
          <div className="flex items-center gap-2">
            <List className="w-3 h-3" />
            <span>Lists & bullets</span>
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-3 h-3" />
            <span>Add links</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedEditor;