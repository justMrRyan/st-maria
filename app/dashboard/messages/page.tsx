// app/dashboard/messages/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import {
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  Reply,
  Calendar,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  User,
  ChevronRight
} from 'lucide-react';

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
        <div className="space-y-8">
          {/* Header */}
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-[#2c1810]">Messages</h1>
            <p className="text-[#8a7a6a] mt-1">
              View and manage contact form messages
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-4"
          >
            <div className="bg-white border border-[#f0ebe6] px-4 py-2">
              <span className="text-sm text-[#8a7a6a]">Total</span>
              <span className="ml-2 font-bold text-[#2c1810]">{messages.length}</span>
            </div>
            <div className="bg-white border border-[#f0ebe6] px-4 py-2">
              <span className="text-sm text-[#8a7a6a]">Unread</span>
              <span className="ml-2 font-bold text-[#c0392b]">{unreadCount}</span>
            </div>
            <div className="bg-white border border-[#f0ebe6] px-4 py-2">
              <span className="text-sm text-[#8a7a6a]">Read</span>
              <span className="ml-2 font-bold text-[#27ae60]">{messages.length - unreadCount}</span>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3 items-center"
          >
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8a89a]" />
              <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-6 pb-2 bg-transparent border-b border-[#f0ebe6] text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors placeholder:text-[#b8a89a]"
              />
            </div>
            <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value as 'all' | 'read' | 'unread')}
                className="pb-2 bg-transparent border-b border-[#f0ebe6] text-[#2c1810] focus:border-[#d4c5b0] focus:outline-none transition-colors"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </motion.div>

          {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-[#d4c5b0] border-t-transparent" />
              </div>
          ) : filteredMessages.length === 0 ? (
              <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-[#f8f4f0] border border-[#f0ebe6] p-12 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 shadow-sm">
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
              </motion.div>
          ) : (
              <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid lg:grid-cols-2 gap-6"
              >
                {/* Messages List */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredMessages.map((message, index) => (
                      <motion.div
                          key={message.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`bg-white border p-4 cursor-pointer transition-all hover:shadow-md ${
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
                                  <span className="px-2 py-0.5 bg-[#2c1810] text-white text-[10px]">New</span>
                              )}
                            </div>
                            <p className="text-sm text-[#8a7a6a] truncate">{message.email}</p>
                            <p className="text-sm text-[#8a7a6a] line-clamp-2 mt-1">{message.message}</p>
                          </div>
                          <span className="text-xs text-[#b8a89a] whitespace-nowrap ml-2">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                        </div>
                      </motion.div>
                  ))}
                </div>

                {/* Message Detail */}
                <div className="bg-white border border-[#f0ebe6] p-6 sticky top-4">
                  {selectedMessage ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-[#2c1810]">{selectedMessage.name}</h3>
                            <p className="text-[#8a7a6a]">{selectedMessage.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleMarkRead(selectedMessage.id, selectedMessage.read)}
                                className="border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] p-2 transition-colors"
                                title={selectedMessage.read ? 'Mark as unread' : 'Mark as read'}
                            >
                              {selectedMessage.read ? (
                                  <XCircle className="h-4 w-4" />
                              ) : (
                                  <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                            <button
                                onClick={() => handleReply(selectedMessage.email)}
                                className="border border-[#f0ebe6] text-[#2c1810] hover:bg-[#f8f4f0] p-2 transition-colors"
                                title="Reply"
                            >
                              <Reply className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(selectedMessage.id)}
                                disabled={deleting === selectedMessage.id}
                                className="bg-[#c0392b] hover:bg-[#e74c3c] text-white p-2 transition-colors disabled:opacity-50"
                                title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[#b8a89a]">
                          <Calendar className="h-4 w-4" />
                          {formatDate(selectedMessage.created_at)}
                        </div>

                        <div className="bg-[#f8f4f0] p-4">
                          <p className="text-[#2c1810] whitespace-pre-wrap">
                            {selectedMessage.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs ${
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
              </motion.div>
          )}
        </div>
      </>
  );
}