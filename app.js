// ============================================
// OpenClaw Clone - 交互逻辑
// ============================================

// 从全局配置获取API地址
const apiBaseUrl = window.AppConfig ? window.AppConfig.API_BASE_URL : 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initScrollReveal();
  initCopyButton();
  initDownloadTabs();
});

// ============================================
// 快速下载 Tab 切换
// ============================================
function initDownloadTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const blocks = document.querySelectorAll('.platform-block');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const platform = tab.getAttribute('data-platform');

      // 切换按钮状态
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // 切换内容块
      blocks.forEach(block => {
        block.classList.remove('active');
        if (block.id === `download-${platform}`) {
          block.classList.add('active');
        }
      });
    });
  });
}

// ============================================
// 星空背景动画
// ============================================
function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 200;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.0003 + 0.0001,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      const twinkle = Math.sin(time * star.speed * 1000 + star.phase) * 0.3 + 0.7;
      const alpha = star.opacity * twinkle;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  requestAnimationFrame(draw);

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
}

// ============================================
// 滚动进入视图动画
// ============================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// 复制安装命令
// ============================================
function initCopyButton() {
  const copyBtn = document.getElementById('copyInstall');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const command = 'iwr -useb https://openclaw.ai/install.ps1 | iex';
    navigator.clipboard.writeText(command).then(() => {
      copyBtn.textContent = '✅';
      setTimeout(() => {
        copyBtn.textContent = '📋';
      }, 2000);
    }).catch(() => {
      // fallback
      copyBtn.textContent = '❌';
      setTimeout(() => {
        copyBtn.textContent = '📋';
      }, 2000);
    });
  });
}
// ============================================
// 通用工具：复制到剪贴板
// ============================================
window.copyToClipboard = function (text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="#2dd4a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    btn.style.borderColor = "#2dd4a8";

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.borderColor = "";
    }, 2000);
  }).catch(err => {
    console.error('无法复制: ', err);
  });
};

// ============================================
// 更新导航栏用户状态
// ============================================
function updateAuthStatus() {
  const token = localStorage.getItem('jwt_token');
  const username = localStorage.getItem('username');
  const authArea = document.getElementById('authArea');

  if (!authArea) return;

  // 龙虾图标 SVG
  const lobsterIcon = `
    <svg class="lobster-mini-icon" viewBox="0 0 120 120" fill="none" width="24" height="24" style="margin-right: 8px;">
      <path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z" fill="url(#lobster-gradient-mini)"></path>
      <path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z" fill="url(#lobster-gradient-mini)"></path>
      <path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z" fill="url(#lobster-gradient-mini)"></path>
      <path d="M45 15 Q35 5 30 8" stroke="#ff8e8e" stroke-width="2" stroke-linecap="round"></path>
      <path d="M75 15 Q85 5 90 8" stroke="#ff8e8e" stroke-width="2" stroke-linecap="round"></path>
      <circle cx="45" cy="35" r="6" fill="#050810"></circle>
      <circle cx="75" cy="35" r="6" fill="#050810"></circle>
      <circle cx="46" cy="34" r="2" fill="#00e5cc"></circle>
      <circle cx="76" cy="34" r="2" fill="#00e5cc"></circle>
      <defs>
        <linearGradient id="lobster-gradient-mini" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff6b6b"></stop>
          <stop offset="100%" stop-color="#ff4d4d"></stop>
        </linearGradient>
      </defs>
    </svg>
  `;

  if (token && username) {
    // 已登录：显示龙虾图标和用户名
    authArea.innerHTML = `
      <div class="user-menu">
        <button class="auth-btn user-btn" title="用户菜单">
          ${lobsterIcon}
          ${username}
        </button>
        <div class="user-dropdown">
          <a href="./zh-CN/index.html" class="dropdown-item">文档中心</a>
          <button onclick="handleLogout()" class="dropdown-item">退出登录</button>
        </div>
      </div>
    `;
  } else {
    // 未登录：显示龙虾图标和登录按钮
    authArea.innerHTML = `
      <a href="./login.html" class="auth-btn" title="登录或注册" id="authBtn">
        ${lobsterIcon}
        登录/注册
      </a>
    `;
  }

  // 添加CSS样式
  const style = document.createElement('style');
  style.textContent = `
    .user-menu {
      position: relative;
      display: inline-block;
    }
    .user-btn {
      cursor: pointer;
    }
    .lobster-mini-icon {
      filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.4));
    }
    .user-dropdown {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      min-width: 160px;
      background: rgba(18, 18, 40, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(80, 80, 120, 0.25);
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      z-index: 1000;
    }
    .user-menu:hover .user-dropdown {
      display: block;
    }
    .dropdown-item {
      display: block;
      width: 100%;
      padding: 12px 16px;
      color: #9898b0;
      text-decoration: none;
      font-size: 14px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .dropdown-item:hover {
      background: rgba(231, 76, 60, 0.1);
      color: #f0f0f5;
    }
  `;
  document.head.appendChild(style);
}

// 登出处理
function handleLogout() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('username');
  window.location.reload();
}

// 页面加载时更新认证状态
document.addEventListener('DOMContentLoaded', updateAuthStatus);
