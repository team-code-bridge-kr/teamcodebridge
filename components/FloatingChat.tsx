'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

interface Message {
    id: string
    content: string
    senderId: string
    senderName: string
    createdAt: string
    isMyMessage: boolean
}

interface User {
    id: string
    name: string
    image: string | null
    team: string | null
    isOnline?: boolean
}

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const socketRef = useRef<Socket | null>(null)
    const { data: session } = useSession()

    useEffect(() => {
        // 소켓 연결 (HTTPS를 통해 Nginx 프록시 사용)
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://e2g.teamcodebridge.dev')
        socketRef.current = io(socketUrl, {
            path: '/socket.io/',
            transports: ['websocket', 'polling']
        })

        socketRef.current.on('connect', () => {
            console.log('Socket connected')
            if (session?.user?.id) {
                socketRef.current?.emit('join', session.user.id)
            }
        })

        socketRef.current.on('online_users', (userIds: string[]) => {
            setOnlineUserIds(userIds)
        })

        socketRef.current.on('receive_message', (msg: Message) => {
            // 현재 보고 있는 채팅방의 메시지라면 추가
            if (selectedUser && msg.senderId === selectedUser.id) {
                setMessages(prev => [...prev, msg])
            }
            // TODO: 다른 사람에게 온 메시지라면 알림 표시
        })

        // 사용자 목록 가져오기
        fetchUsers()

        return () => {
            socketRef.current?.disconnect()
        }
    }, [session])

    useEffect(() => {
        if (isOpen && selectedUser) {
            fetchMessages(selectedUser.id)
        }
    }, [isOpen, selectedUser])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/members')
            if (res.ok) {
                const data = await res.json()
                // 나를 제외한 사용자 목록
                setUsers(data.filter((u: User) => u.id !== session?.user?.id))
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
        }
    }

    const fetchMessages = async (receiverId: string) => {
        if (!session?.user?.id) return
        try {
            const res = await fetch(`/api/messages?receiverId=${receiverId}&senderId=${session.user.id}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error)
        }
    }

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || !selectedUser || !session?.user?.id) return

        const tempMessage: Message = {
            id: Date.now().toString(),
            content: message,
            senderId: session.user.id,
            senderName: session.user.name || '나',
            createdAt: new Date().toISOString(),
            isMyMessage: true
        }

        // UI 업데이트
        setMessages(prev => [...prev, tempMessage])
        setMessage('')

        // 소켓 전송
        socketRef.current?.emit('send_message', {
            content: tempMessage.content,
            receiverId: selectedUser.id,
            senderId: session.user.id,
            senderName: session.user.name
        })

        // DB 저장 (API 호출)
        try {
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: tempMessage.content,
                    receiverId: selectedUser.id,
                    senderId: session.user.id
                })
            })
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-primary-600 p-4 flex items-center justify-between text-white shrink-0">
                            <h3 className="font-bold text-lg">
                                {selectedUser ? selectedUser.name : '팀원 채팅'}
                            </h3>
                            {selectedUser && (
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                                >
                                    목록으로
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                            {!selectedUser ? (
                                // User List
                                <div className="space-y-2">
                                    {/* Search Input */}
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            placeholder="이름으로 검색..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    {(() => {
                                        const filteredUsers = users.filter(user =>
                                            user.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )

                                        return filteredUsers.length === 0 ? (
                                            <div className="text-center text-gray-400 text-sm py-8">
                                                {searchQuery ? '검색 결과가 없습니다.' : '표시할 팀원이 없습니다.'}
                                            </div>
                                        ) : (
                                            filteredUsers.map(user => {
                                                const isOnline = onlineUserIds.includes(user.id)
                                                return (
                                                    <div
                                                        key={user.id}
                                                        onClick={() => setSelectedUser(user)}
                                                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer hover:shadow-md hover:border-primary-100 transition-all"
                                                    >
                                                        <div className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                            {user.image ? (
                                                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <UserCircleIcon className="w-6 h-6 text-gray-400" />
                                                            )}
                                                            {isOnline && (
                                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                                            <p className="text-xs text-gray-500">{user.team || '소속팀 미정'}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    })()}
                                </div>
                            ) : (
                                // Chat Room
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.isMyMessage ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isMyMessage
                                                    ? 'bg-primary-600 text-white rounded-tr-none'
                                                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        {selectedUser && (
                            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 shrink-0">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="메시지를 입력하세요..."
                                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!message.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-600/30 flex items-center justify-center hover:bg-primary-700 transition-colors"
            >
                {isOpen ? (
                    <XMarkIcon className="w-7 h-7" />
                ) : (
                    <ChatBubbleLeftRightIcon className="w-7 h-7" />
                )}
            </motion.button>
        </div>
    )
}
