const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, 'zh-CN');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const htmlFiles = walk(DOCS_DIR);
console.log(`Processing ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. 修复超链接：将 href="/zh-CN/..." 转换为 href="/zh-CN/...html"
    // 处理以 /zh-CN/ 开头且没有扩展名的链接
    content = content.replace(/href="(\/zh-CN\/[^#?"\s.]+)"/g, (match, p1) => {
        return `href="${p1}.html"`;
    });

    // 2. 移除会导致 Next.js SPA 拦截和 500 错误的脚本
    // 我们移除所有包含 _next/static/chunks/main-app 或 webpack 的脚本
    content = content.replace(/<script[^>]*src="\/mintlify-assets\/_next\/static\/chunks\/(main-app|webpack|framework|main|pages)-[^>]*><\/script>/g, '');

    // 3. 移除 hydrate/data 相关脚本以防止报错
    content = content.replace(/<script[^>]*>self\.__next_s=[\s\S]*?<\/script>/g, '');
    content = content.replace(/<script[^>]*>window\.__NEXT_DATA__=[\s\S]*?<\/script>/g, '');


    fs.writeFileSync(filePath, content);
});

console.log('Link fix complete!');
