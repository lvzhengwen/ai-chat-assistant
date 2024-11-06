import { Rating, Comment } from '@/types/video'

interface UserRatingPanelProps {
  rating: Rating
  comments: Comment[]
  onClose: () => void
}

export default function UserRatingPanel({ rating, comments, onClose }: UserRatingPanelProps) {
  const handleExportToExcel = async () => {
    try {
      // 动态导入 xlsx
      const XLSX = await import('xlsx')
      
      // 准备导出数据
      const exportData = comments.map((comment, index) => ({
        序号: index + 1,
        用户名: comment.author,
        评分: comment.ratingText,
        观看时长: comment.time,
        标签: comment.tags?.join(', ') || '',
        评论内容: comment.content
      }))

      // 创建工作簿
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // 设置列宽
      const colWidths = [
        { wch: 6 },  // 序号
        { wch: 15 }, // 用户名
        { wch: 8 },  // 评分
        { wch: 15 }, // 观看时长
        { wch: 20 }, // 标签
        { wch: 100 } // 评论内容
      ]
      ws['!cols'] = colWidths

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(wb, ws, '用户评价')

      // 导出文件
      XLSX.writeFile(wb, '用户评价.xlsx')
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold">用户评价</h2>
          <div className="flex items-center gap-4">
            {/* 导出按钮 */}
            <button
              onClick={handleExportToExcel}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出评论
            </button>
            {/* 关闭按钮 */}
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
          {/* 评分概览 */}
          <div className="flex items-start gap-8 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500">{rating.score}</div>
              <div className="text-sm text-gray-500 mt-1">{rating.totalCount}</div>
            </div>
            
            <div className="flex-1">
              <div className="space-y-2">
                {rating.distribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-16 text-sm">{item.label}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-16 text-sm text-right">{item.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-6">
                {/* 用户信息和评分 */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{comment.author}</span>
                    {comment.ratingText && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                        {comment.ratingText}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{comment.time}</span>
                </div>

                {/* 评论标签 */}
                {comment.tags && comment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {comment.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 评论内容 */}
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 