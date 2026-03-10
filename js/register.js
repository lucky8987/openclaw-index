/**
 * 注册页面逻辑
 */

let countdown = 0;

document.addEventListener('DOMContentLoaded', function() {
    // 发送验证码按钮
    document.getElementById('sendCodeBtn').addEventListener('click', handleSendCode);

    // 表单提交
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

/**
 * 处理发送验证码
 */
async function handleSendCode() {
    const email = document.getElementById('email').value.trim();

    if (!email) {
        showMessage('请输入邮箱地址', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('请输入有效的邮箱地址', 'error');
        return;
    }

    if (countdown > 0) {
        showMessage(`请等待${countdown}秒后再试`, 'error');
        return;
    }

    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const originalText = sendCodeBtn.textContent;
    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = '发送中...';

    try {
        const result = await AuthAPI.sendEmailCode(email, 'REGISTER');

        if (result.success) {
            showMessage('验证码已发送到您的邮箱', 'success');
            startCountdown();
        } else {
            showMessage(result.message || '发送失败', 'error');
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = originalText;
        }
    } catch (error) {
        console.error('发送验证码失败:', error);
        showMessage('发送验证码失败，请稍后重试', 'error');
        sendCodeBtn.disabled = false;
        sendCodeBtn.textContent = originalText;
    }
}

/**
 * 开始倒计时（60秒）
 */
function startCountdown() {
    countdown = 60;
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    sendCodeBtn.disabled = true;

    const timer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            sendCodeBtn.textContent = `${countdown}秒后重试`;
        } else {
            sendCodeBtn.textContent = '发送验证码';
            sendCodeBtn.disabled = false;
            clearInterval(timer);
        }
    }, 1000);

    // 立即显示第一秒
    sendCodeBtn.textContent = `${countdown}秒后重试`;
}

/**
 * 处理注册
 */
async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const emailCode = document.getElementById('emailCode').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 验证
    if (!username || !email || !emailCode || !password || !confirmPassword) {
        showMessage('请填写所有必填项', 'error');
        return;
    }

    if (username.length < 3 || username.length > 20) {
        showMessage('用户名长度应在3-20个字符之间', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('请输入有效的邮箱地址', 'error');
        return;
    }

    if (password.length < 8) {
        showMessage('密码长度至少为8位', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('两次输入的密码不一致', 'error');
        return;
    }

    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.disabled = true;
    submitBtn.textContent = '注册中...';

    try {
        const result = await AuthAPI.register(username, email, emailCode, password);

        if (result.success) {
            showMessage('注册成功！即将跳转到登录页...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage(result.message || '注册失败', 'error');
        }
    } catch (error) {
        console.error('注册失败:', error);
        showMessage('注册失败，请稍后重试', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '注册';
    }
}

/**
 * 验证邮箱格式
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 显示消息
 */
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
}
