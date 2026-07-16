// app/dashboard/messages/route.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast, Toaster } from 'sonner';
import {
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  Reply,
  Calendar,
  User,
  MessageSquare,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function DashboardMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID;

      const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', allowedUserId)
          .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (messageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
          .from('messages')
          .update({ read: !currentStatus })
          .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, read: !currentStatus } : msg
      ));

      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, read: !currentStatus });
      }

      toast.success(`Message marked as ${!currentStatus ? 'read' : 'unread'}`);
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    setDeleting(messageId);
    try {
      const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }

      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  // Filter messages
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
        filterRead === 'all' ||
        (filterRead === 'read' && message.read) ||
        (filterRead === 'unread' && !message.read);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
      <>
        <Toaster position="top-right" />
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-[#2c1810]">Messages</h1>
            <p className="text-[#8a7a6a] mt-1">
              View and manage contact form messages
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white rounded-lg border border-[#f0ebe6] px-4 py-2 shadow-sm">
              <span className="text-sm text-[#8a7a6a]">Total</span>
              <span className="ml-2 font-bold text-[#2c1810]">{messages.length}</span>
            </div>
            <div className="bg-white rounded-lg border border-[#f0ebe6] px-4 py-2 shadow-sm">
              <span className="text-sm text-[#8a7a6a]">Unread</span>
              <span className="ml-2 font-bold text-[#c0392b]">{unreadCount}</span>
            </div>
            <div className="bg-white rounded-lg border border-[#f0ebe6] px-4 py-2 shadow-sm">
              <span className="text-sm text-[#8a7a6a]">Read</span>
              <span className="ml-2 font-bold text-[#27ae60]">{messages.length - unreadCount}</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8a89a]" />
              <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#f0ebe6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c1810] text-[#2c1810] placeholder:text-[#b8a89a]"
              />
            </div>
            <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value as 'all' | 'read' | 'unread')}
                className="px-4 py-2 bg-white border border-[#f0ebe6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c1810] text-[#2c1810]"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin">
                  <div className="h-8 w-8 border-4 border-[#2c1810] border-t-transparent rounded-full" />
                </div>
              </div>
          ) : filteredMessages.length === 0 ? (
              <div className="bg-[#f8f4f0] border border-[#f0ebe6] rounded-xl p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-white p-4 shadow-sm">
                    <Sparkles className="h-8 w-8 text-[#8a7a6a]" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[#2c1810]">
                      {searchTerm || filterRead !== 'all' ? 'No matching messages' : 'No messages yet'}
                    </p>
                    <p className="text-sm text-[#8a7a6a] mt-1">
                      {searchTerm || filterRead !== 'all'
                          ? 'Try adjusting your search or filters'
                          : 'When someone contacts you through the website, their messages will appear here.'
                      }
                    </p>
                  </div>
                </div>
              </div>
          ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Messages List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredMessages.map((message) => (
                      <div
                          key={message.id}
                          className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                              selectedMessage?.id === message.id
                                  ? 'border-[#2c1810] shadow-md'
                                  : 'border-[#f0ebe6] hover:border-[#b8a89a]'
                          } ${!message.read ? 'border-l-4 border-l-[#2c1810]' : ''}`}
                          onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#2c1810]">{message.name}</span>
                              {!message.read && (
                                  <span className="px-2 py-0.5 bg-[#2c1810] text-white text-[10px] rounded-full">New</span>
                              )}
                            </div>
                            <p className="text-sm text-[#8a7a6a] truncate">{message.email}</p>
                            <p className="text-sm text-[#8a7a6a] line-clamp-2 mt-1">{message.message}</p>
                          </div>
                          <span className="text-xs text-[#b8a89a] whitespace-nowrap ml-2">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                        </div>
                      </div>
                  ))}
                </div>

                {/* Message Detail */}
                <div className="bg-white rounded-xl border border-[#f0ebe6] p-6 shadow-sm sticky top-4">
                  {selectedMessage ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-[#2c1810]">{selectedMessage.name}</h3>
                            <p className="text-[#8a7a6a]">{selectedMessage.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkRead(selectedMessage.id, selectedMessage.read)}
                                className="border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0]"
                            >
                              {selectedMessage.read ? (
                                  <XCircle className="h-4 w-4" />
                              ) : (
                                  <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReply(selectedMessage.email)}
                                className="border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0]"
                            >
                              <Reply className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(selectedMessage.id)}
                                disabled={deleting === selectedMessage.id}
                                className="bg-[#c0392b] hover:bg-[#e74c3c]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[#b8a89a]">
                          <Calendar className="h-4 w-4" />
                          {formatDate(selectedMessage.created_at)}
                        </div>

                        <div className="bg-[#f8f4f0] rounded-lg p-4">
                          <p className="text-[#2c1810] whitespace-pre-wrap">
                            {selectedMessage.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedMessage.read
                            ? 'bg-green-100 text-green-700'
                            : 'bg-[#2c1810] text-white'
                    }`}>
                      {selectedMessage.read ? 'Read' : 'Unread'}
                    </span>
                        </div>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <MessageSquare className="h-12 w-12 text-[#b8a89a] mb-4" />
                        <p className="text-[#8a7a6a]">Select a message to view</p>
                        <p className="text-sm text-[#b8a89a]">Click on any message from the list</p>
                      </div>
                  )}
                </div>
              </div>
          )}
        </div>
      </>
  );
}