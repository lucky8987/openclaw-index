const fs = require('fs');
const path = require('path');
const https = require('https');

const FAVICON_URLS = [
    'https://docs.openclaw.ai/mintlify-assets/_mintlify/favicons/clawdhub/cONjIcMxQXYcuO6j/_generated/favicon/favicon-32x32.png',
    'https://docs.openclaw.ai/mintlify-assets/_mintlify/favicons/clawdhub/cONjIcMxQXYcuO6j/_generated/favicon/favicon-16x16.png',
    'https://docs.openclaw.ai/mintlify-assets/_mintlify/favicons/clawdhub/cONjIcMxQXYcuO6j/_generated/favicon/apple-touch-icon.png',
    'https://docs.openclaw.ai/mintlify-assets/_mintlify/favicons/clawdhub/cONjIcMxQXYcuO6j/_generated/favicon/favicon.ico'
];

const ASSETS_BASE = 'mintlify-assets/_mintlify/favicons/clawdhub/cONjIcMxQXYcuO6j/_generated/favicon';
const LOCAL_DIR = path.join(__dirname, ASSETS_BASE);

if (!fs.existsSync(LOCAL_DIR)) {
    fs.mkdirSync(LOCAL_DIR, { recursive: true });
}

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                reject(new Error(`Status ${response.statusCode} for ${url}`));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function main() {
    console.log('Downloading favicons...');
    for (const url of FAVICON_URLS) {
        const filename = path.basename(url);
        const dest = path.join(LOCAL_DIR, filename);
        await downloadFile(url, dest).catch(e => console.error(e.message));
    }

    const htmlFiles = [];
    function walk(dir) {
        fs.readdirSync(dir).forEach(file => {
            const full = path.join(dir, file);
            if (fs.statSync(full).isDirectory()) walk(full);
            else if (full.endsWith('.html')) htmlFiles.push(full);
        });
    }

    // Process root index.html
    htmlFiles.push(path.join(__dirname, 'index.html'));
    // Process zh-CN docs
    if (fs.existsSync(path.join(__dirname, 'zh-CN'))) {
        walk(path.join(__dirname, 'zh-CN'));
    }

    console.log(`Updating ${htmlFiles.length} files...`);

    const faviconHTML = `
  <link rel="apple-touch-icon" sizes="180x180" href="/${ASSETS_BASE}/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/${ASSETS_BASE}/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/${ASSETS_BASE}/favicon-16x16.png">
  <link rel="shortcut icon" href="/${ASSETS_BASE}/favicon.ico">`;

    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');

        // Remove existing favicon tags
        content = content.replace(/<link rel="(icon|shortcut icon|apple-touch-icon)"[^>]*>/g, '');

        // Insert new ones before </head>
        content = content.replace('</head>', `${faviconHTML}\n</head>`);

        fs.writeFileSync(file, content);
    });

    console.log('Done!');
}

main();
