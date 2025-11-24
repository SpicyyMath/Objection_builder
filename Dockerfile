# ============================================
# 阶段 1: 构建前端
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# 复制前端相关文件
COPY package*.json ./
RUN npm install

COPY . .

# 构建前端静态文件
RUN npm run build

# ============================================
# 阶段 2: 构建后端
# ============================================
FROM node:20-alpine AS backend-builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server ./server
COPY types.ts ./types.ts
COPY tsconfig.json ./tsconfig.json

# 编译 TypeScript 后端
RUN npx tsc server/server.ts --outDir dist-server --module commonjs --target ES2020 --esModuleInterop --skipLibCheck

# ============================================
# 阶段 3: 生产环境运行时
# ============================================
FROM node:20-alpine

WORKDIR /app

# 只安装生产依赖
COPY package*.json ./
RUN npm install --production

# 复制编译后的后端代码
COPY --from=backend-builder /app/dist-server ./dist-server

# 复制前端构建产物
COPY --from=frontend-builder /app/dist ./dist

# 安装轻量级 HTTP 服务器来托管前端（可选，也可以用 Nginx）
RUN npm install -g serve

# 暴露前后端端口
EXPOSE 3000 3001

# 创建启动脚本
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node dist-server/server/server.js &' >> /app/start.sh && \
    echo 'serve -s dist -l 3000' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]