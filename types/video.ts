// 已有的 VideoResult 接口保持不变
export interface VideoResult {
  href: string
  imgSrc: string
  title: string
  subTitle: string
  type: string
  isVip: boolean
  director: string
  actors: string[]
  alias: string[]
  englishName: string
  description: string
  rating: Rating
}

// 新增 Rating 和 VideoDetail 接口
export interface Rating {
  score: string
  totalCount: string
  distribution: ScoreDistribution[]
  comments: Comment[]
}

// 新增评分分布接口
export interface ScoreDistribution {
  label: string    // 星级标签
  percentage: number  // 百分比
}

export interface Comment {
  content: string   // 评论内容
  author: string    // 评论作者
  time: string      // 评论时间
  avatar?: string   // 可选的头像URL
}

export interface VideoDetail {
  rating: Rating
} 