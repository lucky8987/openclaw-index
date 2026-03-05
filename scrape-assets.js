const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://docs.openclaw.ai';
const DOCS_DIR = path.join(__dirname, 'zh-CN');
const ASSETS_DIR = path.join(__dirname, 'mintlify-assets');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadFile(url, dest) {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function main() {
    const files = fs.readdirSync(DOCS_DIR, { recursive: true }).filter(f => f.endsWith('.html'));
    const assets = new Set();

    console.log(`Scanning ${files.length} HTML files for assets...`);

    for (const file of files) {
        const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
        // Simple regex to find /mintlify-assets/ links
        const matches = content.match(/\/mintlify-assets\/[^"'>\s?]+/g);
        if (matches) {
            matches.forEach(m => assets.add(m));
        }
    }

    console.log(`Found ${assets.size} unique assets. Starting download...`);

    let count = 0;
    for (const assetPath of assets) {
        const url = BASE_URL + assetPath;
        const localPath = path.join(__dirname, assetPath.substring(1).split('?')[0]);

        try {
            if (!fs.existsSync(localPath)) {
                await downloadFile(url, localPath);
                count++;
                if (count % 10 === 0) console.log(`Downloaded ${count}/${assets.size} assets...`);
                await sleep(50); // Slight delay
            }
        } catch (err) {
            console.error(`Error downloading ${url}:`, err.message);
        }
    }

    console.log(`Done! Downloaded ${count} new assets. Total unique assets: ${assets.size}`);
}

main().catch(console.error);
