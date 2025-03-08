// 新建文件用于处理 AI 相关逻辑
export async function generateAIComment(tasks, checkInData) {

 
  try {
    const taskStats = tasks.map(task => {
      const taskCheckIns = checkInData.filter(c => c.taskId === task.id);
      return {
        title: task.title,
        checkInCount: taskCheckIns.length,
        completionRate: task.frequency ? 
          (taskCheckIns.length / (task.expectedCount || 1)) * 100 : 0
      };
    });

    // 构建请求体
    const requestBody = {
      model: "THUDM/glm-4-9b-chat",
      messages: [
        {
          role: "system",
          content: "你是一个任务管理助手。你需要根据用户提供的任务完成情况，给出有针对性的简短鼓励性点评（100字以内）。对于完成率高的任务要表扬，完成率低的任务要给出温和的建议。"
        },
        {
          role: "user",
          content: "这是我的任务完成情况，请帮我分析。"
        },
        {
          role: "assistant",
          content: "好的，请提供您的任务完成情况，我会仔细分析并给出建议。"
        },
        {
          role: "user",
          content: `以下是具体的任务统计数据：\n${JSON.stringify(taskStats, null, 2)}\n请根据这些数据给出针对性的建议。`
        }
      ],
      temperature: 0.7,
      max_tokens: 310
    };

    // 添加 API 密钥调试信息
    console.log('API Key:', process.env.NEXT_PUBLIC_AI_API_KEY);
    
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // 添加响应状态调试信息
    console.log('API Response status:', response.status);
    
    const data = await response.json();
    // 添加响应数据调试信息
    console.log('API Response data:', data);
    
    return data.choices[0].message.content;
  } catch (error) {
    // 增强错误日志
    console.error('AI 点评生成失败 - 详细错误:', {
      error: error.message,
      stack: error.stack
    });
    return '暂时无法生成 AI 点评';
  }
} 