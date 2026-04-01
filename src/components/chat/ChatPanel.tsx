'use client'

import { useChat } from '@/hooks/useChat'
import { useUser } from '@/hooks/useUser'
import { useEffect, useRef, useState } from 'react'
import { Send, AlertCircle } from 'lucide-react'

interface ChatPanelProps {
  repairId: string
}

export function ChatPanel({ repairId }: ChatPanelProps) {
  const { user } = useUser()
  const { messages, isLoading, isSending, sendMessage } = useChat(repairId, user?.id || '')
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    try {
      setError(null)
      await sendMessage(input)
      setInput('')
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error('Error sending message:', err)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96 bg-cream-2 rounded-lg">
        <p className="text-ink-40">Please log in to chat</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg border border-cream-3 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-cream-50 border-b border-cream-3">
        <h3 className="font-semibold text-ink text-sm">Repair Chat</h3>
        <p className="text-xs text-ink-60">Communicate with the repairer</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-ink-40 text-sm">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-ink-40 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.sender_id === user.id
                      ? 'bg-green text-white'
                      : 'bg-white text-ink border border-cream-3'
                  }`}
                >
                  <p className={msg.sender_id === user.id ? 'text-white' : 'text-ink-60 text-xs font-medium mb-1'}>
                    {msg.sender?.full_name}
                  </p>
                  <p className="break-words">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-green-100' : 'text-ink-40'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-cream-3 bg-white">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            className="flex-1 px-3 py-2 text-sm border border-cream-3 rounded-lg focus:outline-none focus:border-green resize-none"
            rows={2}
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="px-3 py-2 bg-green text-white rounded-lg hover:bg-green-600 disabled:bg-ink-20 disabled:text-ink-40 transition-colors"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
