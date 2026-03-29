// 定義切換按鈕的 DOM 元素 (稍後會在 HTML 加按鈕)
const toggleButton = document.getElementById('theme-toggle');

// 1. 核心邏輯：判斷目前應該是什麼模式
function getPreferredTheme() {
    // 檢查使用者是否曾經選過
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        return storedTheme;
    }
    // 如果沒選過，檢查系統設定
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 2. 套用模式到網頁
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // 記住使用者的選擇
    
    // 改變按鈕文字（選用）
    if(toggleButton) {
        toggleButton.textContent = theme === 'dark' ? '☀' : '🌙';
    }
}

// 3. 初始化：網頁載入時執行
document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = getPreferredTheme();
    setTheme(currentTheme);

    // 4. 按鈕點擊事件
    if(toggleButton) {
        toggleButton.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const nextTheme = current === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
        });
    }
});

function startPhotoCarousel() {
    const images = document.querySelectorAll('.carousel-img');
    if (images.length === 0) return;

    let currentIndex = 0;

    setInterval(() => {
        // 移除當前照片的 active 類別
        images[currentIndex].classList.remove('active');
        
        // 計算下一張照片的索引
        currentIndex = (currentIndex + 1) % images.length;
        
        // 加入 active 類別顯示下一張
        images[currentIndex].classList.add('active');
    }, 5000); // 5000 毫秒 = 5 秒
}

// 確保網頁載入後執行
document.addEventListener('DOMContentLoaded', () => {
    startPhotoCarousel();
});

// 回到頂部按鈕邏輯
document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('back-to-top');

    // 1. 監聽捲動事件
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { // 下滑超過 300px 顯示
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // 2. 點擊按鈕捲動到頂部
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑捲動
        });
    });
});
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-img');

function showSlide(index) {
    // 1. 先隱藏所有圖片
    slides.forEach(img => {
        img.classList.remove('active');
    });

    // 2. 計算新索引（處理循環：最後一張點右會回到第一張）
    currentSlide = (index + slides.length) % slides.length;

    // 3. 顯示目標圖片
    slides[currentSlide].classList.add('active');
}

// 按鈕點擊事件
function changeSlide(step) {
    showSlide(currentSlide + step);
}

// (選填) 如果你想要自動輪播，可以加上這行：
// setInterval(() => changeSlide(1), 5000);

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('article-search');
    const tagButtons = document.querySelectorAll('.filter-tag');
    const articles = document.querySelectorAll('.article-card');

    let currentTag = 'all';
    let currentSearch = '';

    // 核心過濾器
    function updateFilters() {
        articles.forEach(article => {
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const articleTags = Array.from(article.querySelectorAll('.tag')).map(t => 
                t.textContent.replace('#', '').trim()
            );

            // 條件 1: 標題關鍵字匹配
            const matchesSearch = title.includes(currentSearch);
            
            // 條件 2: 標籤匹配 (如果是 'all' 則全過)
            const matchesTag = (currentTag === 'all') || articleTags.includes(currentTag);

            // 必須同時滿足兩個條件
            if (matchesSearch && matchesTag) {
                article.classList.remove('hidden');
            } else {
                article.classList.add('hidden');
            }
        });
    }

    // 監聽搜尋輸入
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        updateFilters();
    });

    // 監聽標籤按鈕點擊
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 切換按鈕 UI 狀態
            tagButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 更新當前標籤並過濾
            currentTag = button.getAttribute('data-tag');
            updateFilters();
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('article-search');
    const checkboxes = document.querySelectorAll('.tag-checkbox');
    const articles = document.querySelectorAll('.article-card');

    function updateFilters() {
        const searchText = searchInput.value.toLowerCase().trim();
        
        // 取得所有已勾選的標籤值
        const selectedTags = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        articles.forEach(article => {
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            // 取得該文章所有的 htag 內容
            const articleTags = Array.from(article.querySelectorAll('.tag')).map(t => 
                t.textContent.replace('#', '').trim()
            );

            // 判斷 1: 標題是否包含搜尋字
            const matchesSearch = title.includes(searchText);
            
            // 判斷 2: 是否符合勾選的標籤
            // 如果沒勾選任何框，則預設為 true (顯示全部)
            // 如果有勾選，文章必須包含「至少一個」勾選的標籤
            const matchesTags = selectedTags.length === 0 || 
                               selectedTags.some(tag => articleTags.includes(tag));

            // 同時滿足才顯示
            if (matchesSearch && matchesTags) {
                article.classList.remove('hidden');
            } else {
                article.classList.add('hidden');
            }
        });
    }

    // 監聽搜尋框輸入
    searchInput.addEventListener('input', updateFilters);

    // 監聽每一個勾選框的狀態改變
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateFilters);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有文章卡片
    const cards = document.querySelectorAll('.article-card');

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // 找到卡片內的標題連結
            const link = card.querySelector('.article-title');
            
            if (link) {
                // 如果點擊的是標題本身，讓原本的 a 標籤處理即可
                // 如果點擊的是空白處，則手動觸發跳轉
                if (e.target !== link) {
                    window.location.href = link.href;
                }
            }
        });
    });
});

function showInfo(title, desc, link) {
    const panel = document.getElementById('info-panel');
    panel.style.opacity = 0;
    panel.style.transform = "translateY(15px)";
    
    setTimeout(() => {
        // 基本 HTML 內容
        let content = `
            <h2 class="cosmos-info-title">${title}</h2>
            <p class="cosmos-info-desc">${desc}</p>
        `;

        // 如果有傳入 link，就加上按鈕
 if (link) {
    content += `
        <div style="display:flex; gap:12px; margin-top:20px;">
            <a href="${link}" target="_blank" class="cosmos-btn">查看專案詳情</a>
        </div>
    `;
}

        panel.innerHTML = content;
        panel.style.opacity = 1;
        panel.style.transform = "translateY(0)";
    }, 300);
}


        updateThemeUI(document.documentElement.getAttribute('data-theme'));
        document.getElementById('info-panel').style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";