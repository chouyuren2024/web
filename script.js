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