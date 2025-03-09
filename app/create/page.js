'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { detectUserIntent, generateImage } from '../utils/ai'
import Image from 'next/image'

export default function CreateTask() {
  const router = useRouter()
  const [task, setTask] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    expectedCount: 1
  })
  const [userIntent, setUserIntent] = useState(null)
  const [intentDetecting, setIntentDetecting] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [imageGenerating, setImageGenerating] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 生成唯一ID
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userIntent: userIntent?.result || 'unknown',
      imageUrl: generatedImage || ''
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

  // 当描述变化时检测意图
  useEffect(() => {
    const detectIntent = async () => {
      if (task.description && task.description.length > 10) {
        setIntentDetecting(true)
        const intent = await detectUserIntent(task.description)
        setUserIntent(intent)
        setIntentDetecting(false)
        
        // 如果意图是图像，则生成图像
        if (intent?.result === 'image' && !generatedImage && !imageGenerating) {
          handleGenerateImage()
        }
      }
    }

    // 使用防抖，避免频繁调用 API
    const debounceTimer = setTimeout(() => {
      detectIntent()
    }, 1000)

    return () => clearTimeout(debounceTimer)
  }, [task.description])

  // 生成图像的处理函数
  const handleGenerateImage = async () => {
    if (task.description && !imageGenerating) {
      setImageGenerating(true)
      const imageUrl = await generateImage(task.description)
      setGeneratedImage(imageUrl)
      setImageGenerating(false)
    }
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
          {intentDetecting && (
            <div className="mt-1 text-sm text-gray-500">正在分析任务意图...</div>
          )}
          {userIntent && !intentDetecting && (
            <div className="mt-1 text-sm">
              <span className="font-medium">检测到的意图:</span> 
              <span className={`ml-2 px-2 py-0.5 rounded ${
                userIntent.result === 'image' ? 'bg-purple-100 text-purple-800' : 
                userIntent.result === 'chat' ? 'bg-blue-100 text-blue-800' : 
                userIntent.result === 'weather' ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {userIntent.result}
              </span>
            </div>
          )}
        </div>
        
        {/* 图像生成区域 */}
        {userIntent?.result === 'image' && (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">任务图像</h3>
              {!generatedImage && !imageGenerating && (
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-lg hover:bg-purple-200"
                >
                  生成图像
                </button>
              )}
            </div>
            
            {imageGenerating && (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-gray-500">正在生成图像...</div>
              </div>
            )}
            
            {generatedImage && !imageGenerating && (
              <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden">
                <Image 
                  src={generatedImage}
                  alt="生成的任务图像"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            
            {!generatedImage && !imageGenerating && (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-gray-500">点击"生成图像"按钮创建任务相关图像</div>
              </div>
            )}
          </div>
        )}
        
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