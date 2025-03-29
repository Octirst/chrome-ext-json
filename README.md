# chrome-ext-json
一个简单易用的Chrome扩展，用于格式化和美化网页上的JSON文本，提供语法高亮显示功能。
=======
# JSON Beautifier Chrome扩展

一个简单易用的Chrome扩展，用于格式化和美化网页上的JSON文本，提供语法高亮显示功能。

## 功能特点

- 一键格式化选中的JSON文本
- 支持右键菜单快速访问
- 支持键盘快捷键（Alt+Shift+J）
- JSON语法高亮显示
- 浮动窗口展示格式化后的JSON
- 支持复制格式化后的JSON文本

## 安装方法

### 从Chrome网上应用店安装

1. 访问Chrome网上应用店（即将上线）
2. 点击"添加到Chrome"按钮

### 开发者模式安装

1. 下载或克隆此仓库到本地
2. 打开Chrome浏览器，进入扩展程序页面（chrome://extensions/）
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择扩展程序所在的文件夹

## 使用方法

1. 在网页上选择需要格式化的JSON文本
2. 右键点击，选择"Format as JSON"
3. 或使用快捷键 `Alt+Shift+J` 格式化选中的JSON文本

## 技术实现

- 使用Chrome Extension Manifest V3
- 纯JavaScript实现，无需额外依赖
- 使用内容脚本（Content Script）实现页面交互
- 使用后台服务工作者（Service Worker）处理事件

## 贡献

欢迎提交问题和功能请求！如果您想贡献代码，请提交拉取请求。

## 许可证

[MIT](LICENSE)

