import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  Share2, 
  BookOpen,
  ArrowLeft,
  Heart,
  MessageCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Post = Tables<'posts'> & {
  profiles?: {
    display_name: string;
    avatar_url?: string;
  };
  categories?: Array<{
    categories: {
      name: string;
      color?: string;
      slug: string;
    };
  }>;
};

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            display_name,
            avatar_url
          ),
          post_categories (
            categories (
              name,
              color,
              slug
            )
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      // Check if user can view this post
      if (!data.published && (!user || data.author_id !== user.id)) {
        throw new Error('Post not found');
      }

      setPost(data);
    } catch (error: any) {
      console.error('Error fetching post:', error);
      toast({
        title: "Error",
        description: "Post not found or you don't have permission to view it.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !user) return;

    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)
        .eq('author_id', user.id);

      if (error) throw error;

      toast({
        title: "Post Deleted",
        description: "Your post has been deleted successfully.",
      });
      
      navigate('/profile');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || 'Check out this story',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Post link copied to clipboard.",
      });
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isAuthor = user && user.id === post.author_id;
  const readTime = Math.ceil(post.content.length / 200);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>

          {/* Article Header */}
          <Card className="border-0 shadow-elegant bg-card/80 backdrop-blur-sm overflow-hidden">
            {post.featured_image && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}
            
            <CardContent className="p-8">
              {/* Draft Badge */}
              {!post.published && (
                <Badge variant="secondary" className="mb-4">
                  Draft
                </Badge>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Author & Meta */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Author */}
                  <Link 
                    to={`/profile/${post.author_id}`}
                    className="flex items-center gap-3 group"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.profiles?.avatar_url || ''} alt={post.profiles?.display_name} />
                      <AvatarFallback>
                        {(post.profiles?.display_name || 'A').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {post.profiles?.display_name || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {readTime} min read
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  
                  {isAuthor && (
                    <>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/edit/${post.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this post? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.categories.map((pc, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-3 py-1"
                      style={{ 
                        backgroundColor: `${pc.categories.color}20`,
                        color: pc.categories.color || 'inherit',
                        borderColor: `${pc.categories.color}40`
                      }}
                    >
                      {pc.categories.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="border-0 shadow-elegant bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-blockquote:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Author Bio */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">About the Author</h3>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={post.profiles?.avatar_url || ''} alt={post.profiles?.display_name} />
                  <AvatarFallback>
                    {(post.profiles?.display_name || 'A').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Link 
                    to={`/profile/${post.author_id}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {post.profiles?.display_name || 'Anonymous'}
                  </Link>
                  <p className="text-muted-foreground mt-1">
                    Writer and storyteller sharing experiences and insights.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link to={`/profile/${post.author_id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PostDetail;