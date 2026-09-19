/**
 * 🚀 程式夥伴整理的強壯版 script.js
 * 核心原則：先檢查元素是否存在，再執行邏輯，避免報錯中斷
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🌟 網頁指令已成功啟動！");

    // === 1. 宇宙行星旋轉邏輯 (專屬於 project.html) ===
	
    const cards = document.querySelectorAll('.section-card');
    const planets = document.querySelectorAll('.planet');

    if (cards.length > 0 && planets.length > 0) {
        console.log("✅ 偵測到宇宙區塊，行星軌道計算中...");
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.1 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = entry.target.getAttribute('data-idx');
                    updateUniverse(parseInt(idx));
                }
            });
        }, observerOptions);

        cards.forEach(card => observer.observe(card));

        function updateUniverse(activeIndex) {
            cards.forEach((card, index) => {
                card.classList.toggle('active', index === activeIndex);
            });
            planets.forEach((planet, index) => {
                const angleInDegrees = (index * 90) - (activeIndex * 90);
                const rad = angleInDegrees * (Math.PI / 180);
                const radius = 160; 
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                const isActive = (index === activeIndex);
                planet.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${isActive ? 1.5 : 0.7})`;
                planet.style.opacity = isActive ? "1" : "0.3";
                planet.style.zIndex = isActive ? "10" : "1";
            });
        }
        updateUniverse(0); // 初始化第一顆行星
		
		// 強制校準：確保一進網頁，第一個區塊就是啟動狀態
    setTimeout(() => {
        window.scrollTo(0, 0); // 回到最上方
        updateUniverse(0);     // 啟動第一個星球
    }, 100);
    }

    // === 2. 主題切換 (全域通用) ===
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const getTheme = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const setTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            document.body.classList.toggle('light-theme', theme === 'light'); // 配合你之前的 CSS
            localStorage.setItem('theme', theme);
            themeBtn.innerText = theme === 'dark' ? '☀️' : '🌙';
        };
        
        setTheme(getTheme());
        themeBtn.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    // === 3. 回到頂部按鈕 ===
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('show', window.pageYOffset > 300);
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // === 4. 文章搜尋與標籤過濾 (專屬於文章頁面) ===
    const searchInput = document.getElementById('article-search');
    const articles = document.querySelectorAll('.article-card');
    const checkboxes = document.querySelectorAll('.tag-checkbox');

    if (searchInput && articles.length > 0) {
        const updateFilters = () => {
            const searchText = searchInput.value.toLowerCase().trim();
            const selectedTags = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

            articles.forEach(article => {
                const title = article.querySelector('.article-title').textContent.toLowerCase();
                const articleTags = Array.from(article.querySelectorAll('.tag')).map(t => t.textContent.replace('#', '').trim());
                const matchesSearch = title.includes(searchText);
                const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => articleTags.includes(tag));
                article.classList.toggle('hidden', !(matchesSearch && matchesTags));
            });
        };
        searchInput.addEventListener('input', updateFilters);
        checkboxes.forEach(cb => cb.addEventListener('change', updateFilters));
    }

    // === 5. 照片輪播 (如果有 carousel 元素) ===
    const carouselImages = document.querySelectorAll('.carousel-img');
    if (carouselImages.length > 0) {
        let currentIdx = 0;
        setInterval(() => {
            carouselImages[currentIdx].classList.remove('active');
            currentIdx = (currentIdx + 1) % carouselImages.length;
            carouselImages[currentIdx].classList.add('active');
        }, 5000);
    }
    
    // === 6. 其他 UI 安全設定 ===
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel) {
        infoPanel.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
    }
});