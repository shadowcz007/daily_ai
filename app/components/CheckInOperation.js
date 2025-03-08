'use client'

import { useState } from 'react'

export default function CheckInOperation({ tasks, onCheckIn }) {
  const [selectedTask, setSelectedTask] = useState('')

  const handleQuickCheckIn = () => {
    if (selectedTask) {
      onCheckIn(selectedTask)
      setSelectedTask('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        >
          <option value="">选择任务</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleQuickCheckIn}
          disabled={!selectedTask}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300"
        >
          快速打卡
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {tasks.slice(0, 6).map((task) => (
          <button
            key={task.id}
            onClick={() => onCheckIn(task.id)}
            className="p-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {task.title}
          </button>
        ))}
      </div>
    </div>
  )
} 