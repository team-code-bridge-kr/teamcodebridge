'use client'

import { motion } from 'framer-motion'
import { DocumentTextIcon, PlusIcon, FolderIcon, LinkIcon, FunnelIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import CreateMaterialModal from '@/components/CreateMaterialModal'
import { showAlert } from '@/components/CustomAlert'

interface Material {
    id: string
    name: string
    description: string
    fileType: string
    driveUrl: string
    fileSize: string | null
    createdAt: string
    curriculum: {
        id: string
        name: string
        status: string
    }
    uploadedBy: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    } | null
}

interface Curriculum {
    id: string
    name: string
}

export default function MaterialsPage() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [curriculums, setCurriculums] = useState<Curriculum[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedCurriculum, setSelectedCurriculum] = useState<string>('all')
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)

    const fetchMaterials = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/materials')
            if (!response.ok) throw new Error('Failed to fetch materials')
            const data = await response.json()
            setMaterials(data)
        } catch (error) {
            console.error('Failed to fetch materials:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchCurriculums = async () => {
        try {
            const response = await fetch('/api/curriculums')
            if (!response.ok) throw new Error('Failed to fetch curriculums')
            const data = await response.json()
            setCurriculums(data)
        } catch (error) {
            console.error('Failed to fetch curriculums:', error)
        }
    }

    useEffect(() => {
        fetchMaterials()
        fetchCurriculums()
    }, [])

    // 수정 핸들러
    const handleEdit = (material: Material) => {
        setEditingMaterial(material)
        setIsCreateModalOpen(true)
    }

    // 삭제 핸들러
    const handleDelete = async (material: Material) => {
        showAlert.confirm(
            '교재 삭제',
            `"${material.name}" 교재를 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.`,
            async () => {
                try {
                    const response = await fetch(`/api/materials/${material.id}`, {
                        method: 'DELETE'
                    })

                    if (!response.ok) throw new Error('삭제 실패')

                    showAlert.success('삭제 완료', '교재가 삭제되었습니다.')
                    fetchMaterials()
                } catch (error) {
                    console.error('삭제 오류:', error)
                    showAlert.error('삭제 실패', '다시 시도해주세요.')
                }
            }
        )
    }

    const filteredMaterials = selectedCurriculum === 'all' 
        ? materials 
        : materials.filter(m => m.curriculum.id === selectedCurriculum)

    const getFileIcon = (fileType: string) => {
        const icons: { [key: string]: string } = {
            'PDF': '📄',
            'ZIP': '📦',
            'PPT': '📊',
            'PPTX': '📊',
            'DOCX': '📝',
            'XLSX': '📈',
            'MP4': '🎥',
            'MP3': '🎵',
            'PNG': '🖼️',
            'JPG': '🖼️',
            'HTML': '🌐',
            'TXT': '📃',
        }
        return icons[fileType] || '📎'
    }

    const getFileColor = (fileType: string) => {
        const colors: { [key: string]: string } = {
            'PDF': 'bg-red-100 text-red-700',
            'ZIP': 'bg-purple-100 text-purple-700',
            'PPT': 'bg-orange-100 text-orange-700',
            'PPTX': 'bg-orange-100 text-orange-700',
            'DOCX': 'bg-blue-100 text-blue-700',
            'XLSX': 'bg-green-100 text-green-700',
            'MP4': 'bg-pink-100 text-pink-700',
            'MP3': 'bg-indigo-100 text-indigo-700',
            'PNG': 'bg-cyan-100 text-cyan-700',
            'JPG': 'bg-cyan-100 text-cyan-700',
            'HTML': 'bg-teal-100 text-teal-700',
            'TXT': 'bg-gray-100 text-gray-700',
        }
        return colors[fileType] || 'bg-gray-100 text-gray-700'
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
                                    <DocumentTextIcon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900">교재관리</h1>
                                    <p className="text-sm text-gray-500 font-medium">커리큘럼별 교육 자료를 관리하세요</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                        >
                            <PlusIcon className="w-5 h-5" />
                            새 교재 업로드
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">전체 교재</p>
                                <p className="text-2xl font-black text-gray-900">{materials.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <FolderIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">커리큘럼</p>
                                <p className="text-2xl font-black text-gray-900">{curriculums.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <FunnelIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">현재 필터</p>
                                <p className="text-lg font-black text-gray-900 truncate">
                                    {selectedCurriculum === 'all' ? '전체' : curriculums.find(c => c.id === selectedCurriculum)?.name || '전체'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
                >
                    <div className="flex items-center gap-3 flex-wrap">
                        <FunnelIcon className="w-5 h-5 text-gray-600" />
                        <span className="font-bold text-gray-700">커리큘럼 필터:</span>
                        <button
                            onClick={() => setSelectedCurriculum('all')}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                                selectedCurriculum === 'all'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            전체 ({materials.length})
                        </button>
                        {curriculums.map((curriculum) => (
                            <button
                                key={curriculum.id}
                                onClick={() => setSelectedCurriculum(curriculum.id)}
                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                                    selectedCurriculum === curriculum.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {curriculum.name} ({materials.filter(m => m.curriculum.id === curriculum.id).length})
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Materials Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {isLoading ? (
                        <div className="p-12 flex justify-center bg-white rounded-2xl">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        </div>
                    ) : filteredMaterials.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-2xl">
                            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold mb-2">등록된 교재가 없습니다</p>
                            <p className="text-sm text-gray-400 mb-4">새로운 교재를 업로드해보세요!</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                            >
                                <PlusIcon className="w-5 h-5" />
                                첫 교재 업로드하기
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMaterials.map((material, index) => (
                                <motion.div
                                    key={material.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + index * 0.05 }}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="text-4xl">{getFileIcon(material.fileType)}</div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getFileColor(material.fileType)}`}>
                                            {material.fileType}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {material.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>
                                    
                                    {/* Curriculum Badge */}
                                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                                        <FolderIcon className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-600 truncate">{material.curriculum.name}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        {material.fileSize && <span>{material.fileSize}</span>}
                                        {material.uploadedBy && <span>{material.uploadedBy.name || '알 수 없음'}</span>}
                                    </div>
                                    
                                    <a
                                        href={material.driveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        드라이브에서 열기
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Create Material Modal */}
                <CreateMaterialModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    curriculums={curriculums}
                    onMaterialCreated={fetchMaterials}
                />
            </div>
        </div>
    )
}
