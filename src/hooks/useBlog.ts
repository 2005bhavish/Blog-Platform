import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

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

export const useBlog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
  const { user } = useAuth();

  const fetchPosts = async () => {
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
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const createPost = async (postData: {
    title: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    published: boolean;
    categoryIds?: string[];
  }) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      });
      return { error: new Error('Not authenticated') };
    }

    try {
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          featured_image: postData.featured_image,
          published: postData.published,
          slug,
          author_id: user.id,
          published_at: postData.published ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (postError) {
        throw postError;
      }

      // Add categories if provided
      if (postData.categoryIds && postData.categoryIds.length > 0) {
        const categoryData = postData.categoryIds.map(categoryId => ({
          post_id: post.id,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from('post_categories')
          .insert(categoryData);

        if (categoryError) {
          console.error('Error adding categories:', categoryError);
        }
      }

      toast({
        title: postData.published ? "Post Published!" : "Draft Saved!",
        description: postData.published 
          ? "Your post has been published successfully." 
          : "Your draft has been saved.",
      });

      // Refresh posts
      fetchPosts();

      return { data: post, error: null };
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const fetchUserPosts = async () => {
    if (!user) return;

    try {
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
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching user posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your posts. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  return {
    posts,
    categories,
    loading,
    createPost,
    fetchPosts,
    fetchUserPosts,
    fetchCategories,
  };
};