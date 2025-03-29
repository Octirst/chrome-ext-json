// 后台服务工作者脚本
chrome.runtime.onInstalled.addListener(() => {
  console.log('JSON Beautifier extension installed');
  
  // 创建右键菜单项
  chrome.contextMenus.create({
    id: 'format-json',
    title: 'Format as JSON',
    contexts: ['selection']
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'format-json') {
    // 向当前标签页发送消息，触发格式化功能
    chrome.tabs.sendMessage(tab.id, { action: 'formatJSON' });
  }
});

// 监听快捷键命令
chrome.commands.onCommand.addListener((command) => {
  console.log('收到快捷键命令:', command);
  
  if (command === 'format-json') {
    // 获取当前活动标签页
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        // 向当前标签页发送消息，触发格式化功能
        chrome.tabs.sendMessage(tabs[0].id, { action: 'formatJSON' });
      }
    });
  }
});