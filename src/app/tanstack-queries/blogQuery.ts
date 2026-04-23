import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
  position: number;
  publishedAt: string | null;
  createdAt: string;
}

const fetchPublishedPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data } = await axiosInstance.get(API_ENDPOINTS.BLOG_PUBLISHED);
    const result = data?.data ?? data;
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
};

const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.BLOG_BY_SLUG}/${slug}`);
    return data?.data ?? data;
  } catch {
    return null;
  }
};

export const useBlogPostsQuery = (enabled = true) =>
  useQuery<BlogPost[]>({
    queryKey: ['blog-posts-public'],
    queryFn: fetchPublishedPosts,
    enabled,
    staleTime: 1000 * 60 * 5,
  });

export const useBlogPostBySlugQuery = (slug: string, enabled = true) =>
  useQuery<BlogPost | null>({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchPostBySlug(slug),
    enabled: enabled && !!slug,
  });
