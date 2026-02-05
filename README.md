# 蓝奏云 Vercel 代理

用于绕过 IP 封禁的 Vercel Serverless 代理。

## 部署到 Vercel

### 方法一：通过 GitHub（推荐）

1. 在 GitHub 创建新仓库
2. 上传这个文件夹的所有文件
3. 访问 [Vercel](https://vercel.com)
4. 点击 "Import Project"
5. 选择你的 GitHub 仓库
6. 点击 "Deploy"

### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

## 使用

部署成功后，你会得到一个 URL，例如：
```
https://your-project.vercel.app/api/proxy
```

在蓝奏云系统配置中使用这个 URL。

## 测试

```bash
curl -X POST https://your-project.vercel.app/api/proxy \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.ilanzou.com/unproved/login",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": "{\"loginName\":\"test\",\"loginPwd\":\"test\"}"
  }'
```

## 特点

- ✅ 免费
- ✅ 无请求次数限制（100GB 带宽/月）
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 不会被封禁
