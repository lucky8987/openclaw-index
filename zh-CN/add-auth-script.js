/**
 * 批量为所有 HTML 文件添加 custom-auth.js 引用
 */

const fs = require('fs');
const path = require('path');

function addScriptToHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 检查是否已经包含 custom-auth.js
    if (content.includes('custom-auth.js')) {
        console.log(`[跳过] ${filePath} 已包含 custom-auth.js`);
        return;
    }

    // 在 </body> 标签前添加脚本引用
    const scriptTag = '<script src="custom-auth.js"></script>';

    if (content.includes('</body>')) {
        content = content.replace('</body>', `${scriptTag}\n</body>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[成功] ${filePath} 已添加 custom-auth.js`);
    } else {
        console.log(`[警告] ${filePath} 未找到 </body> 标签`);
    }
}

function processDirectory(dir) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.endsWith('.html')) {
            addScriptToHtml(fullPath);
        }
    });
}

// 开始处理
const zhCnDir = __dirname;
console.log('开始为所有文档页面添加 custom-auth.js...');
processDirectory(zhCnDir);
console.log('处理完成！');
