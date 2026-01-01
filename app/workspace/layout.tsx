'use client'

import { Providers } from '@/components/Providers'
import WorkspaceLayoutClient from '@/components/WorkspaceLayoutClient'

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Providers>
            <WorkspaceLayoutClient>
                {children}
            </WorkspaceLayoutClient>
        </Providers>
    )
}
