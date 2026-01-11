'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import ContextSidebar from '@/components/ContextSidebar'
import { useRouter } from 'next/navigation'

type SidebarMode = 'IDLE' | 'IGNITION' | 'CLEAR'

interface ContextCapsule {
    id: string
    taskId: string
    mission: string | null
    risks: string | null
    lastStableState: string | null
    openLoops: string | null
    nextAction: string | null
}

interface ContextSidebarContextType {
    openIgnition: (taskId: string, taskTitle: string, capsule?: ContextCapsule) => void
    openClear: (taskId: string, taskTitle: string, capsule?: ContextCapsule) => void
    closeSidebar: () => void
}

const ContextSidebarContext = createContext<ContextSidebarContextType | undefined>(undefined)

export function ContextSidebarProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<SidebarMode>('IDLE')
    const [taskId, setTaskId] = useState<string | null>(null)
    const [taskTitle, setTaskTitle] = useState('')
    const [capsule, setCapsule] = useState<ContextCapsule | null>(null)

    const fetchCapsule = async (tid: string) => {
        try {
            const res = await fetch(`/api/context?taskId=${tid}`)
            if (res.ok) {
                const data = await res.json()
                setCapsule(data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const openIgnition = async (tid: string, title: string, initialCapsule?: ContextCapsule) => {
        setTaskId(tid)
        setTaskTitle(title)
        setMode('IGNITION')
        setIsOpen(true)
        if (initialCapsule) {
            setCapsule(initialCapsule)
        } else {
            await fetchCapsule(tid)
        }
    }

    const openClear = async (tid: string, title: string, initialCapsule?: ContextCapsule) => {
        setTaskId(tid)
        setTaskTitle(title)
        setMode('CLEAR')
        setIsOpen(true)
        if (initialCapsule) {
            setCapsule(initialCapsule)
        } else {
            await fetchCapsule(tid)
        }
    }

    const closeSidebar = () => {
        setIsOpen(false)
        setMode('IDLE')
    }

    const handleIgnite = async (data: { risks: string }) => {
        if (!taskId) return
        
        await fetch('/api/context', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId,
                risks: data.risks,
                mission: capsule?.mission,
                status: 'IN_PROGRESS' // Prisma enum value
            })
        })
        
        closeSidebar()
        router.refresh()
    }

    const handleClear = async (data: { lastStableState: string, openLoops: string, nextAction: string }) => {
        if (!taskId) return
        
        await fetch('/api/context', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId,
                ...data,
                mission: capsule?.mission,
                status: 'PENDING' // Prisma enum value
            })
        })
        closeSidebar()
        router.refresh()
    }

    const handleComplete = async (data: { lastStableState: string, openLoops: string, nextAction: string }) => {
        if (!taskId) return
        
        await fetch('/api/context', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId,
                ...data,
                mission: capsule?.mission,
                status: 'COMPLETED'
            })
        })
        closeSidebar()
        router.refresh()
    }

    return (
        <ContextSidebarContext.Provider value={{ openIgnition, openClear, closeSidebar }}>
            {children}
            <ContextSidebar
                isOpen={isOpen}
                onClose={closeSidebar}
                mode={mode}
                taskId={taskId}
                taskTitle={taskTitle}
                initialCapsule={capsule}
                onIgnite={handleIgnite}
                onClear={handleClear}
                onComplete={handleComplete}
            />
        </ContextSidebarContext.Provider>
    )
}

export function useContextSidebar() {
    const context = useContext(ContextSidebarContext)
    if (context === undefined) {
        throw new Error('useContextSidebar must be used within a ContextSidebarProvider')
    }
    return context
}
