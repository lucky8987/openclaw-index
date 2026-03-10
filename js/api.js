/**
 * OpenClaw API 封装
 * 所有API调用统一管理，使用config.js中的配置
 */

// 从全局配置获取API地址
const API_BASE_URL = (window.AppConfig ? window.AppConfig.API_BASE_URL : 'http://localhost:8080') + '/api';

/**
 * 封装fetch，自动携带JWT，处理401跳转
 */
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('jwt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem('jwt_token');
    const currentPath = window.location.pathname;
    if (!currentPath.includes('login.html') && !currentPath.includes('register.html')) {
      window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.href);
    }
  }

  return response;
}

/**
 * 认证API
 */
const AuthAPI = {
  /**
   * 获取图片验证码
   */
  async getCaptcha() {
    const response = await fetch(`${API_BASE_URL}/auth/captcha`);
    return response.json();
  },

  /**
   * 发送邮箱验证码
   */
  async sendEmailCode(email, type = 'REGISTER') {
    const response = await fetch(`${API_BASE_URL}/auth/send-email-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type })
    });
    return response.json();
  },

  /**
   * 用户注册
   */
  async register(username, email, emailCode, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, emailCode, password })
    });
    return response.json();
  },

  /**
   * 用户登录
   */
  async login(username, password, captchaKey, captchaText) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, captchaKey, captchaText })
    });
    return response.json();
  }
};

/**
 * 下载API
 */
const DownloadAPI = {
  /**
   * 检查下载权限
   */
  async checkPermission() {
    const response = await fetchWithAuth('/downloads/check-permission');
    return response.json();
  },

  /**
   * 创建下载订单
   */
  async createOrder() {
    const response = await fetchWithAuth('/downloads/create-order', { method: 'POST' });
    return response.json();
  },

  /**
   * 查询订单状态
   */
  async queryOrder(tradeNo) {
    const response = await fetch(`${API_BASE_URL}/downloads/order/${tradeNo}`);
    return response.json();
  },

  /**
   * 获取下载文件列表
   */
  async getFiles() {
    const response = await fetchWithAuth('/downloads/files');
    return response.json();
  }
};

/**
 * 用户API
 */
const UserAPI = {
  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    const response = await fetchWithAuth('/users/me');
    return response.json();
  }
};
