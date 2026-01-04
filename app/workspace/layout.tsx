'use client'

import WorkspaceLayoutClient from '@/components/WorkspaceLayoutClient'
import { ContextSidebarProvider } from '@/components/ContextSidebar/ContextSidebarProvider'

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ContextSidebarProvider>
            <WorkspaceLayoutClient>
                {children}
            </WorkspaceLayoutClient>
        </ContextSidebarProvider>
    )
}
