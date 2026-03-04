// ============================================
// OpenClaw Clone - 交互逻辑
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initScrollReveal();
  initCopyButton();
});

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
