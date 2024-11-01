import OpenAI from 'openai'

if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
  throw new Error('Missing DeepSeek API Key')
}

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
  dangerouslyAllowBrowser: true
}) 