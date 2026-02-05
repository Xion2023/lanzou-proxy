/**
 * Vercel Serverless Function - 蓝奏云代理
 * 部署后访问：https://your-project.vercel.app/api/proxy
 */

export default async function handler(req, res) {
    // 设置 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            error: 'Method Not Allowed' 
        });
    }

    try {
        const { url, method = 'GET', headers = {}, body = null } = req.body;

        if (!url) {
            return res.status(400).json({ 
                success: false,
                error: 'URL is required' 
            });
        }

        // 验证 URL 格式
        let targetUrl;
        try {
            targetUrl = new URL(url);
        } catch (e) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid URL' 
            });
        }

        // 构建请求选项
        const fetchOptions = {
            method: method.toUpperCase(),
            headers: {
                'User-Agent': headers['User-Agent'] || 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
                'Accept': headers['Accept'] || 'application/json, text/plain, */*',
                'Accept-Language': headers['Accept-Language'] || 'zh-CN,zh;q=0.9,en;q=0.8',
                'Connection': 'keep-alive',
            }
        };

        // 添加自定义请求头
        if (headers['Referer']) fetchOptions.headers['Referer'] = headers['Referer'];
        if (headers['Origin']) fetchOptions.headers['Origin'] = headers['Origin'];
        if (headers['Cookie']) fetchOptions.headers['Cookie'] = headers['Cookie'];
        if (headers['Content-Type']) fetchOptions.headers['Content-Type'] = headers['Content-Type'];

        // 添加请求体
        if (body && ['POST', 'PUT', 'PATCH'].includes(fetchOptions.method)) {
            fetchOptions.body = body;
        }

        // 发起请求
        const response = await fetch(targetUrl.toString(), fetchOptions);

        // 获取响应内容
        const responseBody = await response.text();

        // 获取响应头
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        // 返回代理响应
        return res.status(200).json({
            success: true,
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            body: responseBody
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
