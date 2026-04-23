import axios from 'axios'
import { API_ENDPOINTS } from '@/app/api/endpoints'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api'

export interface BlogPost {
  id: number | string
  title: string
  slug: string
  excerpt: string | null
  content: string
  imageUrl: string | null
  imageKey: string | null
  isPublished: boolean
  position: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export const blogService = {
  async fetchPublishedPosts(): Promise<BlogPost[]> {
    const { data } = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.BLOG_PUBLISHED}`)
    // Backend wrapper: { statusCode, data: [...] }
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
  },

  async fetchPostBySlug(slug: string): Promise<BlogPost> {
    const { data } = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.BLOG_BY_SLUG}/${slug}`)
    // Backend wrapper: { statusCode, data: {...} }
    return data?.data ?? data
  },
}
