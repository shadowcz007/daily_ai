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

// 新增用户意图判断方法
export async function detectUserIntent(userInput) {
  try {
    // 构建请求体
    const requestBody = {
      model: "THUDM/glm-4-9b-chat",
      messages: [
        {
          role: "system",
          content: "根据用户的输入，判断用户的意图（image,chat,weather），只返回JSON格式的结果，其他不相关的不需要返回: { result:\"image或者chat\" }"
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.3,
      max_tokens: 50
    };
    
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('意图检测 API 响应状态:', response.status);
    
    const data = await response.json();
    console.log('意图检测 API 响应数据:', data);
    
    // 提取 JSON 结果
    const content = data.choices[0].message.content;
    console.log('原始意图检测结果:', content);
    
    // 尝试解析 JSON
    try {
      // 查找 JSON 部分并解析
      const jsonMatch = content.match(/\{.*\}/s);
      if (jsonMatch) {
        const jsonResult = JSON.parse(jsonMatch[0]);
        console.log('解析后的意图结果:', jsonResult);
        return jsonResult;
      }
      return { result: "unknown" };
    } catch (parseError) {
      console.error('JSON 解析错误:', parseError);
      return { result: "unknown" };
    }
  } catch (error) {
    console.error('意图检测失败:', {
      error: error.message,
      stack: error.stack
    });
    return { result: "unknown" };
  }
}

// 添加图像生成方法
export async function generateImage(prompt) {
  try {
    // 构建请求体
    const requestBody = {
      model: "Kwai-Kolors/Kolors",
      prompt: prompt
    };
    
    console.log('图像生成请求:', prompt);
    
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('图像生成 API 响应状态:', response.status);
    
    const data = await response.json();
    console.log('图像生成 API 响应数据:', data);
    
    if (data.images && data.images.length > 0) {
      return data.images[0].url;
    }
    
    return null;
  } catch (error) {
    console.error('图像生成失败:', {
      error: error.message,
      stack: error.stack
    });
    return null;
  }
} 