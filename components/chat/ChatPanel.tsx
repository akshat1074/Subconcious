'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Bot, User, Loader2, Sparkles, Zap } from 'lucide-react'
import { useAppDispatch } from '@/hooks'
import { setChatOpen } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'

interface Message { id: string; role: 'user' | 'assistant'; content: string; loading?: boolean }

const WELCOME = "Hi! I have access to everything in your vault. I use embeddings to search your content semantically. Ask me anything."

export default function ChatPanel() {
  const dispatch = useAppDispatch()
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', role: 'assistant', content: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { inputRef.current?.focus() }, [])

  const send = async () => {
    const q = input.trim(); if (!q || loading) return
    setInput('')
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: q }
    const botId = `a-${Date.now()}`
    const loadingMsg: Message = { id: botId, role: 'assistant', content: '', loading: true }
    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setLoading(true)

    const history = messages
      .filter((m) => !m.loading && m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/content/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history }),
      })
      const d = await res.json()
      const answer = d.data?.answer || d.message || 'Something went wrong'
      setMessages((prev) => prev.map((m) => m.id === botId ? { ...m, content: answer, loading: false } : m))
    } catch {
      setMessages((prev) => prev.map((m) => m.id === botId ? { ...m, content: 'Failed to get response. Check your API keys.', loading: false } : m))
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[400px] flex flex-col bg-card border-l border-border shadow-2xl animate-slide-in-right">
      <div className="h-14 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Ask AI</p>
            <div className="flex items-center gap-1.5">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              <p className="text-[10px] text-muted-foreground">Groq · Llama 3.3 · Gemini Embeddings</p>
            </div>
          </div>
        </div>
        <button onClick={() => dispatch(setChatOpen(false))} className="btn-ghost p-1.5 h-auto">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', msg.role === 'assistant' ? 'bg-primary/10' : 'bg-accent')}>
              {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5 text-primary" /> : <User className="w-3.5 h-3.5 text-muted-foreground" />}
            </div>
            <div className={cn('rounded-xl px-3.5 py-2.5 max-w-[85%] text-sm leading-relaxed', msg.role === 'assistant' ? 'bg-secondary text-foreground' : 'bg-primary text-primary-foreground')}>
              {msg.loading
                ? <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" /><span className="text-xs">Searching vault...</span></div>
                : <p className="whitespace-pre-wrap">{msg.content}</p>
              }
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask anything about your vault..."
            className="input-field flex-1 text-sm"
            disabled={loading}
          />
          <button onClick={send} disabled={!input.trim() || loading} className="btn-primary p-2 h-auto flex-shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
          Powered by Groq (Llama 3.3-70b) + Gemini text-embedding-004
        </p>
      </div>
    </div>
  )
}
