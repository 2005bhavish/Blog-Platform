import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import BlogCard from '@/components/blog/BlogCard';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  slug: string;
  author_id: string;
  published: boolean;
  profiles?: {
    display_name: string;
    avatar_url?: string | null;
  };
}

interface RealtimePostFeedProps {
  posts: Post[];
  onNewPost: (post: Post) => void;
}

const RealtimePostFeed: React.FC<RealtimePostFeedProps> = ({ posts, onNewPost }) => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [newPostsCount, setNewPostsCount] = useState(0);

  useEffect(() => {
    // Set up real-time subscription for new posts
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: 'published=eq.true'
        },
        async (payload) => {
          const newPost = payload.new as Post;
          
          // Fetch the author profile for the new post
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', newPost.author_id)
            .single();

          const enrichedPost = {
            ...newPost,
            profiles: profile
          };

          // Add to recent posts
          setRecentPosts(prev => [enrichedPost, ...prev.slice(0, 4)]);
          setNewPostsCount(prev => prev + 1);
          
          // Show toast notification
          toast({
            title: "📝 New Story Published!",
            description: `${profile?.display_name || 'Someone'} just published "${newPost.title}"`,
          });

          // Call parent callback
          onNewPost(enrichedPost);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: 'published=eq.true'
        },
        async (payload) => {
          const updatedPost = payload.new as Post;
          
          // Only show notification if post was just published (not just updated)
          if (payload.old && !(payload.old as any).published && updatedPost.published) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name, avatar_url')
              .eq('id', updatedPost.author_id)
              .single();

            const enrichedPost = {
              ...updatedPost,
              profiles: profile
            };

            setRecentPosts(prev => [enrichedPost, ...prev.slice(0, 4)]);
            setNewPostsCount(prev => prev + 1);
            
            toast({
              title: "🔥 Story Just Went Live!",
              description: `${profile?.display_name || 'Someone'} published "${updatedPost.title}"`,
            });

            onNewPost(enrichedPost);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewPost]);

  // Clear new posts count after a delay
  useEffect(() => {
    if (newPostsCount > 0) {
      const timer = setTimeout(() => {
        setNewPostsCount(0);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [newPostsCount]);

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Live Updates Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-primary animate-pulse">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Live Updates</h3>
            <p className="text-xs text-muted-foreground">Stories published in real-time</p>
          </div>
        </div>
        
        {newPostsCount > 0 && (
          <Badge variant="secondary" className="animate-bounce">
            {newPostsCount} new
          </Badge>
        )}
      </div>

      {/* Recent Posts */}
      <div className="space-y-3">
        {recentPosts.map((post, index) => (
          <div 
            key={post.id} 
            className={`transform transition-all duration-500 ${
              index === 0 ? 'animate-slide-in-from-top' : ''
            }`}
          >
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/70 transition-colors">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>by {post.profiles?.display_name || 'Anonymous'}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              
              <Badge variant="outline" className="text-xs">
                Live
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealtimePostFeed;