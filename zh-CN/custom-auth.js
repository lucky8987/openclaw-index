/**
 * 文档页面认证状态管理
 * 用于在文档页面显示用户登录状态
 */

(function() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 添加样式
        addCustomStyles();
        // 更新认证状态
        updateDocPageAuth();
        // 监听页面变化（处理SPA导航）
        observePageChanges();
    }

    function updateDocPageAuth() {
        const token = localStorage.getItem('jwt_token');
        const username = localStorage.getItem('username');

        // 如果未登录，不做任何修改
        if (!token || !username) {
            return;
        }

        // 等待页面完全加载
        setTimeout(() => {
            // 1. 隐藏右上角的 GitHub 和 Release 按钮
            hideTopRightArea();

            // 2. 在导航栏添加龙虾icon和用户名（替换原来的GitHub位置）
            addUserMenuToDocPage();
        }, 500);
    }

    function addCustomStyles() {
        if (document.getElementById('custom-auth-styles')) return;

        const style = document.createElement('style');
        style.id = 'custom-auth-styles';
        style.textContent = `
            /* 隐藏左上角和右上角区域的辅助类 */
            .custom-hidden-area {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
            }

            /* 户菜单样式 - 默认固定在右上角 */
            #custom-user-menu {
                position: fixed !important;
                top: 12px !important;
                right: 20px !important;
                z-index: 99999 !important;
                transition: all 0.3s ease;
            }

            /* 当窗口足够宽时，尝试与居中容器对齐 (max-w-8xl 约为 1440px) */
            @media (min-width: 1500px) {
                #custom-user-menu:not(.in-navbar) {
                    right: calc(50vw - 44rem) !important; /* 45rem(720px)是容器边，减去1rem边距 */
                }
            }

            /* 如果成功挂载进导航栏容器，则使用相对定位 */
            #custom-user-menu.in-navbar {
                position: relative !important;
                top: 0 !important;
                right: 0 !important;
                z-index: 100 !important;
                margin-right: 8px;
            }
            .custom-user-container {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 6px 14px;
                background: rgba(18, 18, 40, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(80, 80, 120, 0.3);
                border-radius: 50px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
            }
            .custom-user-container:hover {
                border-color: rgba(255, 107, 107, 0.5);
                box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
            }
            .custom-lobster-icon {
                display: flex;
                align-items: center;
                filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.5));
                animation: custom-bounce 2s ease-in-out infinite;
                transition: filter 0.3s ease;
            }
            .custom-lobster-icon:hover {
                filter: drop-shadow(0 0 15px rgba(255, 107, 107, 0.8));
            }
            @keyframes custom-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }
            .custom-username {
                color: #f0f0f5;
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.5px;
            }
            .custom-logout-btn {
                padding: 4px 10px;
                background: rgba(231, 76, 60, 0.2);
                border: 1px solid rgba(231, 76, 60, 0.5);
                border-radius: 16px;
                color: #e74c3c;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            }
            .custom-logout-btn:hover {
                background: rgba(231, 76, 60, 0.35);
                border-color: #e74c3c;
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }

    function hideTopRightArea() {
        // 右上角通常包含：GitHub、Release、太阳图标、搜索框、登录按钮等
        const tryHide = () => {
            // 隐藏包含 GitHub 或 Release 文本的链接/按钮
            const allLinksAndButtons = document.querySelectorAll('a, button');
            allLinksAndButtons.forEach(el => {
                // 不隐藏我们自定义的菜单和搜索框
                if (el.closest('#custom-user-menu') ||
                    el.id === 'custom-user-menu' ||
                    el.querySelector('input[type="search"]') ||
                    el.tagName === 'INPUT') {
                    return;
                }

                const text = el.textContent || el.innerText;

                // 隐藏 GitHub 和 Release 按钮
                if (text && (text.includes('GitHub') || text.includes('Release') || text.includes('github'))) {
                    // 如果是小按钮或链接，直接隐藏
                    if (el.offsetWidth < 150) { // 只隐藏小的按钮，不隐藏大的容器
                        el.classList.add('custom-hidden-area');
                    }
                    return;
                }

                // 隐藏太阳/月亮图标（深色模式切换按钮）
                // 检查按钮内的SVG是否包含太阳或月亮的路径
                const svg = el.querySelector('svg');
                if (svg && !text) { // 如果有SVG但没有文字，可能是图标按钮
                    const rect = el.getBoundingClientRect();
                    // 检查是否在右上角
                    if (rect.top < 80 && rect.right > window.innerWidth - 300) {
                        // 检查按钮大小（图标按钮通常比较小）
                        if (el.offsetWidth < 50 && el.offsetHeight < 50) {
                            // 检查aria-label或其他属性
                            const ariaLabel = el.getAttribute('aria-label') || '';
                            const title = el.getAttribute('title') || '';
                            if (ariaLabel.includes('theme') ||
                                ariaLabel.includes('Theme') ||
                                ariaLabel.includes('模式') ||
                                ariaLabel.includes('light') ||
                                ariaLabel.includes('dark') ||
                                title.includes('theme') ||
                                title.includes('Theme')) {
                                el.classList.add('custom-hidden-area');
                            }
                        }
                    }
                }
            });

            // 隐藏特定的GitHub链接
            const githubLinks = document.querySelectorAll('a[href*="github.com"], a[href*="github.io"]');
            githubLinks.forEach(link => {
                if (!link.closest('#custom-user-menu')) {
                    link.classList.add('custom-hidden-area');
                }
            });

            // 额外：通过CSS隐藏可能的主题切换按钮
            if (!document.getElementById('hide-theme-toggle')) {
                const style = document.createElement('style');
                style.id = 'hide-theme-toggle';
                style.textContent = `
                    /* 隐藏常见的主题切换按钮 */
                    button[aria-label*="theme"],
                    button[aria-label*="Theme"],
                    button[aria-label*="模式"],
                    button[aria-label*="Toggle"],
                    [class*="theme-toggle"],
                    [class*="ThemeToggle"],
                    [class*="dark-mode-toggle"],
                    [class*="DarkModeToggle"] {
                        display: none !important;
                    }
                `;
                document.head.appendChild(style);
            }
        };

        tryHide();
        // 再次尝试，确保捕获动态加载的元素
        setTimeout(tryHide, 1000);
        setTimeout(tryHide, 2000);
        setTimeout(tryHide, 3000);
    }

    function addUserMenuToDocPage() {
        // 如果已经存在，不重复添加
        if (document.getElementById('custom-user-menu')) {
            return;
        }

        const username = localStorage.getItem('username');

        // 创建用户菜单容器
        const userMenu = document.createElement('div');
        userMenu.id = 'custom-user-menu';
        userMenu.innerHTML = `
            <div class="custom-user-container">
                <div class="custom-lobster-icon">
                    <svg viewBox="0 0 120 120" fill="none" width="28" height="28">
                        <path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z" fill="#ff6b6b" />
                        <path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z" fill="#ff6b6b" />
                        <path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z" fill="#ff6b6b" />
                        <circle cx="45" cy="35" r="6" fill="#050810" />
                        <circle cx="75" cy="35" r="6" fill="#050810" />
                        <circle cx="46" cy="34" r="2" fill="#00e5cc" />
                        <circle cx="76" cy="34" r="2" fill="#00e5cc" />
                    </svg>
                </div>
                <span class="custom-username">${username}</span>
                <button class="custom-logout-btn" onclick="handleDocLogout()">退出</button>
            </div>
        `;

        // 尝试挂载到导航栏右侧的操作区域，使其跟随页面整体布局
        // 目标是原本包含 GitHub/Releases/语言切换的那个弹性容器
        const navOperationArea = document.querySelector('#navbar .flex-1.justify-end');
        
        if (navOperationArea) {
            userMenu.classList.add('in-navbar');
            // 插入到操作区域的最前面
            navOperationArea.insertBefore(userMenu, navOperationArea.firstChild);
        } else {
            // 如果找不到导航栏容器（可能还没加载），回退到 body 挂载
            document.body.appendChild(userMenu);
        }
    }

    function observePageChanges() {
        // 监听URL变化（对于SPA应用）
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                // URL变化时重新应用认证状态
                setTimeout(updateDocPageAuth, 500);
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // 全局登出函数
    window.handleDocLogout = function() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('username');
            window.location.href = '../index.html';
        }
    };
})();
