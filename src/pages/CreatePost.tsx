import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenTool, Save, Eye, Send, Zap, Tag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBlog } from '@/hooks/useBlog';
import { toast } from '@/hooks/use-toast';
import AdvancedEditor from '@/components/editor/AdvancedEditor';
import ActiveWriters from '@/components/realtime/ActiveWriters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPost, categories, loading: blogLoading } = useBlog();
  
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSubmit = async (isDraft = false) => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await createPost({
        title: title.trim(),
        content,
        excerpt: excerpt.trim() || null,
        featured_image: featuredImage || null,
        published: !isDraft,
        categoryIds: selectedCategories,
      });

      if (!error) {
        toast({
          title: isDraft ? "Draft Saved!" : "Post Published! 🎉",
          description: isDraft 
            ? "Your draft has been saved successfully." 
            : "Your story is now live and visible to all readers.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Create Your Story
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Share your experiences, insights, and creativity with our community. 
              Your story matters and deserves to be heard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - Wider Column */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="border-0 shadow-elegant bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Advanced Editor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedEditor
                    title={title}
                    content={content}
                    onTitleChange={setTitle}
                    onContentChange={setContent}
                    excerpt={excerpt}
                    onExcerptChange={setExcerpt}
                    featuredImage={featuredImage}
                    onFeaturedImageChange={setFeaturedImage}
                  />
                </CardContent>
              </Card>

              {/* Publishing Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => handleSubmit(false)}
                  className="btn-hero flex-1"
                  disabled={loading || blogLoading}
                  size="lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {loading ? 'Publishing...' : 'Publish Story'}
                </Button>
                
                <Button
                  onClick={() => handleSubmit(true)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading || blogLoading}
                  size="lg"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? 'Saving...' : 'Save as Draft'}
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="w-5 h-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select onValueChange={addCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter(category => !selectedCategories.includes(category.id))
                        .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((categoryId) => {
                        const category = categories.find(c => c.id === categoryId);
                        return category ? (
                          <Badge 
                            key={categoryId} 
                            variant="secondary" 
                            className="flex items-center gap-2 p-2"
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                            <button
                              type="button"
                              onClick={() => removeCategory(categoryId)}
                              className="hover:text-destructive transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Writers */}
              <ActiveWriters />

              {/* Writing Tips */}
              <Card className="border-0 bg-card/30">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Writing Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <p>Use the rich editor to format your text, add images, and create engaging content.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <p>Add a compelling featured image to make your story stand out.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <p>Choose relevant categories to help readers discover your content.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <p>Save as draft to continue editing later, or publish when ready to go live!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;