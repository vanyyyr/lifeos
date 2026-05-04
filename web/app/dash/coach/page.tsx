'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Sparkles, Loader2, Wifi, WifiOff } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  source?: string
}

const SUGGESTIONS = [
  '💪 Как улучшить сон?',
  '🥗 Составь план питания',
  '🧘 Как бороться со стрессом?',
  '📚 Что почитать для развития?',
  '⚡ Как повысить продуктивность?',
  '🏋️ Программа тренировок',
]

export default function CoachPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Привет! Я твой AI-коуч.\n\nЗадай мне вопрос о здоровье, продуктивности или саморазвитии — и я дам персональные рекомендации.',
      timestamp: new Date(),
      source: 'system'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [apiStatus, setApiStatus] = useState<'unknown' | 'online' | 'fallback'>('unknown')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check API status on mount
  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const res = await fetch('/api/ai')
      const data = await res.json()
      setApiStatus(data.hasApiKey ? 'online' : 'fallback')
    } catch {
      setApiStatus('fallback')
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsTyping(true)

    try {
      // Build history from messages (exclude system)
      const history = messages
        .filter(m => m.source !== 'system')
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          history
        })
      })

      const data = await res.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Извини, произошла ошибка. Попробуй ещё раз.',
        timestamp: new Date(),
        source: data.source
      }

      setMessages(prev => [...prev, aiMessage])
      
      if (data.source === 'moonshot') {
        setApiStatus('online')
      } else {
        setApiStatus('fallback')
      }
    } catch (error) {
      // Offline fallback
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Нет подключения к серверу. Проверь интернет и попробуй ещё раз.',
        timestamp: new Date(),
        source: 'error'
      }
      setMessages(prev => [...prev, aiMessage])
      setApiStatus('fallback')
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  const handleSuggestion = (text: string) => {
    setInput(text)
  }

  // Send on next render when input is set from suggestion
  useEffect(() => {
    if (input && messages.length <= 2) {
      // Auto-send only for suggestions (first interaction)
    }
  }, [input, messages.length])

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              id="back-btn"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#5641FF] to-[#764ba2] rounded-xl flex items-center justify-center text-lg shadow-lg shadow-purple-500/20">
                🤖
              </div>
              <div>
                <div className="font-bold text-sm">AI Коуч</div>
                <div className={`text-xs flex items-center gap-1 ${
                  apiStatus === 'online' ? 'text-green-400' : 
                  apiStatus === 'fallback' ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {apiStatus === 'online' ? (
                    <><Wifi size={10} /> Moonshot AI</>
                  ) : apiStatus === 'fallback' ? (
                    <><WifiOff size={10} /> Офлайн режим</>
                  ) : (
                    <><span className="w-1.5 h-1.5 bg-gray-500 rounded-full" /> Подключение...</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-[#5641FF] text-white rounded-br-md' 
                  : 'bg-gray-800/60 border border-gray-700/40 text-gray-200 rounded-bl-md'
              }`}>
                <div className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</div>
                <div className={`flex items-center gap-2 mt-1.5 ${msg.role === 'user' ? 'text-white/40 justify-end' : 'text-gray-500'}`}>
                  <span className="text-[10px]">
                    {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.source === 'moonshot' && (
                    <span className="text-[9px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-full">AI</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-800/60 border border-gray-700/40 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-sm">Думаю...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && !isTyping && (
          <div className="mt-6">
            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Sparkles size={12} /> Попробуй спросить:
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-xs bg-gray-800/60 border border-gray-700/40 text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-700/60 hover:border-gray-600/40 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-gray-950/80 backdrop-blur-xl border-t border-gray-800/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напиши сообщение..."
            className="flex-1 bg-gray-800/60 border border-gray-700/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#5641FF]/50 focus:ring-1 focus:ring-[#5641FF]/30 transition-all"
            id="chat-input"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-[#5641FF] p-3 rounded-xl hover:bg-[#3528cc] transition-all disabled:opacity-30 disabled:hover:bg-[#5641FF] active:scale-95"
            id="send-btn"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </main>
  )
}
