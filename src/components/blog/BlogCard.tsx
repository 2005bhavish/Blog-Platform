import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, Tag, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: number;
  tags: string[];
  image?: string;
  slug: string;
  isDraft?: boolean;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="blog-card bg-card border-border overflow-hidden group relative">
      <Link to={`/post/${post.slug}`} className="block">
        {/* Image */}
        {post.image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="blog-card-overlay absolute inset-0" />
            {post.isDraft && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-background/80 text-foreground">
                  <Edit className="w-3 h-3 mr-1" />
                  Draft
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Draft Badge for posts without images */}
          {post.isDraft && !post.image && (
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">
                <Edit className="w-3 h-3 mr-1" />
                Draft
              </Badge>
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;