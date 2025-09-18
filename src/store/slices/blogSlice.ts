import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BlogPost {
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
  isDraft: boolean;
}

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    tags: string[];
    category: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

const initialState: BlogState = {
  posts: [
    // Mock data for development
    {
      id: '1',
      title: 'Building Modern Web Applications with React and TypeScript',
      excerpt: 'Explore the power of combining React with TypeScript to create scalable, maintainable web applications. Learn best practices and advanced patterns.',
      content: 'Full content here...',
      author: {
        name: 'Emma Johnson',
        avatar: '/avatars/emma.jpg'
      },
      publishedAt: '2024-01-15T10:00:00Z',
      readTime: 8,
      tags: ['React', 'TypeScript', 'Web Development'],
      image: '/images/react-typescript.jpg',
      slug: 'building-modern-web-applications-react-typescript',
      isDraft: false,
    },
    {
      id: '2',
      title: 'The Art of Minimalist Design in Digital Products',
      excerpt: 'Discover how minimalist design principles can enhance user experience and create more intuitive digital products.',
      content: 'Full content here...',
      author: {
        name: 'Alex Chen',
        avatar: '/avatars/alex.jpg'
      },
      publishedAt: '2024-01-12T14:30:00Z',
      readTime: 6,
      tags: ['Design', 'UX', 'Minimalism'],
      image: '/images/minimalist-design.jpg',
      slug: 'art-of-minimalist-design-digital-products',
      isDraft: false,
    },
    {
      id: '3',
      title: 'Understanding Modern CSS Grid and Flexbox',
      excerpt: 'Master the modern CSS layout techniques that every web developer should know. Complete guide with practical examples.',
      content: 'Full content here...',
      author: {
        name: 'Sarah Miller',
        avatar: '/avatars/sarah.jpg'
      },
      publishedAt: '2024-01-10T09:15:00Z',
      readTime: 12,
      tags: ['CSS', 'Web Development', 'Layout'],
      image: '/images/css-grid-flexbox.jpg',
      slug: 'understanding-modern-css-grid-flexbox',
      isDraft: false,
    },
  ],
  currentPost: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    tags: [],
    category: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 9,
  },
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPosts: (state, action: PayloadAction<BlogPost[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<BlogPost>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<BlogPost>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    setCurrentPost: (state, action: PayloadAction<BlogPost | null>) => {
      state.currentPost = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<BlogState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<BlogState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setCurrentPost,
  setError,
  setFilters,
  setPagination,
  clearError,
} = blogSlice.actions;

export default blogSlice.reducer;