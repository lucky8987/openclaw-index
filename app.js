// ============================================
// OpenClaw Clone - 交互逻辑
// ============================================

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
