const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.xml':  'application/xml',
  '.txt':  'text/plain',
};

// 已移除的页面，访问时重定向到首页
const REMOVED_PAGES = ['/login.html', '/register.html'];

// 页面重定向映射
const PAGE_REDIRECTS = {
  '/download.html': '/download-package.html',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]); // 去掉 query string，解码中文路径

  // 重定向已删除的页面
  if (REMOVED_PAGES.includes(urlPath)) {
    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  // 页面重定向
  if (PAGE_REDIRECTS[urlPath]) {
    res.writeHead(302, { Location: PAGE_REDIRECTS[urlPath] });
    res.end();
    return;
  }

  // 目录默认返回 index.html
  if (urlPath.endsWith('/')) {
    urlPath += 'index.html';
  }

  const filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 404 - 尝试返回 index.html（SPA 兜底）
        fs.readFile(path.join(ROOT, 'index.html'), (e2, html) => {
          if (e2) {
            res.writeHead(404);
            res.end('404 Not Found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
          }
        });
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
      return;
    }

    const headers = { 'Content-Type': contentType };
    if (ext === '.html') {
      headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
      headers['Pragma'] = 'no-cache';
    }
    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✅ 服务已启动: http://localhost:${PORT}`);
});
