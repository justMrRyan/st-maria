'use client'

import { useState } from 'react'
import { Message } from '@/types'
import { Button } from '@/components/ui/button'
import { toast, Toaster } from 'sonner'

interface MessagesTableProps {
  messages: Message[]
  onMessagesChange: () => void
}

export default function MessagesTable({
  messages,
  onMessagesChange,
}: MessagesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleMarkRead = async (messageId: string, read: boolean) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: !read }),
      })

      if (!response.ok) throw new Error('Failed to update message')

      toast.success('Message updated')
      onMessagesChange()
    } catch (error) {
      toast.error('Failed to update message')
    }
  }

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    setIsDeleting(messageId)
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete message')

      toast.success('Message deleted')
      onMessagesChange()
    } catch (error) {
      toast.error('Failed to delete message')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    toast.success('Email copied to clipboard')
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No messages yet</p>
      </div>
    )
  }

  return (
    <>
      <Toaster />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold">From</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Message</th>
              <th className="text-left py-3 px-4 font-semibold">Date</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id} className="border-b border-border hover:bg-accent/50">
                <td className="py-3 px-4">{message.name}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleCopyEmail(message.email)}
                    className="text-primary hover:underline text-sm"
                    title="Click to copy email"
                  >
                    {message.email}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="max-w-xs truncate text-sm">
                    {message.message}
                  </div>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === message.id ? null : message.id)
                    }
                    className="text-primary text-xs hover:underline mt-1"
                  >
                    {expandedId === message.id ? 'Hide' : 'View'}
                  </button>
                  {expandedId === message.id && (
                    <div className="mt-2 p-3 bg-muted rounded text-sm whitespace-pre-wrap">
                      {message.message}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-sm">
                  {new Date(message.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      message.read
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {message.read ? 'Read' : 'Unread'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkRead(message.id, message.read)}
                    >
                      {message.read ? 'Mark Unread' : 'Mark Read'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isDeleting === message.id}
                      onClick={() => handleDelete(message.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
