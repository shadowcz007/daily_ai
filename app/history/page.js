'use client'

import { useState, useEffect } from 'react'
import TaskList from '../components/TaskList'
import DataVisualization from '../components/DataVisualization'
import Calendar from '../components/Calendar'

export default function History() {
  const [tasks, setTasks] = useState([])
  const [checkInData, setCheckInData] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    // 从本地存储加载数据
    const loadedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const loadedCheckIns = JSON.parse(localStorage.getItem('checkIns') || '[]')
    setTasks(loadedTasks)
    setCheckInData(loadedCheckIns)
  }, [])

  // 按日期筛选打卡记录
  const filteredCheckIns = checkInData.filter(checkIn => {
    const checkInDate = new Date(checkIn.date)
    return checkInDate.toDateString() === selectedDate.toDateString()
  })

  // 获取相关任务
  const relevantTasks = tasks.filter(task => 
    filteredCheckIns.some(checkIn => checkIn.taskId === task.id)
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">历史记录</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">打卡日历</h2>
            <Calendar
              tasks={tasks}
              checkInData={checkInData}
              onSelectDate={setSelectedDate}
            />
          </section>

          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">数据统计</h2>
            <DataVisualization
              tasks={tasks}
              checkInData={checkInData}
            />
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">打卡记录</h2>
              <div className="text-sm text-gray-500">
                {selectedDate.toLocaleDateString()}
              </div>
            </div>
            
            {relevantTasks.length > 0 ? (
              <TaskList tasks={relevantTasks} checkInData={filteredCheckIns} />
            ) : (
              <p className="text-gray-500 text-center py-4">
                该日期暂无打卡记录
              </p>
            )}
          </section>

          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">统计摘要</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>总打卡次数</span>
                <span className="font-semibold">{checkInData.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>完成任务数</span>
                <span className="font-semibold">
                  {tasks.filter(task => 
                    checkInData.some(checkIn => checkIn.taskId === task.id)
                  ).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>连续打卡天数</span>
                <span className="font-semibold">
                  {(() => {
                    let streak = 0
                    const today = new Date()
                    let currentDate = new Date(today)
                    
                    while (true) {
                      const hasCheckIn = checkInData.some(checkIn => 
                        new Date(checkIn.date).toDateString() === currentDate.toDateString()
                      )
                      
                      if (!hasCheckIn) break
                      
                      streak++
                      currentDate.setDate(currentDate.getDate() - 1)
                    }
                    
                    return streak
                  })()}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 