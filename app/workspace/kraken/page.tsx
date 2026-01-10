'use client'

import { useCallback, useState, useEffect, useMemo } from 'react'
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    MarkerType,
    NodeProps,
    Handle,
    Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

interface Task {
    id: string
    name: string
    status: string
    priority: string
    depth: number
    parentId: string | null
    dependsOnId: string | null
    ownerId: string | null
    projectId: string
    owner: { id: string; name: string | null } | null
    children?: Task[]
}

interface Project {
    id: string
    title: string
}

// 커스텀 노드 컴포넌트
function KrakenNode({ data }: NodeProps) {
    const isHighlighted = data.isHighlighted
    const isOnPath = data.isOnPath
    const isBlocked = data.isBlocked

    const depthStyles: Record<number, string> = {
        0: 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl shadow-primary-600/30 border-4 border-primary-400',
        1: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl shadow-blue-500/20 border-2 border-blue-300',
        2: 'bg-white text-gray-800 shadow-lg border-2 border-gray-200',
    }

    const statusColors: Record<string, string> = {
        '완료': 'bg-green-500',
        '진행 중': 'bg-blue-500',
        '대기': 'bg-gray-400',
        '지연': 'bg-red-500',
    }

    return (
        <div
            className={`
                px-5 py-3 rounded-2xl transition-all duration-300 min-w-[160px] text-center
                ${depthStyles[data.depth] || depthStyles[2]}
                ${isHighlighted ? 'ring-4 ring-yellow-400 ring-offset-2' : ''}
                ${isOnPath ? 'ring-4 ring-primary-400 ring-offset-2 scale-105' : ''}
                ${isBlocked ? 'animate-pulse ring-4 ring-red-500' : ''}
                ${!isHighlighted && !isOnPath && data.dimmed ? 'opacity-30' : ''}
            `}
        >
            <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-3 !h-3" />

            <div className="flex flex-col items-center gap-1">
                {data.depth === 0 && <span className="text-xl">🐙</span>}
                <span className={`font-bold ${data.depth === 0 ? 'text-base' : 'text-sm'}`}>
                    {data.label}
                </span>
                <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${statusColors[data.status] || statusColors['대기']}`} />
                    <span className="text-xs opacity-80">{data.status}</span>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-3 !h-3" />
        </div>
    )
}

// 프로젝트 그룹 노드
function ProjectGroupNode({ data }: NodeProps) {
    return (
        <div className="px-4 py-2 bg-gray-100/50 border-2 border-dashed border-gray-300 rounded-xl min-w-[200px]">
            <span className="text-sm font-bold text-gray-500">📁 {data.label}</span>
        </div>
    )
}

const nodeTypes = {
    kraken: KrakenNode,
    projectGroup: ProjectGroupNode
}

// 트리 레이아웃 계산 함수
function calculateTreeLayout(tasks: Task[], projectId: string): { positions: Map<string, { x: number, y: number }>, width: number } {
    const positions = new Map<string, { x: number, y: number }>()
    const projectTasks = tasks.filter(t => t.projectId === projectId)

    // 루트 노드 찾기 (depth=0 또는 parentId가 없는 노드)
    const rootTasks = projectTasks.filter(t => t.depth === 0 || !t.parentId)

    if (rootTasks.length === 0) return { positions, width: 0 }

    const NODE_WIDTH = 180
    const NODE_HEIGHT = 120
    const HORIZONTAL_GAP = 30
    const VERTICAL_GAP = 100

    // 자식 노드들을 재귀적으로 찾기
    function getChildren(parentId: string): Task[] {
        return projectTasks.filter(t => t.parentId === parentId)
    }

    // 서브트리 너비 계산
    function getSubtreeWidth(taskId: string): number {
        const children = getChildren(taskId)
        if (children.length === 0) return NODE_WIDTH

        const childrenWidth = children.reduce((sum, child) => {
            return sum + getSubtreeWidth(child.id) + HORIZONTAL_GAP
        }, -HORIZONTAL_GAP)

        return Math.max(NODE_WIDTH, childrenWidth)
    }

    // 재귀적으로 위치 계산
    function layoutNode(taskId: string, x: number, y: number) {
        const task = projectTasks.find(t => t.id === taskId)
        if (!task) return

        const subtreeWidth = getSubtreeWidth(taskId)
        const nodeX = x + subtreeWidth / 2 - NODE_WIDTH / 2

        positions.set(taskId, { x: nodeX, y })

        const children = getChildren(taskId)
        if (children.length > 0) {
            let childX = x
            children.forEach(child => {
                const childWidth = getSubtreeWidth(child.id)
                layoutNode(child.id, childX, y + NODE_HEIGHT + VERTICAL_GAP)
                childX += childWidth + HORIZONTAL_GAP
            })
        }
    }

    // 루트들 배치
    let currentX = 0
    let totalWidth = 0

    rootTasks.forEach((root, index) => {
        const subtreeWidth = getSubtreeWidth(root.id)
        layoutNode(root.id, currentX, 0)
        currentX += subtreeWidth + HORIZONTAL_GAP * 2
        totalWidth = currentX
    })

    return { positions, width: totalWidth }
}

export default function KrakenPage() {
    const { data: session } = useSession()
    const [tasks, setTasks] = useState<Task[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'all' | 'mine'>('all')

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    // 데이터 로드
    useEffect(() => {
        async function fetchData() {
            try {
                const [tasksRes, projectsRes] = await Promise.all([
                    fetch('/api/kraken'),
                    fetch('/api/projects')
                ])

                if (tasksRes.ok) {
                    const data = await tasksRes.json()
                    setTasks(data)
                }

                if (projectsRes.ok) {
                    const data = await projectsRes.json()
                    setProjects(data)
                }
            } catch (error) {
                console.error('Failed to fetch data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // 선택된 노드부터 Core까지의 경로 계산
    const pathToCore = useMemo(() => {
        if (!selectedTaskId) return []

        const path: string[] = []
        let current = tasks.find(t => t.id === selectedTaskId)

        while (current) {
            path.push(current.id)
            if (!current.parentId) break
            current = tasks.find(t => t.id === current!.parentId)
        }

        return path
    }, [selectedTaskId, tasks])

    // 병목 감지
    const blockedTaskIds = useMemo(() => {
        return tasks
            .filter(t => {
                if (!t.dependsOnId) return false
                const dependency = tasks.find(d => d.id === t.dependsOnId)
                return dependency && dependency.status !== '완료'
            })
            .map(t => t.id)
    }, [tasks])

    // 노드 및 엣지 생성 - 프로젝트별 분리 및 트리 레이아웃
    useEffect(() => {
        if (tasks.length === 0) return

        const currentUserId = session?.user?.id
        const newNodes: Node[] = []
        const newEdges: Edge[] = []

        // 프로젝트별로 그룹화
        const projectIds = Array.from(new Set(tasks.map(t => t.projectId)))

        let projectOffsetX = 0
        const PROJECT_GAP = 100

        projectIds.forEach((projectId, projectIndex) => {
            const project = projects.find(p => p.id === projectId)
            const { positions, width } = calculateTreeLayout(tasks, projectId)

            // 프로젝트 그룹 배경 (선택적)
            // newNodes.push({
            //     id: `project-${projectId}`,
            //     type: 'projectGroup',
            //     position: { x: projectOffsetX - 20, y: -60 },
            //     data: { label: project?.title || '프로젝트' },
            //     style: { zIndex: -1 }
            // })

            // 각 업무 노드 생성
            positions.forEach((pos, taskId) => {
                const task = tasks.find(t => t.id === taskId)
                if (!task) return

                const isMyTask = task.ownerId === currentUserId
                const isHighlighted = viewMode === 'mine' && isMyTask
                const isOnPath = pathToCore.includes(task.id)
                const isBlocked = blockedTaskIds.includes(task.id)
                const dimmed = viewMode === 'mine' && !isMyTask && !isOnPath

                newNodes.push({
                    id: task.id,
                    type: 'kraken',
                    position: { x: pos.x + projectOffsetX, y: pos.y },
                    data: {
                        label: task.name,
                        status: task.status,
                        depth: task.depth,
                        owner: task.owner?.name,
                        isHighlighted,
                        isOnPath,
                        isBlocked,
                        dimmed,
                    },
                })

                // 계층 구조 엣지 (parent -> child)
                if (task.parentId) {
                    const isPathEdge = isOnPath && pathToCore.includes(task.parentId)
                    newEdges.push({
                        id: `hierarchy-${task.parentId}-${task.id}`,
                        source: task.parentId,
                        target: task.id,
                        type: 'smoothstep',
                        animated: isPathEdge,
                        style: {
                            stroke: isPathEdge ? '#f97316' : '#94a3b8',
                            strokeWidth: isPathEdge ? 3 : 2,
                        },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: isPathEdge ? '#f97316' : '#94a3b8',
                        },
                    })
                }

                // 의존성 엣지 (dependsOn -> task) - 다른 프로젝트 간에도 연결 가능
                if (task.dependsOnId) {
                    const dependency = tasks.find(t => t.id === task.dependsOnId)
                    const isBlockedEdge = dependency && dependency.status !== '완료'
                    newEdges.push({
                        id: `dependency-${task.dependsOnId}-${task.id}`,
                        source: task.dependsOnId,
                        target: task.id,
                        type: 'smoothstep',
                        animated: isBlockedEdge,
                        style: {
                            stroke: isBlockedEdge ? '#ef4444' : '#22c55e',
                            strokeWidth: 2,
                            strokeDasharray: '5,5',
                        },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: isBlockedEdge ? '#ef4444' : '#22c55e',
                        },
                    })
                }
            })

            projectOffsetX += width + PROJECT_GAP
        })

        setNodes(newNodes)
        setEdges(newEdges)
    }, [tasks, projects, session, viewMode, pathToCore, blockedTaskIds, setNodes, setEdges])

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedTaskId(prev => prev === node.id ? null : node.id)
    }, [])

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-black flex items-center gap-3">
                            🐙 크라켄 뷰
                        </h1>
                        <p className="text-gray-500 mt-1">
                            업무 흐름을 시각적으로 파악하세요. 노드를 클릭하면 Core까지의 경로가 표시됩니다.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="/workspace/work"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                        >
                            ← 업무 보드
                        </a>
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('all')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${viewMode === 'all'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                전체 보기
                            </button>
                            <button
                                onClick={() => setViewMode('mine')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${viewMode === 'mine'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                내 업무만
                            </button>
                        </div>
                    </div>
                </div>

                {/* 경로 표시 */}
                {selectedTaskId && pathToCore.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl"
                    >
                        <span className="text-sm font-bold text-orange-800">📍 경로: </span>
                        <span className="text-sm text-orange-700">
                            {[...pathToCore]
                                .reverse()
                                .map(id => tasks.find(t => t.id === id)?.name)
                                .join(' → ')}
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Graph */}
            <div className="flex-1 bg-gray-50">
                {tasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <span className="text-6xl mb-4">🐙</span>
                        <p className="font-bold text-lg">아직 업무가 없습니다</p>
                        <p className="text-sm">/workspace/work에서 업무를 추가해보세요</p>
                    </div>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.3 }}
                    >
                        <Controls />
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
                    </ReactFlow>
                )}
            </div>

            {/* Legend */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center justify-center gap-8 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>완료</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>진행 중</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <span>대기</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>지연/병목</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-orange-500" />
                        <span>선택된 경로</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 border-t-2 border-dashed border-red-500" />
                        <span>의존성 (막힘)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
