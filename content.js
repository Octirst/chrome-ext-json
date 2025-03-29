// 创建样式
const style = document.createElement('style');

// 保存最后选中的文本和位置信息
let lastSelectedText = '';
let lastSelectionRect = null;
style.textContent = `
  .json-format-btn {
    position: fixed;
    z-index: 2147483647;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    pointer-events: auto;
  }
  .json-floating-window {
    position: fixed;
    z-index: 2147483647; /* 提高z-index到最大值，与按钮相同 */
    background: #f5f5f5;
    border: 1px solid #e8f0fe;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    padding: 10px;
    max-width: 500px;
    max-height: 300px;
    overflow: auto;
    pointer-events: auto;
  }
  .json-floating-window pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: monospace;
  }
  .json-floating-window .close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    background: none;
    border: none;
    font-size: 16px;
  }
  /* JSON语法高亮样式 */
  .json-key {
    color: #0451a5;
    font-weight: bold;
  }
  .json-string {
    color: #a31515;
  }
  .json-number {
    color: #098658;
  }
  .json-boolean {
    color: #0000ff;
  }
  .json-null {
    color: #7a3e9d;
  }
  .json-bracket {
    color: #000000;
  }
  .json-colon {
    color: #000000;
  }
  .json-comma {
    color: #000000;
  }
`;
document.head.appendChild(style);

// 处理右键菜单触发的格式化请求
function formatSelectedText() {
    console.log('formatSelectedText 函数被调用');
    // 移除已有的浮动窗口
    const existingWindow = document.querySelector('.json-floating-window');
    if (existingWindow) {
        existingWindow.remove();
    }

    // 使用保存的选中文本，而不是当前选择状态
    console.log('使用保存的文本:', lastSelectedText);

    if (!lastSelectedText) {
        console.error('没有有效的选择文本');
        showErrorWindow('没有有效的选择文本', '请重新选择文本');
        return;
    }

    const selectedText = lastSelectedText;
    console.log('处理的文本:', selectedText);

    // 尝试解析选中的文本为JSON
    // 先处理可能的转义字符
    const unescapedText = selectedText.replace(/\\(["\\])/g, '$1');
    console.log('处理转义后的文本:', unescapedText);

    try {
        console.log('尝试解析JSON...');
        // 尝试清理文本，移除可能导致解析失败的字符
        let cleanText = unescapedText.trim();
        
        // 检查是否需要去除外层引号（有时候选中的文本包含额外的引号）
        if ((cleanText.startsWith('"') && cleanText.endsWith('"')) ||
            (cleanText.startsWith('\'') && cleanText.endsWith('\''))) {
            cleanText = cleanText.substring(1, cleanText.length - 1);
            console.log('移除外层引号后的文本:', cleanText);
        }
  
        // 尝试处理特殊格式的JSON字符串
        // 确保所有键名都有双引号
        if (cleanText.match(/[{,]\s*[a-zA-Z0-9_]+\s*:/)) {
            console.log('检测到可能缺少双引号的键名，尝试修复');
            cleanText = cleanText.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        }
        
        // 尝试解析JSON
        console.log('最终尝试解析的JSON文本:', cleanText);
        const jsonObj = JSON.parse(cleanText);
        
        // 格式化JSON
        const formattedJson = JSON.stringify(jsonObj, null, 2);
        console.log('格式化成功，结果长度:', formattedJson.length);

        // 创建并显示浮动窗口
        createFloatingWindow(formattedJson);
        
    } catch (e) {
        console.error('JSON解析错误:', e);
        console.log('原始文本:', selectedText);
        showErrorWindow('无效的JSON格式', e.message);
    }
} // 函数结束

// 创建浮动窗口的辅助函数
function createFloatingWindow(content) {
    console.log('创建浮动窗口，内容长度:', content.length);
    
    // 创建浮动窗口
    const floatingWindow = document.createElement('div');
    floatingWindow.className = 'json-floating-window';
    floatingWindow.style.display = 'block'; // 确保窗口可见
    console.log('浮动窗口元素已创建');

    // 添加关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '×';
    closeBtn.onclick = function (e) {
        console.log('关闭按钮被点击');
        e.preventDefault();
        e.stopPropagation();
        floatingWindow.remove();
        console.log('浮动窗口已移除');
    };

    // 添加格式化后的内容（带语法高亮）
    const pre = document.createElement('pre');
    pre.innerHTML = highlightJSON(content);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.marginTop = '10px';
    buttonContainer.style.gap = '10px';

    // 添加复制按钮
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '复制';
    copyBtn.style.padding = '4px 8px';
    copyBtn.style.backgroundColor = '#4CAF50';
    copyBtn.style.color = 'white';
    copyBtn.style.border = 'none';
    copyBtn.style.borderRadius = '4px';
    copyBtn.style.cursor = 'pointer';
    copyBtn.style.fontSize = '12px';
    copyBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('复制按钮被点击');
        // 复制格式化后的JSON
        navigator.clipboard.writeText(content)
            .then(() => {
                console.log('复制成功');
                // 显示复制成功提示
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '复制成功!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                console.error('复制失败:', err);
            });
    };

    // 添加压缩并复制按钮
    const compressCopyBtn = document.createElement('button');
    compressCopyBtn.textContent = '压缩并复制';
    compressCopyBtn.style.padding = '4px 8px';
    compressCopyBtn.style.backgroundColor = '#2196F3';
    compressCopyBtn.style.color = 'white';
    compressCopyBtn.style.border = 'none';
    compressCopyBtn.style.borderRadius = '4px';
    compressCopyBtn.style.cursor = 'pointer';
    compressCopyBtn.style.fontSize = '12px';
    compressCopyBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('压缩并复制按钮被点击');
        // 压缩JSON（移除所有空格和换行符）
        try {
            const jsonObj = JSON.parse(content);
            const compressedJson = JSON.stringify(jsonObj);
            navigator.clipboard.writeText(compressedJson)
                .then(() => {
                    console.log('压缩并复制成功');
                    // 显示复制成功提示
                    const originalText = compressCopyBtn.textContent;
                    compressCopyBtn.textContent = '复制成功!';
                    setTimeout(() => {
                        compressCopyBtn.textContent = originalText;
                    }, 1500);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                });
        } catch (err) {
            console.error('压缩JSON失败:', err);
        }
    };

    // 将按钮添加到按钮容器
    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(compressCopyBtn);

    floatingWindow.appendChild(closeBtn);
    floatingWindow.appendChild(pre);
    floatingWindow.appendChild(buttonContainer);
    
    // 设置浮动窗口的位置
    if (lastSelectionRect) {
        const windowMargin = 10;
        let windowTop = lastSelectionRect.bottom + window.scrollY + windowMargin;
        let windowLeft = lastSelectionRect.left + window.scrollX;
        
        // 确保浮动窗口不会超出视口
        const maxWidth = 500; // 从CSS中获取的最大宽度
        const maxHeight = 300; // 从CSS中获取的最大高度
        
        // 调整水平位置
        if (windowLeft + maxWidth > window.innerWidth + window.scrollX) {
            windowLeft = window.innerWidth + window.scrollX - maxWidth - windowMargin;
        }
        
        // 调整垂直位置
        if (windowTop + maxHeight > window.innerHeight + window.scrollY) {
            windowTop = lastSelectionRect.top + window.scrollY - maxHeight - windowMargin;
        }
        
        floatingWindow.style.top = `${windowTop}px`;
        floatingWindow.style.left = `${windowLeft}px`;
        console.log('浮动窗口位置设置成功:', { top: windowTop, left: windowLeft });
    } else {
        // 如果没有保存的位置，则在屏幕中央显示
        floatingWindow.style.top = `${window.innerHeight / 2 + window.scrollY}px`;
        floatingWindow.style.left = `${window.innerWidth / 2 + window.scrollX}px`;
        console.log('浮动窗口位置设置在屏幕中央');
    }
    
    // 添加到DOM
    console.log('准备添加浮动窗口到DOM');
    document.body.appendChild(floatingWindow);
    console.log('浮动窗口已添加到DOM');
    
    // 强制重绘
    setTimeout(() => {
        floatingWindow.style.opacity = '0.99';
        setTimeout(() => {
            floatingWindow.style.opacity = '1';
        }, 10);
    }, 0);
}

// 显示错误信息窗口的辅助函数
function showErrorWindow(title, message) {
  console.log(`显示错误窗口: ${title} - ${message}`);
  
  // 创建错误提示窗口
  const floatingWindow = document.createElement('div');
  floatingWindow.className = 'json-floating-window';
  floatingWindow.style.backgroundColor = '#ffe6e6';
  
  // 添加关闭按钮
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.onclick = function(e) {
    console.log('错误窗口关闭按钮被点击');
    e.preventDefault();
    e.stopPropagation();
    floatingWindow.remove();
    console.log('错误窗口已移除');
  };
  
  // 添加错误信息
  const pre = document.createElement('pre');
  pre.textContent = `${title}\n${message}`;
  pre.style.color = '#ff0000';
  
  floatingWindow.appendChild(closeBtn);
  floatingWindow.appendChild(pre);
  document.body.appendChild(floatingWindow);
  
  try {
    // 尝试定位浮动窗口在选中文本附近
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      floatingWindow.style.top = `${rect.bottom + window.scrollY}px`;
      floatingWindow.style.left = `${rect.left + window.scrollX}px`;
    } else {
      // 如果无法获取选择位置，则在屏幕中央显示
      floatingWindow.style.top = `${window.innerHeight/2 + window.scrollY}px`;
      floatingWindow.style.left = `${window.innerWidth/2 + window.scrollX}px`;
    }
  } catch (posError) {
    console.error('设置错误窗口位置时出错:', posError);
    // 在屏幕中央显示
    floatingWindow.style.top = `${window.innerHeight/2 + window.scrollY}px`;
    floatingWindow.style.left = `${window.innerWidth/2 + window.scrollX}px`;
  }
}

// 监听文本选择事件，保存选中的文本和位置信息，供右键菜单触发格式化时使用
document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText) {
    console.log('选中文本:', selectedText);
    
    // 保存选中的文本和位置信息，供格式化功能使用
    lastSelectedText = selectedText;
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      lastSelectionRect = range.getBoundingClientRect();
    }
  }
});

// JSON语法高亮函数
function highlightJSON(json) {
  // 使用正则表达式进行语法高亮
  let highlighted = json
    // 转义HTML特殊字符
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 高亮键名
    .replace(/"([^"]+)"\s*:/g, '"<span class="json-key">$1</span>":')
    // 高亮字符串值
    .replace(/:\s*"([^"]*)"/g, ': "<span class="json-string">$1</span>"')
    // 高亮数字
    .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
    // 高亮布尔值
    .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
    // 高亮null
    .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>')
    // 高亮括号
    .replace(/([\[\]\{\}])/g, '<span class="json-bracket">$1</span>')
    // 高亮冒号
    .replace(/("[^"]+")(<span class="json-bracket">:|:<\/span>)/g, '$1<span class="json-colon">:</span>')
    // 高亮逗号
    .replace(/,/g, '<span class="json-comma">,</span>');

  return highlighted;
}

// 监听来自background.js的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message);
  
  if (message.action === 'formatJSON') {
    console.log('触发JSON格式化');
    try {
      formatSelectedText();
    } catch (err) {
      console.error('格式化过程中发生错误:', err);
      showErrorWindow('格式化过程中发生错误', err.message);
    }
  }
  
  // 返回true表示异步响应
  return true;
});