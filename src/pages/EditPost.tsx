import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenTool, Save, Eye, Send, Zap, Tag, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBlog } from '@/hooks/useBlog';
import { toast } from '@/hooks/use-toast';
import AdvancedEditor from '@/components/editor/AdvancedEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Post = Tables<'posts'> & {
  post_categories?: Array<{
    category_id: string;
    categories: {
      id: string;
      name: string;
      color?: string;
    };
  }>;
};

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, loading: blogLoading } = useBlog();
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const fetchPost = async () => {
    if (!postId || !user) return;

    try {
      setFetchLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_categories (
            category_id,
            categories (
              id,
              name,
              color
            )
          )
        `)
        .eq('id', postId)
        .eq('author_id', user.id)
        .single();

      if (error) throw error;

      setPost(data);
      setTitle(data.title);
      setContent(data.content);
      setExcerpt(data.excerpt || '');
      setFeaturedImage(data.featured_image || '');
      setSelectedCategories(
        data.post_categories?.map(pc => pc.category_id) || []
      );
    } catch (error: any) {
      console.error('Error fetching post:', error);
      toast({
        title: "Error",
        description: "Post not found or you don't have permission to edit it.",
        variant: "destructive",
      });
      navigate('/profile');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!title.trim() || !content.trim() || !post) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Update post
      const { error: postError } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          content,
          excerpt: excerpt.trim() || null,
          featured_image: featuredImage || null,
          published: !isDraft,
          slug,
          published_at: !isDraft && !post.published ? new Date().toISOString() : post.published_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id);

      if (postError) throw postError;

      // Update categories
      // First, delete existing categories
      await supabase
        .from('post_categories')
        .delete()
        .eq('post_id', post.id);

      // Then add new categories
      if (selectedCategories.length > 0) {
        const categoryData = selectedCategories.map(categoryId => ({
          post_id: post.id,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from('post_categories')
          .insert(categoryData);

        if (categoryError) {
          console.error('Error updating categories:', categoryError);
        }
      }

      toast({
        title: isDraft ? "Draft Saved!" : "Post Updated! 🎉",
        description: isDraft 
          ? "Your draft has been saved successfully." 
          : "Your story has been updated and is now live.",
      });
      
      navigate(`/post/${slug}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
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

  useEffect(() => {
    if (user) {
      fetchPost();
    }
  }, [postId, user]);

  if (!user) {
    return null;
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Button onClick={() => navigate('/profile')}>Go to Profile</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="group mb-4">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
                <PenTool className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Edit Your Story
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Perfect your narrative and share your updated insights with the world.
              </p>
            </div>
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
                  {loading ? 'Updating...' : post.published ? 'Update Story' : 'Publish Story'}
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

              {/* Post Status */}
              <Card className="border-0 bg-card/30">
                <CardHeader>
                  <CardTitle className="text-lg">Post Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated:</span>
                      <span>{new Date(post.updated_at).toLocaleDateString()}</span>
                    </div>
                    {post.published_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Published:</span>
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preview Link */}
              {post.published && (
                <Card className="border-0 bg-card/30">
                  <CardContent className="p-4">
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`/post/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Post
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;