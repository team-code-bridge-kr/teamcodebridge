'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    UserCircleIcon,
    ChevronLeftIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    XCircleIcon,
    CheckIcon,
    PlusIcon,
    UserGroupIcon,
    UsersIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

interface Message {
    id: string
    content: string
    senderId: string
    senderName: string
    senderImage?: string | null
    createdAt: string
    isMyMessage: boolean
    receiverId?: string
    chatRoomId?: string
    read?: boolean
}

interface User {
    id: string
    name: string
    image: string | null
    team: string | null
    position: string | null
    isOnline?: boolean
    unreadCount?: number
}

interface ChatRoom {
    id: string
    name: string
    description: string | null
    createdById: string
    createdBy: {
        id: string
        name: string | null
        image: string | null
    }
    members: Array<{
        userId: string
        user: {
            id: string
            name: string | null
            image: string | null
            team: string | null
            position: string | null
        }
    }>
    messages: Array<{
        id: string
        content: string
        senderId: string
        sender: {
            name: string | null
        }
        createdAt: string
    }>
    updatedAt: string
}

type FilterType = 'all' | 'online' | 'team'
type ViewMode = 'minimized' | 'normal' | 'expanded'
type ChatView = 'users' | 'rooms' | 'create-room'

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [viewMode, setViewMode] = useState<ViewMode>('normal')
    const [chatView, setChatView] = useState<ChatView>('users')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null)
    const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<FilterType>('all')
    const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
    const [totalUnread, setTotalUnread] = useState(0)
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
    const [newRoomName, setNewRoomName] = useState('')
    const [newRoomDescription, setNewRoomDescription] = useState('')
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const socketRef = useRef<Socket | null>(null)
    const { data: session } = useSession()
    const chatContainerRef = useRef<HTMLDivElement>(null)

    // 크기 조절 관련
    const [isResizing, setIsResizing] = useState(false)
    const [chatSize, setChatSize] = useState({ width: 400, height: 600 })

    useEffect(() => {
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

        socketRef.current.on('receive_message', (msg: Message & { receiverId?: string; chatRoomId?: string }) => {
            if (!session?.user?.id) return
            
            console.log('Real-time message received:', msg)
            
            // 그룹 채팅 메시지인 경우
            if (msg.chatRoomId) {
                // 현재 열려있는 채팅방의 메시지인지 확인
                if (selectedChatRoom && msg.chatRoomId === selectedChatRoom.id) {
                    setMessages(prev => {
                        if (prev.some(m => m.id === msg.id)) return prev
                        return [...prev, { ...msg, read: false }]
                    })
                } else {
                    // 다른 채팅방의 메시지 - 채팅방 목록 업데이트
                    fetchChatRooms()
                }
                return
            }
            
            // 1:1 채팅 메시지인 경우
            if (msg.receiverId === session.user.id) {
                // 읽지 않은 메시지 개수 업데이트
                fetchUnreadCounts()
                
                if (selectedUser && msg.senderId === selectedUser.id) {
                    setMessages(prev => {
                        if (prev.some(m => m.id === msg.id)) return prev
                        return [...prev, { ...msg, read: false }]
                    })
                    // 메시지를 읽음 처리
                    markAsRead(selectedUser.id)
                } else {
                    // 다른 채팅방의 메시지 - 알림 표시
                    setUnreadCounts(prev => ({
                        ...prev,
                        [msg.senderId]: (prev[msg.senderId] || 0) + 1
                    }))
                    setTotalUnread(prev => prev + 1)
                }
            }
        })

        socketRef.current.on('message_sent', (msg: Message & { receiverId: string }) => {
            if (selectedUser && msg.receiverId === selectedUser.id) {
                setMessages(prev => {
                    if (prev.some(m => m.id === msg.id)) return prev
                    return [...prev, { ...msg, isMyMessage: true, read: false }]
                })
            }
        })

        fetchUsers()
        fetchUnreadCounts()

        // 주기적으로 읽지 않은 메시지 개수 갱신
        const unreadInterval = setInterval(fetchUnreadCounts, 5000)

        return () => {
            socketRef.current?.disconnect()
            clearInterval(unreadInterval)
        }
    }, [session])

    useEffect(() => {
        if (isOpen && selectedUser) {
            fetchMessages(selectedUser.id)
            markAsRead(selectedUser.id)
        } else if (isOpen && selectedChatRoom) {
            fetchChatRoomMessages(selectedChatRoom.id)
        } else if (!isOpen) {
            setMessages([])
        }
    }, [isOpen, selectedUser, selectedChatRoom, session?.user?.id])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // 크기 조절 핸들러
    useEffect(() => {
        if (!isResizing) return

        const handleMouseMove = (e: MouseEvent) => {
            if (!chatContainerRef.current) return
            
            const rect = chatContainerRef.current.getBoundingClientRect()
            const newWidth = Math.max(400, Math.min(1200, e.clientX - rect.left))
            const newHeight = Math.max(400, Math.min(800, e.clientY - rect.top))
            
            setChatSize({ width: newWidth, height: newHeight })
        }

        const handleMouseUp = () => {
            setIsResizing(false)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isResizing])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/members')
            if (res.ok) {
                const data = await res.json()
                const filteredUsers = data.filter((u: User) => u.id !== session?.user?.id)
                // 읽지 않은 메시지 개수와 함께 설정
                const usersWithUnread = filteredUsers.map((u: User) => ({
                    ...u,
                    unreadCount: unreadCounts[u.id] || 0
                }))
                setUsers(usersWithUnread)
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
        }
    }

    const fetchChatRooms = async () => {
        try {
            const res = await fetch('/api/chat-rooms')
            if (res.ok) {
                const data = await res.json()
                setChatRooms(data)
            }
        } catch (error) {
            console.error('Failed to fetch chat rooms:', error)
        }
    }

    const fetchChatRoomMessages = async (chatRoomId: string) => {
        if (!session?.user?.id) return
        try {
            const res = await fetch(`/api/messages?chatRoomId=${chatRoomId}&senderId=${session.user.id}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (error) {
            console.error('Failed to fetch chat room messages:', error)
        }
    }

    const createChatRoom = async () => {
        if (!newRoomName.trim() || selectedMemberIds.length === 0 || !session?.user?.id) return

        try {
            const res = await fetch('/api/chat-rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newRoomName,
                    description: newRoomDescription || null,
                    memberIds: selectedMemberIds
                })
            })

            if (res.ok) {
                const newRoom = await res.json()
                setChatRooms(prev => [newRoom, ...prev])
                setSelectedChatRoom(newRoom)
                setSelectedUser(null)
                setChatView('rooms')
                setShowCreateRoomModal(false)
                setNewRoomName('')
                setNewRoomDescription('')
                setSelectedMemberIds([])
            }
        } catch (error) {
            console.error('Failed to create chat room:', error)
            alert('채팅방 생성에 실패했습니다.')
        }
    }

    const fetchUnreadCounts = async () => {
        if (!session?.user?.id) return
        try {
            const res = await fetch(`/api/messages/unread?userId=${session.user.id}`)
            if (res.ok) {
                const data = await res.json()
                setUnreadCounts(data.byUser || {})
                setTotalUnread(data.total || 0)
                // 사용자 목록 업데이트
                setUsers(prev => prev.map(u => ({
                    ...u,
                    unreadCount: data.byUser[u.id] || 0
                })))
            }
        } catch (error) {
            console.error('Failed to fetch unread counts:', error)
        }
    }

    const markAsRead = async (senderId: string) => {
        if (!session?.user?.id) return
        try {
            await fetch('/api/messages/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.user.id,
                    senderId: senderId
                })
            })
            // 읽지 않은 메시지 개수 갱신
            fetchUnreadCounts()
        } catch (error) {
            console.error('Failed to mark as read:', error)
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
        if (!message.trim() || (!selectedUser && !selectedChatRoom) || !session?.user?.id) return

        const messageContent = message.trim()
        const tempId = Date.now().toString()
        setMessage('')

        const tempMessage: Message = {
            id: tempId,
            content: messageContent,
            senderId: session.user.id,
            senderName: session.user.name || '나',
            createdAt: new Date().toISOString(),
            isMyMessage: true,
            read: false
        }
        setMessages(prev => [...prev, tempMessage])

        // 그룹 채팅인 경우
        if (selectedChatRoom) {
            socketRef.current?.emit('send_message', {
                content: messageContent,
                chatRoomId: selectedChatRoom.id,
                senderId: session.user.id,
                senderName: session.user.name,
                messageId: tempId
            })

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: messageContent,
                        chatRoomId: selectedChatRoom.id,
                        senderId: session.user.id
                    })
                })

                if (response.ok) {
                    const savedMessage = await response.json()
                    setMessages(prev => prev.map(msg => 
                        msg.id === tempId ? { ...msg, id: savedMessage.id } : msg
                    ))
                    fetchChatRooms() // 채팅방 목록 업데이트
                }
            } catch (error) {
                console.error('Error sending message:', error)
                setMessages(prev => prev.filter(msg => msg.id !== tempId))
            }
            return
        }

        // 1:1 채팅인 경우
        if (selectedUser) {
            socketRef.current?.emit('send_message', {
                content: messageContent,
                receiverId: selectedUser.id,
                senderId: session.user.id,
                senderName: session.user.name,
                messageId: tempId
            })

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: messageContent,
                        receiverId: selectedUser.id,
                        senderId: session.user.id
                    })
                })

                if (response.ok) {
                    const savedMessage = await response.json()
                    setMessages(prev => prev.map(msg => 
                        msg.id === tempId ? { ...msg, id: savedMessage.id } : msg
                    ))
                }
            } catch (error) {
                console.error('Error sending message:', error)
                setMessages(prev => prev.filter(msg => msg.id !== tempId))
            }
        }
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return '방금 전'
        if (minutes < 60) return `${minutes}분 전`
        if (hours < 24) return `${hours}시간 전`
        if (days < 7) return `${days}일 전`
        
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    }

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const isToday = date.toDateString() === now.toDateString()
        
        if (isToday) {
            return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
        }
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) + ' ' + 
               date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    }

    const filteredUsers = users.filter(user => {
        // 검색 필터
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (user.team && user.team.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              (user.position && user.position.toLowerCase().includes(searchQuery.toLowerCase()))
        
        if (!matchesSearch) return false

        // 필터 타입
        if (filter === 'online') {
            return onlineUserIds.includes(user.id)
        }
        if (filter === 'team') {
            return user.team && user.team.trim() !== ''
        }
        return true
    })

    // 부서별 그룹화
    const groupedUsers = filteredUsers.reduce((acc, user) => {
        const team = user.team || '기타'
        if (!acc[team]) acc[team] = []
        acc[team].push(user)
        return acc
    }, {} as Record<string, User[]>)

    const getViewModeStyles = () => {
        switch (viewMode) {
            case 'minimized':
                return { width: '400px', height: '500px' }
            case 'normal':
                return { width: '400px', height: '600px' }
            case 'expanded':
                return { width: `${chatSize.width}px`, height: `${chatSize.height}px` }
            default:
                return { width: '400px', height: '600px' }
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatContainerRef}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={getViewModeStyles()}
                        className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {selectedUser ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setSelectedUser(null)
                                                markAsRead(selectedUser.id)
                                            }}
                                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors shrink-0"
                                        >
                                            <ChevronLeftIcon className="w-5 h-5" />
                                        </button>
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
                                                {selectedUser.image ? (
                                                    <img src={selectedUser.image} alt={selectedUser.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserCircleIcon className="w-6 h-6 text-white" />
                                                )}
                                                {onlineUserIds.includes(selectedUser.id) && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white z-10"></div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-sm truncate">{selectedUser.name}</p>
                                                <p className="text-xs text-white/80 truncate">
                                                    {selectedUser.position && `${selectedUser.position} · `}
                                                    {selectedUser.team || '소속팀 미정'}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : selectedChatRoom ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setSelectedChatRoom(null)
                                                setChatView('rooms')
                                            }}
                                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors shrink-0"
                                        >
                                            <ChevronLeftIcon className="w-5 h-5" />
                                        </button>
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                <UserGroupIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-sm truncate">{selectedChatRoom.name}</p>
                                                <p className="text-xs text-white/80 truncate">
                                                    {selectedChatRoom.members.length}명
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2 flex-1">
                                        <h3 className="font-bold text-lg">채팅</h3>
                                        <div className="flex gap-1 ml-auto">
                                            <button
                                                onClick={() => {
                                                    setChatView('users')
                                                    setSelectedUser(null)
                                                    setSelectedChatRoom(null)
                                                }}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    chatView === 'users' ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                            >
                                                1:1
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setChatView('rooms')
                                                    setSelectedUser(null)
                                                    setSelectedChatRoom(null)
                                                }}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    chatView === 'rooms' ? 'bg-white/20' : 'hover:bg-white/10'
                                                }`}
                                            >
                                                그룹
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {viewMode === 'expanded' && (
                                    <button
                                        onClick={() => setViewMode('normal')}
                                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                        title="일반 크기"
                                    >
                                        <XCircleIcon className="w-5 h-5" />
                                    </button>
                                )}
                                {viewMode !== 'expanded' && (
                                    <button
                                        onClick={() => setViewMode('expanded')}
                                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                        title="크게 보기"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto bg-gray-50">
                            {!selectedUser && !selectedChatRoom ? (
                                // User List or Chat Room List
                                <div className="p-4 space-y-4">
                                    {chatView === 'rooms' ? (
                                        // Chat Room List
                                        <>
                                            <button
                                                onClick={() => setShowCreateRoomModal(true)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors mb-4"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                                새 그룹 채팅방 만들기
                                            </button>
                                            {chatRooms.length === 0 ? (
                                                <div className="text-center text-gray-400 text-sm py-12">
                                                    그룹 채팅방이 없습니다.
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {chatRooms.map(room => {
                                                        const lastMessage = room.messages[0]
                                                        return (
                                                            <div
                                                                key={room.id}
                                                                onClick={() => {
                                                                    setSelectedChatRoom(room)
                                                                    setChatView('rooms')
                                                                }}
                                                                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer hover:shadow-md hover:border-primary-200 transition-all"
                                                            >
                                                                <div className="relative w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                                                    <UserGroupIcon className="w-6 h-6 text-primary-600" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-gray-900 text-sm truncate">{room.name}</p>
                                                                    {lastMessage ? (
                                                                        <p className="text-xs text-gray-500 truncate">
                                                                            {lastMessage.sender.name}: {lastMessage.content}
                                                                        </p>
                                                                    ) : (
                                                                        <p className="text-xs text-gray-400">메시지가 없습니다</p>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-400 shrink-0">
                                                                    {room.members.length}명
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        // User List
                                        <>
                                    {/* Search and Filter */}
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="이름, 부서, 직책으로 검색..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FunnelIcon className="w-4 h-4 text-gray-400" />
                                            <div className="flex gap-2 flex-1">
                                                {(['all', 'online', 'team'] as FilterType[]).map((filterType) => (
                                                    <button
                                                        key={filterType}
                                                        onClick={() => setFilter(filterType)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                            filter === filterType
                                                                ? 'bg-primary-600 text-white'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {filterType === 'all' ? '전체' : filterType === 'online' ? '온라인' : '부서별'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* User List - Grouped by Team */}
                                    {Object.keys(groupedUsers).length === 0 ? (
                                        <div className="text-center text-gray-400 text-sm py-12">
                                            {searchQuery ? '검색 결과가 없습니다.' : '표시할 팀원이 없습니다.'}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {Object.entries(groupedUsers).map(([team, teamUsers]) => (
                                                <div key={team}>
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">{team}</h4>
                                                    <div className="space-y-2">
                                                        {teamUsers.map(user => {
                                                            const isOnline = onlineUserIds.includes(user.id)
                                                            const unreadCount = unreadCounts[user.id] || 0
                                                            return (
                                                                <div
                                                                    key={user.id}
                                                                    onClick={() => setSelectedUser(user)}
                                                                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer hover:shadow-md hover:border-primary-200 transition-all group"
                                                                >
                                                                    <div className="relative w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                                                        {user.image ? (
                                                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <UserCircleIcon className="w-7 h-7 text-gray-400" />
                                                                        )}
                                                                        {isOnline && (
                                                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white z-10"></div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-0.5">
                                                                            <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                                                                            {user.position && (
                                                                                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                                                                                    {user.position}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 truncate">{user.team || '소속팀 미정'}</p>
                                                                    </div>
                                                                    {unreadCount > 0 && (
                                                                        <div className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shrink-0">
                                                                            {unreadCount > 99 ? '99+' : unreadCount}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                        </>
                                    )}
                                </div>
                            ) : (
                                // Chat Room
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center text-gray-400 text-sm py-12">
                                                메시지가 없습니다. 대화를 시작해보세요!
                                            </div>
                                        ) : (
                                            messages.map((msg, index) => {
                                                const prevMsg = index > 0 ? messages[index - 1] : null
                                                const showTime = !prevMsg || 
                                                    new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() > 300000 // 5분
                                                const showDate = !prevMsg || 
                                                    new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString()
                                                
                                                return (
                                                    <div key={msg.id}>
                                                        {showDate && (
                                                            <div className="text-center text-xs text-gray-400 my-4">
                                                                {new Date(msg.createdAt).toLocaleDateString('ko-KR', { 
                                                                    year: 'numeric', 
                                                                    month: 'long', 
                                                                    day: 'numeric',
                                                                    weekday: 'short'
                                                                })}
                                                            </div>
                                                        )}
                                                        <div className={`flex ${msg.isMyMessage ? 'justify-end' : 'justify-start'} mb-1`}>
                                                            <div className={`flex items-end gap-2 max-w-[75%] ${msg.isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                                                {!msg.isMyMessage && (
                                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                                        {selectedUser?.image ? (
                                                                            <img src={selectedUser.image} alt={selectedUser.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <UserCircleIcon className="w-5 h-5 text-gray-400" />
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <div className={`flex flex-col ${msg.isMyMessage ? 'items-end' : 'items-start'}`}>
                                                                    {!msg.isMyMessage && selectedChatRoom && (
                                                                        <p className="text-xs text-gray-500 mb-1 px-1">{msg.senderName}</p>
                                                                    )}
                                                                    <div
                                                                        className={`p-3 rounded-2xl text-sm ${
                                                                            msg.isMyMessage
                                                                                ? 'bg-primary-600 text-white rounded-tr-none'
                                                                                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                                                        }`}
                                                                    >
                                                                        {msg.content}
                                                                    </div>
                                                                    {showTime && (
                                                                        <div className={`text-xs text-gray-400 mt-1 px-1 flex items-center gap-1 ${msg.isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                                                            <span>{formatMessageTime(msg.createdAt)}</span>
                                                                            {msg.isMyMessage && (
                                                                                <span>
                                                                                    {msg.read ? (
                                                                                        <CheckIcon className="w-3 h-3 text-blue-500" />
                                                                                    ) : (
                                                                                        <CheckIcon className="w-3 h-3 text-gray-400" />
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        {(selectedUser || selectedChatRoom) && (
                            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 shrink-0">
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
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* 크기 조절 핸들 */}
                        {viewMode === 'expanded' && (
                            <div
                                onMouseDown={() => setIsResizing(true)}
                                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-gray-200 hover:bg-primary-500 transition-colors"
                                style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-600/30 flex items-center justify-center hover:bg-primary-700 transition-colors"
            >
                {isOpen ? (
                    <XMarkIcon className="w-7 h-7" />
                ) : (
                    <ChatBubbleLeftRightIcon className="w-7 h-7" />
                )}
                {totalUnread > 0 && !isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5"
                    >
                        {totalUnread > 99 ? '99+' : totalUnread}
                    </motion.div>
                )}
            </motion.button>
        </div>
    )
}
