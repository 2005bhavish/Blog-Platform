import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/blog/HeroSection';
import BlogCard from '@/components/blog/BlogCard';
import ActiveWriters from '@/components/realtime/ActiveWriters';
import RealtimePostFeed from '@/components/realtime/RealtimePostFeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TrendingUp, Clock, Users, Zap, PenTool, Search, Filter, Star } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import { useAuth } from '@/hooks/useAuth';

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
  categories?: Array<{
    categories: {
      name: string;
      color?: string;
    };
  }>;
}

const Home = () => {
  const { posts, loading } = useBlog();
  const { user } = useAuth();
  const [allPosts, setAllPosts] = useState<Post[]>(posts);
  const [searchQuery, setSearchQuery] = useState('');

  // Update posts when new posts are received from real-time feed
  const handleNewPost = useCallback((newPost: Post) => {
    setAllPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);

  // Use allPosts if we have real-time updates, otherwise use posts from hook
  const displayPosts = allPosts.length > 0 ? allPosts : posts;
  
  // Filter posts based on search
  const filteredPosts = displayPosts.filter(post => 
    searchQuery === '' || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredPosts = filteredPosts.slice(0, 3);
  const recentPosts = filteredPosts.slice(3);

  const transformPostForCard = (post: Post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content,
    author: { 
      name: post.profiles?.display_name || 'Anonymous',
      avatar: post.profiles?.avatar_url
    },
    publishedAt: post.published_at || post.created_at,
    readTime: Math.ceil(post.content.length / 200),
    tags: post.categories?.map(pc => pc.categories.name) || [],
    slug: post.slug,
    image: post.featured_image || undefined
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Search and Featured Posts */}
            <section>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="space-y-2 mb-6 lg:mb-0">
                  <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                    <Star className="w-8 h-8 text-primary" />
                    Featured Stories
                  </h2>
                  <p className="text-muted-foreground">
                    Handpicked stories from our community of writers
                  </p>
                </div>
                
                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search stories..."
                      className="pl-10 w-full sm:w-80"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Featured Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-muted rounded-2xl h-64 mb-4"></div>
                      <div className="bg-muted rounded h-4 mb-2"></div>
                      <div className="bg-muted rounded h-4 w-3/4"></div>
                    </div>
                  ))
                ) : featuredPosts.length > 0 ? (
                  featuredPosts.map((post, index) => (
                    <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <BlogCard post={transformPostForCard(post)} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="mb-4">
                      <PenTool className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    </div>
                    <p className="text-muted-foreground text-lg mb-2">No posts available yet.</p>
                    <p className="text-muted-foreground mb-6">Be the first to share your story!</p>
                    {user && (
                      <Button asChild className="btn-hero">
                        <Link to="/create">Write Your First Story</Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Recent Posts Section */}
            {recentPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  <h3 className="text-2xl font-bold text-foreground">Latest Stories</h3>
                  <Badge variant="secondary" className="ml-2">
                    {recentPosts.length} stories
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {recentPosts.slice(0, 6).map((post, index) => (
                    <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <BlogCard post={transformPostForCard(post)} />
                    </div>
                  ))}
                </div>

                {recentPosts.length > 6 && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg">
                      Load More Stories
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Call-to-Action */}
            <section className="text-center p-8 bg-gradient-primary rounded-2xl shadow-glow">
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Share Your Story?
                </h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Join thousands of writers who are already sharing their thoughts, experiences, and insights with the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/register">Get Started for Free</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Real-time Post Feed */}
            <RealtimePostFeed posts={displayPosts} onNewPost={handleNewPost} />
            
            {/* Active Writers */}
            <ActiveWriters />

            {/* Stats Card */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-gradient-primary">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  Platform Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Stories</span>
                  <Badge variant="secondary">{displayPosts.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">This Week</span>
                  <Badge variant="secondary">
                    {displayPosts.filter(p => {
                      const postDate = new Date(p.created_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return postDate > weekAgo;
                    }).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Featured</span>
                  <Badge variant="secondary">{featuredPosts.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {user && (
              <Card className="border-0 bg-card/30">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full btn-hero">
                    <Link to="/create">
                      <PenTool className="w-4 h-4 mr-2" />
                      Write New Story
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Browse Writers
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;