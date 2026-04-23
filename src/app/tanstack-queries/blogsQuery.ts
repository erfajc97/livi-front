import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/app/features/blog/services/blogService'

export function useBlogsQuery() {
  return useQuery({
    queryKey: ['blogs', 'published'],
    queryFn: () => blogService.fetchPublishedPosts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useBlogBySlugQuery(slug: string) {
  return useQuery({
    queryKey: ['blog', 'slug', slug],
    queryFn: () => blogService.fetchPostBySlug(slug),
    enabled: !!slug,
  })
}
