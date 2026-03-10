/**
 * 登录页面逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
    loadCaptcha();

    // 点击验证码图片刷新
    document.getElementById('captchaImage').addEventListener('click', loadCaptcha);

    // 表单提交
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

/**
 * 加载图片验证码
 */
async function loadCaptcha() {
    try {
        const result = await AuthAPI.getCaptcha();
        if (result.captchaKey && result.captchaImage) {
            document.getElementById('captchaKey').value = result.captchaKey;
            document.getElementById('captchaImage').src = result.captchaImage;
        }
    } catch (error) {
        console.error('加载验证码失败:', error);
        showMessage('加载验证码失败，请刷新页面重试', 'error');
    }
}

/**
 * 处理登录
 */
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const captchaKey = document.getElementById('captchaKey').value;
    const captchaText = document.getElementById('captcha').value.trim();

    if (!username || !password || !captchaText) {
        showMessage('请填写所有必填项', 'error');
        return;
    }

    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.disabled = true;
    submitBtn.textContent = '登录中...';

    try {
        const result = await AuthAPI.login(username, password, captchaKey, captchaText);

        if (result.success) {
            // 保存JWT Token和用户信息
            localStorage.setItem('jwt_token', result.token);
            localStorage.setItem('username', result.user.username);

            showMessage('登录成功！', 'success');

            // 跳转到文档页
            setTimeout(() => {
                window.location.href = './zh-CN/index.html';
            }, 1000);
        } else {
            showMessage(result.message || '登录失败', 'error');
            loadCaptcha(); // 刷新验证码
            document.getElementById('captcha').value = '';
        }
    } catch (error) {
        console.error('登录失败:', error);
        showMessage('登录失败，请稍后重试', 'error');
        loadCaptcha();
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '登录';
    }
}

/**
 * 显示消息
 */
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
}
