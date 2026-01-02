'use client'

import WorkspaceLayoutClient from '@/components/WorkspaceLayoutClient'

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <WorkspaceLayoutClient>
            {children}
        </WorkspaceLayoutClient>
    )
}
