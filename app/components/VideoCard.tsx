import { VideoResult, VideoDetail, Comment } from '@/types/video'

interface VideoCardProps {
  video: VideoResult
  onClick: () => void
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 可点击的视频信息卡片 */}
      <div 
        className="flex gap-4 p-4 border rounded cursor-pointer hover:bg-gray-50"
        onClick={onClick}
      >
        <div className="relative w-40 h-24 flex-shrink-0">
          <img 
            src={video.imgSrc} 
            alt={video.title}
            className="w-full h-full object-cover rounded"
          />
          {video.isVip && (
            <span className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-1 rounded">
              VIP
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg mb-1 truncate">{video.title}</h3>
          {video.subTitle && (
            <p className="text-sm text-gray-500 mb-1">{video.subTitle}</p>
          )}
          {video.type && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {video.type}
            </span>
          )}
        </div>
      </div>

      {/* 评论列表部分 - 不可点击 */}
      {video.comments && video.comments.comments.length > 0 && (
        <div className="px-4">
          <div className="border rounded-lg overflow-hidden">
            {/* 评论标题栏 */}
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="font-medium text-gray-700">
                用户评价 ({video.comments.total})
              </h4>
            </div>

            {/* 评论列表 */}
            <div className="divide-y">
              {video.comments.comments.map((comment) => (
                <div key={comment.id} className="p-4 hover:bg-gray-50">
                  {/* 用户信息行 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800">
                        {comment.author}
                      </span>
                      {comment.ratingText && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs">
                          {comment.ratingText}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {comment.time}
                    </span>
                  </div>

                  {/* 评论标签 */}
                  {comment.tags && comment.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {comment.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 评论内容 */}
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>

            {/* 如果评论数量大于5，显示查看更多按钮 */}
            {video.comments.total > 5 && (
              <div className="px-4 py-3 bg-gray-50 border-t text-center">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation() // 防止触发卡片的点击事件
                    // 这里可以添加查看更多评论的逻辑
                  }}
                >
                  查看更多评论
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 