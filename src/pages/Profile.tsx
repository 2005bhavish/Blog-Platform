import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlogCard from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
Edit, 
Calendar, 
  MapPin, 
  Link as LinkIcon, 
  BookOpen, 
  Users, 
  TrendingUp,
  Settings,
Camera,
Save,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBlog } from '@/hooks/useBlog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type Post = Tables<'posts'> & {
  profiles?: {
    display_name: string;
    avatar_url?: string;
  };
  categories?: Array<{
    categories: {
      name: string;
      color?: string;
    };
  }>;
};

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchUserPosts } = useBlog();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
  
  const isOwnProfile = !userId || userId === user?.id;

    const fetchProfile = async () => {
    try {
      const profileId = userId || user?.id;
      if (!profileId) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
      setEditedProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
title: "Error",
description: "Failed to load profile.",
variant: "destructive",
});
    }
  };

    const fetchPosts = async () => {
    try {
      const profileId = userId || user?.id;
      if (!profileId) return;

      const query = supabase
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
              color
            )
          )
        `)
        .eq('author_id', profileId)
        .order('created_at', { ascending: false });

// If not own profile, only show published posts
      if (!isOwnProfile) {
query.eq('published', true);
}

      const { data, error } = await query;

      if (error) throw error;
      setUserPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
    }
  };

    const handleUpdateProfile = async () => {
    if (!user || !profile) return;

    try {
            const { error } = await supabase
        .from('profiles')
        .update(editedProfile)
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...editedProfile });
            setIsEditing(false);
      toast({
title: "Profile Updated",
description: "Your profile has been updated successfully.",
});
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
title: "Update Failed",
description: error.message,
variant: "destructive",
});
    }
    };

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
    image: post.featured_image || undefined,
    isDraft: !post.published
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchPosts()]);
      setLoading(false);
    };

    if (user) {
loadData();
}
  }, [userId, user]);

  const publishedPosts = userPosts.filter(post => post.published);
  const draftPosts = userPosts.filter(post => !post.published);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-2xl" />
            <div className="h-20 bg-muted rounded-xl w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Profile not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="border-0 shadow-elegant bg-card/80 backdrop-blur-sm overflow-hidden">
<div className="relative h-32 bg-gradient-primary">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90" />
            </div>
            
            <CardContent className="relative pt-0 pb-8">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name} />
                  <AvatarFallback className="text-2xl">
{profile.display_name.charAt(0).toUpperCase()}
</AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Button
                      size="icon"
                      variant="secondary"
className="absolute bottom-0 right-0 rounded-full shadow-lg"
>
                      <Camera className="w-4 h-4" />
                    </Button>
                                  )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 pt-4 md:pt-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="display_name">Display Name</Label>
                          <Input
                            id="display_name"
                            value={editedProfile.display_name || ''}
                            onChange={(e) => setEditedProfile({ ...editedProfile, display_name: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editedProfile.bio || ''}
                            onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold text-foreground">{profile.display_name}</h1>
                        {profile.bio && (
<p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
                          )}
                        </>
                      )}
                      
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
<div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(profile.created_at).toLocaleDateString('en-US', { 
month: 'long', 
year: 'numeric' 
})}
                        </div>
                      </div>
                  </div>

                  {/* Action Buttons */}
                  {isOwnProfile && (
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                      {isEditing ? (
                        <>
                          <Button onClick={handleUpdateProfile} className="btn-hero">
                            <Save className="w-4 h-4 mr-2" />
Save
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            <X className="w-4 h-4 mr-2" />
Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
Edit Profile
                        </Button>
                      )}
                    </div>
                  )}
</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="space-y-2">
                  <BookOpen className="w-8 h-8 text-primary mx-auto" />
                  <div className="text-2xl font-bold">{publishedPosts.length}</div>
                  <p className="text-muted-foreground">Published Stories</p>
                </div>
              </CardContent>
            </Card>

            {isOwnProfile && (
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="space-y-2">
                    <Edit className="w-8 h-8 text-accent mx-auto" />
                    <div className="text-2xl font-bold">{draftPosts.length}</div>
                    <p className="text-muted-foreground">Draft Stories</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="space-y-2">
                  <TrendingUp className="w-8 h-8 text-accent mx-auto" />
                  <div className="text-2xl font-bold">
                    {publishedPosts.reduce((acc, post) => acc + Math.ceil(post.content.length / 200), 0)}
                  </div>
                  <p className="text-muted-foreground">Total Read Time (min)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts Section */}
          <div className="space-y-6">
{/* Published Posts */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Published Stories</h2>
                <Badge variant="secondary">{publishedPosts.length}</Badge>
              </div>

              {publishedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedPosts.map((post, index) => (
                    <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <BlogCard post={transformPostForCard(post)} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="border-0 bg-card/30">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
{isOwnProfile ? "You haven't published any stories yet." : "No published stories yet."}
</p>
                    {isOwnProfile && (
<Button className="btn-hero mt-4" onClick={() => navigate('/create')}>
Write Your First Story
</Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Draft Posts - Only for own profile */}
            {isOwnProfile && draftPosts.length > 0 && (
              <div>
                <Separator className="mb-6" />
                <div className="flex items-center gap-2 mb-6">
                  <Edit className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-bold">Draft Stories</h2>
                  <Badge variant="secondary">{draftPosts.length}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {draftPosts.map((post, index) => (
                    <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <BlogCard post={transformPostForCard(post)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;