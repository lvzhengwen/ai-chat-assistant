import { NextResponse } from 'next/server'
import type { VideoDetail, Rating, Comment } from '@/types/video'

let puppeteer: any = null

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoUrl = searchParams.get('url')
  const maxPages = 5 // 限制最大5页

  if (!videoUrl) {
    return NextResponse.json({ error: '需要提供视频 URL' }, { status: 400 })
  }

  let browser;
  try {
    if (!puppeteer) {
      puppeteer = await import('puppeteer')
    }

    console.log('启动浏览器...')
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.platform === 'linux' 
        ? process.env.CHROME_PATH || '/opt/google/chrome/google-chrome'
        : undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    })

    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36')
    
    console.log(`[${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}] 正在访问页面:`, videoUrl)
    await page.goto(videoUrl, { waitUntil: 'networkidle0' })

    // 获取评分信息和第一页评论
    const initialData = await page.evaluate(() => {
      const getVideoTitle = () => {
        const titleEl = document.querySelector('.video-title')
        return titleEl?.textContent?.trim() || '未知视频'
      }

      const getRating = () => {
        const scoreEl = document.querySelector('.card-wheat__percent')
        const countEl = document.querySelector('.user-rating-card__desc')
        const distributionEls = document.querySelectorAll('.user-rating-card__bar-amount .rating-bar')
        const labelEls = document.querySelectorAll('.user-rating-card__label')
        
        return {
          score: scoreEl?.textContent?.trim() || '0',
          totalCount: countEl?.textContent?.trim() || '0',
          distribution: Array.from(distributionEls).map((el, index) => ({
            label: labelEls[index]?.textContent?.trim() || '',
            percentage: parseFloat(el.getAttribute('style')?.match(/width:\s*([\d.]+)%/)?.[1] || '0')
          })),
          comments: []
        }
      }

      const getComments = (startIndex: number = 0) => {
        const comments: any[] = []
        const commentElements = document.querySelectorAll('.user-rating-col__container .user-rating-comment')
        
        commentElements.forEach((element, idx) => {
          const content = element.querySelector('.rating-comment')?.textContent?.trim()
          if (content) {
            comments.push({
              id: Math.random().toString(36).substr(2, 9),
              author: element.querySelector('.rating-user__name')?.textContent?.trim() || '匿名用户',
              content,
              time: element.querySelector('.rating-desc')?.textContent?.trim() || '',
              ratingText: element.querySelector('.rating-stars__title')?.textContent?.trim() || '',
              tags: Array.from(element.querySelectorAll('.rating-tags__tag')).map(tag => tag.textContent?.trim() || ''),
              index: startIndex + idx + 1
            })
          }
        })
        return comments
      }

      return {
        title: getVideoTitle(),
        rating: getRating(),
        comments: getComments(0)
      }
    })

    let allComments = [...initialData.comments]
    let currentPage = 1

    // 获取后续页面的评论
    while (currentPage < maxPages) {
      try {
        // 检查是否有下一页按钮
        const nextButton = await page.$('.b-pagination__right.b-pagination--active')
        if (!nextButton) {
          console.log('没有更多页面了')
          break
        }

        // 点击下一页按钮
        await nextButton.click()
        
        // 等待评论加载
        await new Promise(resolve => setTimeout(resolve, 2000))

        // 获取新页面的评论
        const pageComments = await page.evaluate((startIndex) => {
          const comments: any[] = []
          const commentElements = document.querySelectorAll('.user-rating-col__container .user-rating-comment')
          
          commentElements.forEach((element, idx) => {
            const content = element.querySelector('.rating-comment')?.textContent?.trim()
            if (content) {
              comments.push({
                id: Math.random().toString(36).substr(2, 9),
                author: element.querySelector('.rating-user__name')?.textContent?.trim() || '匿名用户',
                content,
                time: element.querySelector('.rating-desc')?.textContent?.trim() || '',
                ratingText: element.querySelector('.rating-stars__title')?.textContent?.trim() || '',
                tags: Array.from(element.querySelectorAll('.rating-tags__tag')).map(tag => tag.textContent?.trim() || ''),
                index: startIndex + idx + 1
              })
            }
          })
          return comments
        }, allComments.length)

        if (pageComments.length > 0) {
          allComments = [...allComments, ...pageComments]
          currentPage++
          console.log(`已获取第 ${currentPage} 页评论，共 ${allComments.length} 条`)
        } else {
          console.log('当前页面未找到新评论，停止获取')
          break
        }

      } catch (error) {
        console.error(`获取第 ${currentPage + 1} 页评论失败:`, error)
        break
      }
    }

    const videoDetail = {
      title: initialData.title,
      rating: {
        ...initialData.rating,
        comments: []
      },
      comments: {
        total: allComments.length,
        comments: allComments
      }
    }

    await browser.close()
    return NextResponse.json(videoDetail)

  } catch (error) {
    console.error('获取视频信息失败:', error)
    if (browser) {
      await browser.close()
    }
    return NextResponse.json({ 
      error: `获取视频信息失败: ${error}`,
      errorDetail: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 