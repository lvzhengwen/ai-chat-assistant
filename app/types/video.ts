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
  comments?: VideoComments
}

export interface Rating {
  score: string
  totalCount: string
  distribution: {
    label: string
    percentage: number
  }[]
  comments: Comment[]
}

export interface Comment {
  id: string
  author: string
  content: string
  time: string
  likes?: number
  ratingText?: string
  tags?: string[]
}

export interface VideoComments {
  total: number
  comments: Comment[]
}

export interface VideoDetail {
  comments?: VideoComments
} 