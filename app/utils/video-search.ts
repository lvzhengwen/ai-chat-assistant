import type { VideoResult } from '@/types/video'

export async function searchVideo(keyword: string): Promise<VideoResult[]> {
  const response = await fetch(`/api/video-search?keyword=${encodeURIComponent(keyword)}`)
  if (!response.ok) {
    throw new Error('搜索失败')
  }
  return response.json()
} 