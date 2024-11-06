'use client'

import type { Rating } from '@/types/video'

export default function VideoRating({ rating }: { rating: Rating }) {
  if (!rating) {
    return null
  }

  const { score, totalCount, distribution, comments } = rating

  return (
    <div className="space-y-8">
      {/* 评分概览 */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-500">{score || '暂无'}</div>
          <div className="text-sm text-gray-500">总评分</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">{totalCount || '暂无评分'}</div>
          {/* 评分分布 */}
          <div className="space-y-1">
            {distribution?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sm">{item.label}</span>
                <div className="h-2 bg-gray-200 rounded-full flex-1">
                  <div 
                    className="h-full bg-orange-500 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 用户评论列表 */}
      <div className="space-y-6">
        {comments?.length > 0 ? (
          comments.map((comment, idx) => (
            <div key={idx} className="border-b pb-4">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={'/default-avatar.png'} 
                  alt={'头像'} 
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium">{comment.author}</div>
                  <div className="text-sm text-gray-500">{comment.time}</div>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">暂无评论</div>
        )}
      </div>
    </div>
  )
} 