'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function TaskList({ tasks, onCheckIn }) {
  const [expandedTask, setExpandedTask] = useState(null)

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">暂无任务，请先创建任务</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <button
                onClick={() => onCheckIn(task.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                打卡
              </button>
            </div>
            
            {task.imageUrl && (
              <div className="mt-3 relative h-40 bg-gray-50 rounded-lg overflow-hidden">
                <Image 
                  src={task.imageUrl}
                  alt={task.title}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            
            <div className="mt-2 text-sm text-gray-500">
              <span>频率: {task.frequency}</span>
              <span className="mx-2">|</span>
              <span>开始日期: {new Date(task.startDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
} 