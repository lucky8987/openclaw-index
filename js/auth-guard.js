/**
 * 路由守卫 - 保护需要登录的页面
 */

// 需要登录才能访问的页面���径（保护下载相关页面）
const PROTECTED_PAGES = ['/download.html', '/download-package.html'];

(function() {
  const currentPath = window.location.pathname;

  // 检查当前页面是否需要保护
  const needsAuth = PROTECTED_PAGES.some(page => currentPath.startsWith(page));

  if (needsAuth) {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      // 未登录，跳转到登录页
      window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.href);
      return;
    }

    // 可选：验证token是否有效
    // 这里简化处理，只检查token是否存在
    // 实际可以在页面加载时调用 /api/users/me 验证token有效性
  }
})();
