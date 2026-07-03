# AGENTS.md — Gobi Guardian 项目约束

## 🔒 核心不可变约束

**QR码与链接已固化：** 本项目的二维码（QR Code）和分享链接已经最终生成并部署到 GitHub Pages。所有后续代码修改、功能迭代、文件增删——**无论任何操作，绝对不能更改或影响已生成的二维码与链接。**

## 📋 每次对话提醒规则

在处理任何与本项目相关的请求时，必须在回复开头复述以下内容：

> ⚠️ **不可变约束提醒：** 本项目的二维码与链接已生成并固化。当前所有操作将严格保护二维码与链接，不会对其做任何更改。

## 📁 部署目录

- 最终作品位于 最终作品/ 目录
- GitHub Pages 部署基于此目录
- index.html 中的 wx-guide 组件和 copyLink() 函数为分享链接的核心机制，不可修改其 URL 生成逻辑

## 🔐 安全提醒

- GitHub Token 等敏感信息不应出现在聊天记录中
- 如已泄露，建议立即在 GitHub Settings > Developer settings > Personal access tokens 中撤销并重新生成
