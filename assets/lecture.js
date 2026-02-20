/* ============================================
   NautilusTrader 教材 — 全局腳本
   ============================================ */

(function () {
    'use strict';

    // ========== 初始化 ==========
    document.addEventListener('DOMContentLoaded', function () {
        initCollapsibles();
        initMermaid();
        initBackToTop();
        initSidebarToggle();
        initSyntaxHighlight();
        initAnimations();
        initDiagramZoom(); // 新增：圖表放大功能
    });

    // ========== 可折疊區塊 ==========
    function initCollapsibles() {
        document.querySelectorAll('.collapsible-header').forEach(function (header) {
            header.addEventListener('click', function () {
                var parent = this.parentElement;
                parent.classList.toggle('open');
            });
        });
    }

    // ========== Mermaid 圖表初始化 ==========
    function initMermaid() {
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'dark',
                themeVariables: {
                    primaryColor: '#2a3042',
                    primaryTextColor: '#e0e0e0',
                    primaryBorderColor: '#4fc3f7',
                    lineColor: '#4fc3f7',
                    secondaryColor: '#1e2336',
                    tertiaryColor: '#242938',
                    fontFamily: 'Inter, Noto Sans TC, sans-serif',
                    fontSize: '14px',
                    nodeBorder: '#4fc3f7',
                    mainBkg: '#1e2336',
                    clusterBkg: '#242938',
                    clusterBorder: '#353b50',
                    titleColor: '#26c6da',
                    edgeLabelBackground: '#1a1f2e',
                    nodeTextColor: '#e0e0e0'
                },
                flowchart: {
                    htmlLabels: true,
                    curve: 'basis',
                    padding: 15
                },
                sequence: {
                    mirrorActors: false,
                    actorMargin: 80,
                    messageMargin: 40
                }
            });
        }
    }

    // ========== 圖表放大功能 ==========
    function initDiagramZoom() {
        // 使用定時器遞歸檢查，確保 Mermaid 渲染完成
        var checkAndAdd = function () {
            var wrappers = document.querySelectorAll('.mermaid-wrapper');
            var allRendered = true;

            wrappers.forEach(function (wrapper) {
                // 如果已經有按鈕了，跳過
                if (wrapper.querySelector('.diagram-zoom-btn')) return;

                var svg = wrapper.querySelector('svg');
                if (!svg) {
                    allRendered = false;
                    return;
                }

                var btn = document.createElement('button');
                btn.className = 'diagram-zoom-btn';
                btn.innerHTML = '🔍';
                btn.title = '點擊放大圖表';

                btn.addEventListener('click', function () {
                    var currentSvg = wrapper.querySelector('svg');
                    var caption = wrapper.querySelector('.caption');
                    var title = caption ? caption.textContent : '圖表放大檢視';

                    if (currentSvg) {
                        showDiagramModal(title, currentSvg.outerHTML);
                    }
                });

                wrapper.appendChild(btn);
            });

            if (!allRendered) {
                setTimeout(checkAndAdd, 500);
            }
        };

        checkAndAdd();
    }

    // ========== 回到頂部 ==========
    function initBackToTop() {
        var btn = document.querySelector('.back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== 側邊欄手機切換 ==========
    function initSidebarToggle() {
        var toggle = document.querySelector('.menu-toggle');
        var sidebar = document.querySelector('.sidebar');
        if (!toggle || !sidebar) return;

        toggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
        });

        // 點擊主內容區域關閉側邊欄
        document.querySelector('.main-content').addEventListener('click', function () {
            sidebar.classList.remove('open');
        });
    }

    // ========== 簡易語法高亮 ==========
    function initSyntaxHighlight() {
        document.querySelectorAll('pre code').forEach(function (block) {
            var lang = block.className.match(/language-(\w+)/);
            if (!lang) return;
            lang = lang[1];

            var text = block.innerHTML;

            if (lang === 'python' || lang === 'py') {
                text = highlightPython(text);
            } else if (lang === 'rust' || lang === 'rs') {
                text = highlightRust(text);
            }

            block.innerHTML = text;
        });
    }

    function highlightPython(code) {
        // 註釋（# 開頭）
        code = code.replace(/(#[^\n]*)/g, '<span class="token-comment">$1</span>');
        // 字串
        code = code.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g, '<span class="token-string">$1</span>');
        // 裝飾器
        code = code.replace(/(@\w+)/g, '<span class="token-decorator">$1</span>');
        // 關鍵字
        var keywords = /\b(def|class|import|from|return|if|elif|else|for|while|try|except|finally|with|as|yield|async|await|pass|break|continue|raise|None|True|False|self|and|or|not|in|is|lambda)\b/g;
        code = code.replace(keywords, '<span class="token-keyword">$1</span>');
        // 數字
        code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>');
        return code;
    }

    function highlightRust(code) {
        // 註釋
        code = code.replace(/(\/\/[^\n]*)/g, '<span class="token-comment">$1</span>');
        // 字串
        code = code.replace(/("[^"]*")/g, '<span class="token-string">$1</span>');
        // 關鍵字
        var keywords = /\b(fn|let|mut|pub|struct|enum|impl|trait|use|mod|self|Self|super|crate|match|if|else|for|while|loop|return|break|continue|async|await|where|type|const|static|ref|move|unsafe|extern|as|in|dyn|Box|Vec|Option|Result|Some|None|Ok|Err|true|false)\b/g;
        code = code.replace(keywords, '<span class="token-keyword">$1</span>');
        // 類型
        code = code.replace(/\b([A-Z][A-Za-z0-9]+)\b/g, '<span class="token-class">$1</span>');
        // 數字
        code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>');
        return code;
    }

    // ========== 進場動畫 ==========
    function initAnimations() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card, .module-card, .card').forEach(function (el) {
            observer.observe(el);
        });
    }

    // ========== 浮動視窗 (Modal) ==========
    function createModal(isDiagram) {
        var id = isDiagram ? 'diagram-modal' : 'answer-modal';
        if (document.getElementById(id)) return;

        var extraClass = isDiagram ? 'large-modal' : '';
        var bodyClass = isDiagram ? 'diagram-zoom-body' : '';

        var html = `
            <div id="${id}" class="modal-overlay">
                <div class="modal-container ${extraClass}">
                    <div class="modal-header">
                        <div class="modal-title">🐚 參考解答</div>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body ${bodyClass}"></div>
                    <div class="modal-footer">
                        <button class="btn-secondary">關閉</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        var overlay = document.getElementById(id);
        var closeBtn = overlay.querySelector('.modal-close');
        var footerBtn = overlay.querySelector('.modal-footer .btn-secondary');

        var close = function () {
            overlay.classList.remove('active');
            setTimeout(function () {
                document.body.style.overflow = '';
            }, 300);
        };

        closeBtn.addEventListener('click', close);
        footerBtn.addEventListener('click', close);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });
    }

    window.showModal = function (title, content) {
        createModal(false);
        var overlay = document.getElementById('answer-modal');
        var modalTitle = overlay.querySelector('.modal-title');
        var modalBody = overlay.querySelector('.modal-body');

        modalTitle.innerHTML = title || '參考解答';
        modalBody.innerHTML = content.trim();

        document.body.style.overflow = 'hidden';
        overlay.classList.add('active');
    };

    window.showDiagramModal = function (title, svgHtml) {
        createModal(true);
        var overlay = document.getElementById('diagram-modal');
        var modalTitle = overlay.querySelector('.modal-title');
        var modalBody = overlay.querySelector('.modal-body');

        modalTitle.innerHTML = title || '圖表放大檢視';
        modalBody.innerHTML = svgHtml;

        document.body.style.overflow = 'hidden';
        overlay.classList.add('active');
    };

    // ========== 互動練習 ==========
    window.toggleAnswer = function (id) {
        var el = document.getElementById(id);
        if (el) {
            var content = el.innerHTML;
            window.showModal('🐚 參考解答', content.trim());
        }
    };

})();
