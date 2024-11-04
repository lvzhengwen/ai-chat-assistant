'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { openai } from '../utils/api-client'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { ChatHistory, saveChatHistory, getChatHistories, clearCurrentChat, deleteChatHistory } from '../utils/chat-storage'
import { v4 as uuidv4 } from 'uuid'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>(uuidv4())

  // 加载聊天历史
  useEffect(() => {
    const histories = getChatHistories()
    setChatHistories(histories)
  }, [])

  // 保存当前对话
  useEffect(() => {
    if (messages.length > 0) {
      const chatHistory: ChatHistory = {
        id: currentChatId,
        title: messages[0].content.slice(0, 30) + '...',
        messages,
        createdAt: new Date().toISOString()
      }
      saveChatHistory(chatHistory)
      setChatHistories(getChatHistories())
    }
  }, [messages, currentChatId])

  const handleNewChat = () => {
    setMessages([])
    setCurrentChatId(uuidv4())
    clearCurrentChat()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    
    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role: 'user',
      content: inputValue
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const waitingMessage: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        role: 'assistant',
        content: '正在思考中...'
      }
      setMessages(prev => [...prev, waitingMessage])

      const response = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })

      setMessages(prev => {
        const newMessages = prev.slice(0, -1) // 移除等待消息
        return [...newMessages, {
          id: `msg-${Date.now()}-${Math.random()}`,
          role: 'assistant',
          content: response.choices[0].message.content || '抱歉，我现在无法回答这个问题。'
        }]
      })
    } catch (error) {
      console.error('API 调用错误:', error)
      setMessages(prev => {
        const newMessages = prev.slice(0, -1)
        return [...newMessages, {
          id: `msg-${Date.now()}-${Math.random()}`,
          role: 'assistant',
          content: '抱歉，发生了一些错误，请稍后再试。'
        }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedHistories = deleteChatHistory(chatId)
    setChatHistories(updatedHistories)
    if (chatId === currentChatId) {
      handleNewChat()
    }
  }

  const loadChatHistory = (chat: ChatHistory) => {
    const messagesWithIds = chat.messages.map(msg => ({
      ...msg,
      id: msg.id || `msg-${Date.now()}-${Math.random()}`
    }))
    setMessages(messagesWithIds)
    setCurrentChatId(chat.id)
  }

  return (
    <div className="flex h-screen">
      {/* 左侧边栏 */}
      <div className="hidden md:flex w-[260px] bg-gray-900 text-white flex-col">
        {/* 新对话按钮 */}
        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 rounded-md border border-white/20 px-4 py-3 text-white transition-colors duration-200 hover:bg-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新对话
          </button>
        </div>
        
        {/* 历史记录 */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs text-gray-400">历史记录</div>
          <div className="space-y-1 px-2">
            {chatHistories.map((chat) => (
              <div 
                key={chat.id}
                className="p-2 text-sm hover:bg-gray-800 rounded-lg cursor-pointer group"
                onClick={() => loadChatHistory(chat)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate flex-1">{chat.title}</div>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部用户信息 */}
        <div className="border-t border-white/20 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-sm font-medium">用户</span>
            </div>
            <div className="text-sm">我的账户</div>
          </div>
        </div>
      </div>

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* 顶部导航栏 */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 移动端菜单按钮 */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">AI 助手</h1>
          </div>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </div>

        {/* 聊天记录区域 */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p>开始一个新的对话吧</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-4 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      message.content === '正在思考中...' ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse">正在思考中</div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      ) : (
                        <div className="markdown-body">
                          <MarkdownRenderer content={message.content} />
                        </div>
                      )
                    ) : (
                      <div className="text-white text-base">{message.content}</div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                      我
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入您的问题..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  处理中...
                </>
              ) : '发送'}
            </button>
          </form>
          <div className="max-w-3xl mx-auto mt-2 text-xs text-gray-400 text-center">
            AI助手会尽力保证回答的准确性，但不对结果负责。
          </div>
        </div>
      </div>
    </div>
  )
} 