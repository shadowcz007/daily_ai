'use client'

import { useEffect, useState } from 'react'
import { generateAIComment } from '../utils/ai'

export default function DataVisualization({ tasks, checkInData }) {
  const [stats, setStats] = useState({
    totalCheckIns: 0,
    taskStats: [],
    weeklyProgress: Array(7).fill(0),
  })
  const [aiComment, setAiComment] = useState('')

  useEffect(() => {
    // 计算总打卡次数
    const totalCheckIns = checkInData.length

    // 计算每个任务的打卡统计
    const taskStats = tasks.map(task => {
      const taskCheckIns = checkInData.filter(c => c.taskId === task.id)
      return {
        taskId: task.id,
        title: task.title,
        checkInCount: taskCheckIns.length,
        completionRate: task.frequency ? 
          (taskCheckIns.length / (task.expectedCount || 1)) * 100 : 0
      }
    })

    // 计算最近一周的打卡情况
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - 6))
    const weeklyProgress = Array(7).fill(0)
    
    checkInData.forEach(checkIn => {
      const checkInDate = new Date(checkIn.date)
      if (checkInDate >= weekStart) {
        const dayIndex = Math.floor((checkInDate - weekStart) / (1000 * 60 * 60 * 24))
        if (dayIndex >= 0 && dayIndex < 7) {
          weeklyProgress[dayIndex]++
        }
      }
    })

    setStats({ totalCheckIns, taskStats, weeklyProgress })

    // 获取 AI 点评
    generateAIComment(tasks, checkInData).then(comment => {
      setAiComment(comment)
    })
  }, [tasks, checkInData])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">{stats.totalCheckIns}</div>
        <div className="text-sm text-gray-500">总打卡次数</div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">任务完成情况</h3>
        {stats.taskStats.map(task => (
          <div key={task.taskId} className="bg-gray-50 p-2 rounded">
            <div className="flex justify-between text-sm">
              <span>{task.title}</span>
              <span>{task.checkInCount}次</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(100, task.completionRate)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-2">本周打卡趋势</h3>
        <div className="flex justify-between items-end h-32">
          {stats.weeklyProgress.map((count, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-4/5 bg-blue-500 rounded-t"
                style={{
                  height: `${(count / Math.max(...stats.weeklyProgress)) * 100}%`,
                  minHeight: count > 0 ? '4px' : '0'
                }}
              />
              <div className="text-xs text-gray-500 mt-1">
                {['日', '一', '二', '三', '四', '五', '六'][index]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center">
          <span>AI 点评</span>
          <span className="ml-2 text-xs text-blue-500">由 DeepSeek-V3 提供</span>
        </h3>
        <p className="text-sm text-gray-700">{aiComment || '正在生成点评...'}</p>
      </div>
    </div>
  )
} 