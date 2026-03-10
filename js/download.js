/**
 * 下载页面逻辑
 */

let currentTradeNo = null;
let pollingTimer = null;

document.addEventListener('DOMContentLoaded', function() {
    checkPermission();

    document.getElementById('payBtn').addEventListener('click', handlePay);
    document.getElementById('closeQrBtn').addEventListener('click', closeQrModal);
});

/**
 * 检查下载权限
 */
async function checkPermission() {
    try {
        const result = await DownloadAPI.checkPermission();

        document.getElementById('loading').style.display = 'none';

        if (result.hasPermission) {
            // 有权限，加载文件列表
            loadFileList();
        } else {
            // 无权限，显示支付按钮
            document.getElementById('noPermission').style.display = 'block';
        }
    } catch (error) {
        console.error('检查权限失败:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('errorMessage').textContent = '检查权限失败，请刷新页面重试';
        document.getElementById('errorMessage').style.display = 'block';
    }
}

/**
 * 加载文件列表
 */
async function loadFileList() {
    try {
        const files = await DownloadAPI.getFiles();

        if (Array.isArray(files) && files.length > 0) {
            const filesContainer = document.getElementById('files');
            filesContainer.innerHTML = '';

            files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';

                fileItem.innerHTML = `
                    <div>
                        <div class="file-name">${escapeHtml(file.name)}</div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span class="file-size">${formatFileSize(file.size)}</span>
                        <a href="${file.downloadUrl}" class="btn-download" download>下载</a>
                    </div>
                `;

                filesContainer.appendChild(fileItem);
            });

            document.getElementById('fileList').style.display = 'block';
        } else {
            document.getElementById('errorMessage').textContent = '暂无可下载的文件';
            document.getElementById('errorMessage').style.display = 'block';
        }
    } catch (error) {
        console.error('加载文件列表失败:', error);
        document.getElementById('errorMessage').textContent = '加载文件列表失败';
        document.getElementById('errorMessage').style.display = 'block';
    }
}

/**
 * 处理支付
 */
async function handlePay() {
    const payBtn = document.getElementById('payBtn');
    payBtn.disabled = true;
    payBtn.textContent = '创建订单中...';

    try {
        const result = await DownloadAPI.createOrder();

        if (result.success) {
            currentTradeNo = result.tradeNo;
            showQrCode(result.qrCode);
            startPolling(result.tradeNo);
        } else {
            alert(result.message || '创建订单失败');
            payBtn.disabled = false;
            payBtn.textContent = '立即支付';
        }
    } catch (error) {
        console.error('创建订单失败:', error);
        alert('创建订单失败，请稍后重试');
        payBtn.disabled = false;
        payBtn.textContent = '立即支付';
    }
}

/**
 * 显示二维码
 */
function showQrCode(qrCodeUrl) {
    const qrModal = document.getElementById('qrModal');
    const qrcodeDiv = document.getElementById('qrcode');

    // 清空之前的二维码
    qrcodeDiv.innerHTML = '';

    // 生成二维码
    QRCode.toCanvas(qrCodeUrl, { width: 200 }, function(error, canvas) {
        if (error) {
            console.error('生成二维码失败:', error);
            qrcodeDiv.innerHTML = '<p style="color: red;">生成二维码失败</p>';
        } else {
            qrcodeDiv.appendChild(canvas);
        }
    });

    qrModal.classList.add('active');
    document.getElementById('orderStatus').textContent = '等待支付中...';
}

/**
 * 关闭二维码弹窗
 */
function closeQrModal() {
    const qrModal = document.getElementById('qrModal');
    qrModal.classList.remove('active');

    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }

    const payBtn = document.getElementById('payBtn');
    payBtn.disabled = false;
    payBtn.textContent = '立即支付';
}

/**
 * 开始轮询订单状态
 */
function startPolling(tradeNo) {
    let retryCount = 0;
    const maxRetries = 300; // 15分钟 (300 * 3秒)

    pollingTimer = setInterval(async () => {
        retryCount++;

        if (retryCount > maxRetries) {
            clearInterval(pollingTimer);
            pollingTimer = null;
            document.getElementById('orderStatus').textContent = '订单已超时，请重新支付';
            return;
        }

        try {
            const result = await DownloadAPI.queryOrder(tradeNo);

            if (result.status === 'SUCCESS') {
                clearInterval(pollingTimer);
                pollingTimer = null;

                document.getElementById('orderStatus').innerHTML = '<span style="color: #4CAF50;">支付成功！</span>';

                setTimeout(() => {
                    closeQrModal();
                    location.reload(); // 刷新页面显示文件列表
                }, 2000);
            }
        } catch (error) {
            console.error('查询订单失败:', error);
        }
    }, 3000); // 每3秒查询一次
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
