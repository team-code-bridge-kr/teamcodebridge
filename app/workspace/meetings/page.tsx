'use client'

import { motion } from 'framer-motion'
import MeetingPollWidget from '@/components/MeetingPollWidget'

export default function MeetingsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-black text-black mb-2">회의 일정 투표</h1>
                <p className="text-gray-600">팀 회의 일정을 제안하고 투표하세요.</p>
            </motion.div>

            <MeetingPollWidget />
        </div>
    )
}

