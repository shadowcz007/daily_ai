'use client'

import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import CheckInOperation from './components/CheckInOperation'
import DataVisualization from './components/DataVisualization'
import Calendar from './components/Calendar'

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [checkInData, setCheckInData] = useState([])

  useEffect(() => {
    // 从本地存储加载任务和打卡数据
    const loadedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const loadedCheckIns = JSON.parse(localStorage.getItem('checkIns') || '[]')
    setTasks(loadedTasks)
    setCheckInData(loadedCheckIns)
  }, [])

  const handleCheckIn = async (taskId) => {
    const newCheckIn = {
      taskId,
      date: new Date().toISOString(),
    }
    const updatedCheckIns = [...checkInData, newCheckIn]
    setCheckInData(updatedCheckIns)
    localStorage.setItem('checkIns', JSON.stringify(updatedCheckIns))
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">每日打卡任务管理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">任务列表</h2>
            <TaskList tasks={tasks} onCheckIn={handleCheckIn} />
          </section>
          
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">打卡操作</h2>
            <CheckInOperation tasks={tasks} onCheckIn={handleCheckIn} />
          </section>
        </div>
        
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">数据统计</h2>
            <DataVisualization tasks={tasks} checkInData={checkInData} />
          </section>
          
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">打卡日历</h2>
            <Calendar tasks={tasks} checkInData={checkInData} />
          </section>
        </div>
      </div>
    </div>
  )
}
