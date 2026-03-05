const fs = require('fs');
const path = require('path');
const https = require('https');

const IMG_URL = 'https://mintlify.s3.us-west-1.amazonaws.com/clawdhub/zh-CN/whatsapp-openclaw.jpg';
const IMG_PATH = 'zh-CN/whatsapp-openclaw.jpg';

async function downloadFile(url, dest) {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://docs.openclaw.ai/'
            }
        };
        https.get(url, options, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download: ${res.statusCode} at ${url}`));
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', reject);
    });
}

function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processHtmlFiles(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            // 1. 修复图片路径：将远程 S3 URL 替换为本地相对路径
            // 注意：本地文件在 zh-CN 下，或者根目录下。
            // 这里统一替换为绝对路径 /zh-CN/whatsapp-openclaw.jpg 较稳妥
            if (content.includes(IMG_URL)) {
                content = content.replace(new RegExp(IMG_URL, 'g'), '/zh-CN/whatsapp-openclaw.jpg');
                changed = true;
            }

            // 2. 修复 Favicon 残留破损 (🦞"> 残留字符)
            // 之前的脚本误删了 <head> 后的部分内容，我们要精确清理可能存在的 🦞"> 或类似字符
            // 根据之前的 view_file 结果，index.html 已经被我手动修复了一部分，但全量扫描更安全
            const brokenRegex = /🦞['"]?>/g;
            if (brokenRegex.test(content)) {
                content = content.replace(brokenRegex, '');
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(fullPath, content);
                console.log(`Fixed: ${fullPath}`);
            }
        }
    });
}

async function run() {
    try {
        console.log('Downloading image...');
        await downloadFile(IMG_URL, path.join(process.cwd(), IMG_PATH));
        console.log('Image downloaded.');

        console.log('Processing HTML files...');
        processHtmlFiles(process.cwd());
        console.log('Done.');
    } catch (err) {
        console.error(err);
    }
}

run();
