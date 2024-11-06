import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import type { VideoResult } from '@/types/video'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword')

  if (!keyword) {
    return NextResponse.json({ error: '请提供搜索关键词' }, { status: 400 })
  }

  try {
    console.log('开始搜索:', keyword)

    // 构造搜索URL
    const searchUrl = `https://v.qq.com/x/search/?q=${encodeURIComponent(keyword)}`
    
    // 设置请求头
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Referer': 'https://v.qq.com/'
    }

    const response = await fetch(searchUrl, { headers })
    const html = await response.text()
    
    console.log('获取到搜索页面，开始解析')
    
    const $ = cheerio.load(html)
    const results: VideoResult[] = []

    // 选择视频列表项
    $('.result_item').each((_, element) => {
      try {
        const $item = $(element)
        
        // 提取视频信息
        const href = $item.find('.result_title a').attr('href') || ''
        const title = $item.find('.result_title a').text().trim()
        const imgSrc = $item.find('.figure_pic').attr('src') || 
                      $item.find('.figure_pic').attr('data-src') || ''
        const subTitle = $item.find('.sub_title').text().trim()
        const type = $item.find('.type').text().trim()
        const isVip = $item.find('.mark_v').length > 0

        // 提取演员和导演信息
        const infoText = $item.find('.result_info').text()
        const actors = infoText.match(/主演[:：](.*?)(?=导演|$)/)?.[1]?.split(/[,，、]/).map(s => s.trim()) || []
        const director = infoText.match(/导演[:：](.*?)(?=主演|$)/)?.[1]?.trim() || ''
        
        // 提取描述
        const description = $item.find('.desc').text().trim()

        if (href && title) {
          results.push({
            href,
            imgSrc,
            title,
            subTitle,
            type,
            isVip,
            director,
            actors,
            alias: [],
            englishName: '',
            description,
            rating: {
              score: '',
              totalCount: '',
              distribution: [],
              comments: []
            }
          })
        }
      } catch (error) {
        console.error('解析视频项时出错:', error)
      }
    })

    console.log(`找到 ${results.length} 个搜索结果`)
    
    // 如果没有找到结果，尝试其他选择器
    if (results.length === 0) {
      $('.video_item, .list_item').each((_, element) => {
        try {
          const $item = $(element)
          const href = $item.find('a').first().attr('href') || ''
          const title = $item.find('.title, .name').first().text().trim()
          const imgSrc = $item.find('img').first().attr('src') || ''
          
          if (href && title) {
            results.push({
              href,
              imgSrc,
              title,
              subTitle: '',
              type: '',
              isVip: false,
              director: '',
              actors: [],
              alias: [],
              englishName: '',
              description: '',
              rating: {
                score: '',
                totalCount: '',
                distribution: [],
                comments: []
              }
            })
          }
        } catch (error) {
          console.error('解析备用视频项时出错:', error)
        }
      })
    }

    console.log('搜索完成，返回结果')
    return NextResponse.json(results)

  } catch (error) {
    console.error('搜索失败:', error)
    return NextResponse.json({ error: '搜索失败' }, { status: 500 })
  }
} 