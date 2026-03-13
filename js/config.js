/**
 * OpenClaw 前端配置文件
 * 所有可配置项集中管理，方便部署时统一修改
 */

const AppConfig = {
    /**
     * API服务器地址
     * 开发环境：http://localhost:8080
     * 生产环境：https://api.yourdomain.com
     */
    API_BASE_URL: 'http://localhost:8080',

    /**
     * API版本前缀
     */
    API_PREFIX: '/api',

    /**
     * 完整的API地址
     */
    get API_URL() {
        return this.API_BASE_URL + this.API_PREFIX;
    },

    /**
     * 前端站点地址（用于CORS和跳转）
     * 开发环境：http://localhost
     * 生产环境：https://yourdomain.com
     */
    SITE_URL: 'http://localhost',

    /**
     * JWT Token存储键名
     */
    JWT_TOKEN_KEY: 'jwt_token',

    /**
     * Token刷新阈值（毫秒）
     * 当Token剩余有效期少于此值时，自动刷新
     */
    TOKEN_REFRESH_THRESHOLD: 3600000, // 1小时

    /**
     * 订单轮询配置
     */
    ORDER_POLLING: {
        INTERVAL: 3000,        // 轮询间隔（毫秒）
        MAX_RETRIES: 300,      // 最大重试次数（300 * 3秒 = 15分钟）
        TIMEOUT: 900000        // 超时时间（毫秒）
    },

    /**
     * 验证码配置
     */
    CAPTCHA: {
        RESEND_INTERVAL: 60,   // 重发间隔（秒）
        EXPIRATION: 300        // 有效期（秒）
    },

    /**
     * 支付配置
     */
    PAYMENT: {
        AMOUNT: 99,            // 支付金额（元）
        CURRENCY: 'CNY',       // 货币单位
        TIMEOUT: 15            // 支付超时（分钟）
    },

    /**
     * 文件上传配置
     */
    UPLOAD: {
        MAX_SIZE: 100 * 1024 * 1024,  // 最大文件大小（100MB）
        ALLOWED_TYPES: ['.exe', '.dmg', '.deb', '.zip', '.tar.gz']
    },

    /**
     * 页面跳转配置
     */
    PAGES: {
        LOGIN: '/login.html',
        REGISTER: '/register.html',
        DOWNLOAD: '/download.html',
        HOME: '/',
        DOCS: '/zh-CN/index.html'
    },

    /**
     * 需要登录才能访问的页面
     */
    PROTECTED_PAGES: ['/zh-CN/', '/download.html', '/download-package.html'],

    /**
     * 调试模式
     * 开发环境：true
     * 生产环境：false
     */
    DEBUG: true,

    /**
     * 日志配置
     */
    LOG: {
        ENABLED: true,
        LEVEL: 'debug'  // debug, info, warn, error
    }
};

// 生产环境配置覆盖
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // 自动检测生产环境
    AppConfig.API_BASE_URL = 'https://api.yourdomain.com';  // 上线时修改为实际API地址
    AppConfig.SITE_URL = window.location.origin;
    AppConfig.DEBUG = false;
    AppConfig.LOG.LEVEL = 'error';
}

// 导出配置（兼容不同模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}

// 全局可用
window.AppConfig = AppConfig;
