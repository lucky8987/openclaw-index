/**
 * OpenClaw 前端配置文件
 */

const AppConfig = {
    /**
     * 前端站点地址
     */
    SITE_URL: window.location.origin,

    /**
     * 页面跳转配置
     */
    PAGES: {
        DOWNLOAD: '/download.html',
        HOME: '/',
        DOCS: '/zh-CN/index.html'
    },

    /**
     * 调试模式
     */
    DEBUG: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}

window.AppConfig = AppConfig;
