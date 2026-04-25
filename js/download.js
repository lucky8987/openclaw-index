/**
 * 下载页面逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
    showFileList();
});

/**
 * 展示本地安装包列表
 */
function showFileList() {
    const files = [
        { name: 'Windows 安装包', filename: 'OpenClaw.boot_x64-setup.exe', size: '1.82 MB', platform: 'windows' },
        { name: 'macOS 安装包', filename: 'OpenClaw.boot_universal.dmg', size: '4.69 MB', platform: 'macos' },
        { name: 'Linux 安装包 (Debian/Ubuntu)', filename: 'OpenClaw.boot_amd64.deb', size: '2.81 MB', platform: 'linux' }
    ];

    document.getElementById('loading').style.display = 'none';

    const filesContainer = document.getElementById('files');
    filesContainer.innerHTML = '';

    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div>
                <div class="file-name">${file.name}</div>
                <div style="color:#999;font-size:13px;margin-top:4px;">${file.size}</div>
            </div>
            <a href="install-package/${file.filename}" class="btn-download" download>下载</a>
        `;
        filesContainer.appendChild(fileItem);
    });

    document.getElementById('fileList').style.display = 'block';
}
