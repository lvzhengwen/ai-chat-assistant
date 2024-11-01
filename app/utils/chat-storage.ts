type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type ChatHistory = {
  id: string
  title: string
  messages: Message[]
  createdAt: string
}

export const saveChatHistory = (chat: ChatHistory) => {
  const histories = getChatHistories()
  const chatWithValidMessages = {
    ...chat,
    messages: chat.messages.map(msg => ({
      ...msg,
      id: msg.id || `msg-${Date.now()}-${Math.random()}`
    }))
  }
  
  const existingIndex = histories.findIndex(h => h.id === chat.id)
  
  if (existingIndex !== -1) {
    histories[existingIndex] = chatWithValidMessages
  } else {
    histories.unshift(chatWithValidMessages)
  }
  
  const limitedHistories = histories.slice(0, 50)
  localStorage.setItem('chat-histories', JSON.stringify(limitedHistories))
}

export const getChatHistories = (): ChatHistory[] => {
  if (typeof window === 'undefined') return []
  try {
    const histories = localStorage.getItem('chat-histories')
    if (!histories) return []
    
    const parsedHistories = JSON.parse(histories)
    return parsedHistories.map((history: ChatHistory) => ({
      ...history,
      messages: history.messages.map(msg => ({
        ...msg,
        id: msg.id || `msg-${Date.now()}-${Math.random()}`
      }))
    }))
  } catch (error) {
    console.error('Failed to parse chat histories:', error)
    return []
  }
}

export const clearCurrentChat = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('current-chat')
}

export const deleteChatHistory = (chatId: string) => {
  const histories = getChatHistories()
  const filteredHistories = histories.filter(h => h.id !== chatId)
  localStorage.setItem('chat-histories', JSON.stringify(filteredHistories))
  return filteredHistories
} 