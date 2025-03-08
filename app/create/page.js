'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTask() {
  const router = useRouter()
  const [task, setTask] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    expectedCount: 1
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 生成唯一ID
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    
    // 从本地存储获取现有任务
    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    
    // 添加新任务
    localStorage.setItem('tasks', JSON.stringify([...existingTasks, newTask]))
    
    // 返回首页
    router.push('/')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setTask(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">创建新任务</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            任务名称
          </label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="输入任务名称"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            任务描述
          </label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            rows="3"
            placeholder="输入任务描述"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            打卡频率
          </label>
          <select
            name="frequency"
            value={task.frequency}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="daily">每日</option>
            <option value="weekly">每周</option>
            <option value="monthly">每月</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            开始日期
          </label>
          <input
            type="date"
            name="startDate"
            value={task.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            预期完成次数
          </label>
          <input
            type="number"
            name="expectedCount"
            value={task.expectedCount}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            创建任务
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
} 