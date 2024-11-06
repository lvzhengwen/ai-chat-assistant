'use client'

import { useState } from 'react'
import { searchVideo } from '@/utils/video-search'
import type { VideoResult } from '@/types/video'
import UserRatingPanel from '@/components/UserRatingPanel'

export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<VideoResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null)
  const [showRating, setShowRating] = useState(false)
  const [loadingComments, setLoadingComments] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!keyword.trim()) return
    
    setLoading(true)
    try {
      const data = await searchVideo(keyword)
      setResults(data)
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetComments = async (video: VideoResult, e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    setLoadingComments(video.href)
    try {
      const response = await fetch(`/api/video-detail?url=${encodeURIComponent(video.href)}`)
      const data = await response.json()
      setSelectedVideo({
        ...video,
        rating: data.rating,
        comments: data.comments
      })
      setShowRating(true)
    } catch (error) {
      console.error('获取视频详情失败:', error)
    } finally {
      setLoadingComments(null)
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* 搜索框 */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="输入搜索关键词"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '搜索中...' : '搜索'}
        </button>
      </div>

      {/* 搜索结果列表 */}
      <div className="space-y-8">
        {results.map((video, index) => (
          <div 
            key={index}
            className="flex gap-6 p-4 bg-white rounded-lg shadow"
          >
            {/* 左侧海报 - 可点击跳转 */}
            <a 
              href={video.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-48 flex-shrink-0 transition-transform hover:scale-105"
            >
              <div className="relative aspect-[3/4]">
                <img 
                  src={video.imgSrc} 
                  alt={video.title} 
                  className="w-full h-full object-cover rounded"
                />
                {video.isVip && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-xs text-white px-2 py-1 rounded">
                    VIP
                  </span>
                )}
              </div>
            </a>
            
            {/* 右侧信息 */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">{video.title}</h2>
              {video.englishName && (
                <p className="text-gray-600 mb-2">{video.englishName}</p>
              )}
              {video.subTitle && (
                <p className="text-sm text-gray-500 mb-2">{video.subTitle}</p>
              )}
              {video.type && (
                <span className="inline-block text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded mb-3">
                  {video.type}
                </span>
              )}
              
              {/* 导演和演员信息 */}
              <div className="space-y-2 mb-4">
                {video.director && (
                  <p className="text-sm">
                    <span className="text-gray-500">导演：</span>
                    <span>{video.director}</span>
                  </p>
                )}
                {video.actors && video.actors.length > 0 && (
                  <p className="text-sm">
                    <span className="text-gray-500">主演：</span>
                    <span>{video.actors.join('、')}</span>
                  </p>
                )}
              </div>

              {video.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {video.description}
                </p>
              )}

              {/* 获取评论按钮 */}
              <button
                onClick={(e) => handleGetComments(video, e)}
                disabled={loadingComments === video.href}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
              >
                {loadingComments === video.href ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>获取评论中...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    <span>获取评论</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 无搜索结果提示 */}
      {results.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          暂无搜索结果
        </div>
      )}

      {/* 用户评价弹窗 */}
      {showRating && selectedVideo?.rating && selectedVideo?.comments && (
        <UserRatingPanel
          rating={selectedVideo.rating}
          comments={selectedVideo.comments.comments}
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  )
} 