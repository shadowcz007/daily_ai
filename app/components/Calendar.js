'use client'

import { useState, useEffect } from 'react'

export default function Calendar({ tasks, checkInData }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendar, setCalendar] = useState([])

  useEffect(() => {
    generateCalendar()
  }, [currentDate, checkInData])

  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // 获取当月第一天
    const firstDay = new Date(year, month, 1)
    // 获取当月最后一天
    const lastDay = new Date(year, month + 1, 0)
    
    // 获取当月第一天是星期几（0-6）
    const firstDayOfWeek = firstDay.getDay()
    
    // 生成日历数组
    const calendarDays = []
    
    // 添加上月剩余天数
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(year, month, -firstDayOfWeek + i + 1)
      calendarDays.push({
        date: prevDate,
        isCurrentMonth: false,
        checkIns: []
      })
    }
    
    // 添加当月天数
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      const dayCheckIns = checkInData.filter(checkIn => {
        const checkInDate = new Date(checkIn.date)
        return checkInDate.getDate() === i &&
               checkInDate.getMonth() === month &&
               checkInDate.getFullYear() === year
      })
      
      calendarDays.push({
        date,
        isCurrentMonth: true,
        checkIns: dayCheckIns
      })
    }
    
    // 添加下月开始天数，补满6行
    const remainingDays = 42 - calendarDays.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i)
      calendarDays.push({
        date: nextDate,
        isCurrentMonth: false,
        checkIns: []
      })
    }
    
    setCalendar(calendarDays)
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">
          {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="text-center text-sm text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {calendar.map((day, index) => (
          <div
            key={index}
            className={`
              p-1 min-h-[60px] border rounded-lg
              ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
              ${day.checkIns.length > 0 ? 'border-blue-200' : 'border-gray-100'}
            `}
          >
            <div className="text-right text-sm text-gray-500">
              {day.date.getDate()}
            </div>
            {day.checkIns.length > 0 && (
              <div className="mt-1">
                <div className="text-xs text-blue-600">
                  {day.checkIns.length}个打卡
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 