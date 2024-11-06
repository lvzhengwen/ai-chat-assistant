import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import type { VideoResult } from '@/types/video'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword')

  if (!keyword) {
    return NextResponse.json({ error: '缺少关键词' }, { status: 400 })
  }

  try {
    const url = `https://v.qq.com/x/search/?q=${encodeURIComponent(keyword)}&queryFrom=0`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://v.qq.com/'
      }
    })

    const html = await response.text()
    
    const $ = cheerio.load(html)
    const results: VideoResult[] = []

    $('._infos').each((_, element) => {
      const $el = $(element)
      
      // 获取 href
      const $figure = $el.find('a.figure.result_figure')
      const $titleLink = $el.find('.result_title a')
      
      // 从 dt-params 中提取 cid
      const dtParams = $figure.find('img').attr('dt-params') || ''
      const cidMatch = dtParams.match(/[&?]cid=([^&]+)/)
      const cid = cidMatch ? cidMatch[1] : ''
      
      // 构建完整的视频URL
      const href = cid ? `https://v.qq.com/x/cover/${cid}.html` : ''
      
      const $img = $figure.find('.figure_pic')
      const imgSrc = $img.attr('src') || ''
      const isVip = $figure.find('.mark_v').length > 0
      
      // 处理图片链接
      let fullImgSrc = imgSrc
      if (imgSrc.startsWith('//')) {
        fullImgSrc = `https:${imgSrc}`
      }
      
      // 获取标题信息
      const $title = $el.find('.result_title')
      const title = $title.find('em').text().trim()
      const subTitle = $title.find('.sub').text().replace(/[()]/g, '').trim()
      const type = $title.find('.type').text().trim()
      
      // 获取详细信息
      const $info = $el.find('.result_info')
      
      // 获取别名
      const aliasText = $info
        .find('.info_item:contains("别　名：")')
        .find('.content')
        .text()
        .trim()
      const alias = aliasText ? aliasText.split(/\s+/).filter(Boolean) : []
      
      // 获取英文名
      const englishName = $info
        .find('.info_item:contains("英文名：")')
        .find('.content')
        .text()
        .trim()
      
      // 获取导演
      const director = $info
        .find('.info_item:contains("导　演：")')
        .find('.content')
        .text()
        .trim()
      
      // 获取主演
      const actorsText = $info
        .find('.info_item:contains("主　演：")')
        .find('.content')
        .text()
        .trim()
      const actors = actorsText ? actorsText.split(/\s+/).filter(Boolean) : []
      
      // 获取简介
      const description = $info
        .find('.info_item_desc .desc_text')
        .text()
        .trim()

      if (href || fullImgSrc) {
        results.push({
          href,
          imgSrc: fullImgSrc,
          title: title || '',
          subTitle: subTitle || '',
          type: type || '',
          isVip,
          director: director || '',
          actors: actors || [],
          alias: alias || [],
          englishName: englishName || '',
          description: description || '',
          rating: {
            score: '',
            totalCount: '',
            distribution: [],
            comments: []
          }
        })
      }
    })

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('搜索失败:', error)
    return NextResponse.json({ error: '搜索失败', details: error.message }, { status: 500 })
  }
} 