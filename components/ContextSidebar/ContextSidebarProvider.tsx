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
                // Mission is preserved from capsule if exists, or handled by backend? 
                // Actually Backend POST updates fields. We should probably only send risks.
                // But upsert needs all fields? No, prisma update can take partials.
                // My API implementation takes body and updates everything.
                // I should refine API or just send current mission back.
                mission: capsule?.mission // Keep existing mission
            })
        })
        
        // Optimistic update or refetch?
        // Close sidebar handled by component? No, passed via props.
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
                mission: capsule?.mission // Keep existing mission
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
