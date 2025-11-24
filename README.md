# Objection Builder 🚀

**Official Website:** [**https://objectionbuilder.netlify.app/**](https://objectionbuilder.netlify.app/)

An AI-powered application to help users generate well-structured, respectful, and effective counterarguments for various personal and professional scenarios. Based on user-provided context, target audience, and desired tone, it produces multiple response options with risk analysis and supporting evidence.

---

## ✨ Key Features

- **AI-Powered Generation**: Leverages the Google Gemini API to craft nuanced and intelligent counterarguments.
- **Deep Customization**: Tailor responses by defining the target audience, communication framework (e.g., NVC, SBI), emotional style, and tone intensity.
- **Conversational Context**: Engages in a back-and-forth conversation, maintaining context for follow-up responses.
- **Risk Analysis**: Each generated response includes an interpersonal risk assessment (`Low`, `Medium`, `High`) to help you choose the most appropriate option.
- **Logical Fallacy Detection**: Identifies potential logical fallacies in the original argument you are addressing.
- **Evidence-Based Support**: Automatically provides verifiable citations when the communication style calls for supporting evidence.
- **Bilingual Support**: Fully functional in both English and Chinese (中文).

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Model**: Google Gemini (`gemini-2.5-flash`) via `@google/genai`
- **Backend**: Netlify Functions (Serverless) for secure API key management
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Containerization**: Docker

---

## 🚀 开发与测试指南

本指南提供两种在本地运行应用以进行开发和测试的方法。

### 方法一：使用 Docker (推荐)

使用 Docker 是推荐的方法，因为它封装了整个环境（Node.js、依赖项），并模拟了类似生产的设置。

1.  **先决条件:**
    - 安装并运行 [Docker Desktop](https://www.docker.com/products/docker-desktop/)。

2.  **配置:**
    - 确保在项目根目录中有一个 `.env` 文件，其中包含你的 `API_KEY` 和供前端使用的后端 URL：
      ```bash
      # .env
      API_KEY=your_google_gemini_api_key_here
      VITE_API_URL=http://localhost:3001
      ```

3.  **启动:**
    - 从项目根目录运行以下命令：
      ```bash
      docker-compose up --build
      ```
    - 这将构建并启动前端和后端服务。

4.  **测试与验证:**
    - **前端应用:** 打开浏览器并访问 [http://localhost:3000](http://localhost:3000)。
    - **后端健康检查:** 要验证后端是否正在运行，可以访问其健康检查端点 [http://localhost:3001/health](http://localhost:3001/health)。你应该会看到一个包含 `"status": "OK"` 的 JSON 响应。

5.  **停止:**
    - 在运行 Docker Compose 的终端中按 `Ctrl+C`。

### 方法二：使用本地 Node.js 环境

此方法用于直接在你的机器上运行服务。

1.  **先决条件:**
    - 安装 [Node.js](https://nodejs.org/) (版本 20.x 或更高版本)。
    - `npm` 或兼容的包管理器。

2.  **安装:**
    - 安装项目依赖：
      ```bash
      npm install
      ```

3.  **配置:**
    - 如上述 Docker 方法中所述，在项目根目录中创建一个 `.env` 文件。

4.  **启动:**
    - 使用 `dev:all` 脚本同时启动前端和后端，并开启热重载：
      ```bash
      npm run dev:all
      ```

5.  **测试与验证:**
    - **前端应用:** 打开浏览器并访问 [http://localhost:3000](http://localhost:3000) (或 Vite 启动的任何端口，请检查终端输出)。
    - **后端健康检查:** 访问健康检查端点 [http://localhost:3001/health](http://localhost:3001/health)。

---

## 🌐 部署 (AWS Amplify)

由于该项目已与 Netlify 解耦，因此已准备好部署在 AWS 等平台上。

1.  **前端 (Amplify Hosting):**
    - 将你的 Git 仓库连接到 AWS Amplify。
    - 配置构建设置：
        - **构建命令:** `npm run build`
        - **发布目录:** `dist`
    - 在 Amplify 控制台中添加环境变量：
        - `VITE_API_URL`: 你已部署的后端服务的公共 URL。

2.  **后端 (ECS/Fargate 或其他容器服务):**
    - 使用多阶段 `Dockerfile` 构建生产 Docker 镜像：
      ```bash
      docker build -t your-repo/objection-builder-prod .
      ```
    - 将此镜像推送到容器注册表 (如 Amazon ECR)。
    - 使用 Amazon ECS on Fargate 等服务部署该镜像。
    - 确保在任务定义中配置 `API_KEY` 和 `PORT` 环境变量。
