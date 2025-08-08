// 全局变量
let currentCategory = 'all';
let siteData = {};

// DOM元素
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const sidebarNav = document.querySelector('.sidebar-nav');
const contentWrapper = document.querySelector('.content-wrapper');

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    try {
        console.log('开始初始化应用...');
        
        // 使用外部数据文件中的数据
        siteData = siteDataConfig;
        
        // 初始化侧边栏
        initializeSidebar();
        
        // 初始化事件监听器
        initializeEventListeners();
        
        // 渲染默认内容
        renderContent('all');
        
        console.log('应用初始化完成');
        
    } catch (error) {
        console.error('初始化失败:', error);
        showError('应用初始化失败');
    }
}

// 初始化侧边栏
function initializeSidebar() {
    console.log('初始化侧边栏...');
    sidebarNav.innerHTML = '';
    
    if (!siteData.categories || siteData.categories.length === 0) {
        console.error('没有找到分类数据');
        return;
    }
    
    siteData.categories.forEach(category => {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.setAttribute('data-category', category.id);
        navItem.innerHTML = `
            <i class="${category.icon}"></i>
            <span>${category.name}</span>
        `;
        
        navItem.addEventListener('click', () => {
            selectCategory(category.id);
        });
        
        sidebarNav.appendChild(navItem);
    });
    
    // 默认选中第一个分类
    if (siteData.categories.length > 0) {
        selectCategory(siteData.categories[0].id);
    }
    
    console.log('侧边栏初始化完成');
}

// 选择分类
function selectCategory(categoryId) {
    console.log('选择分类:', categoryId);
    
    // 更新导航项状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-category="${categoryId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // 更新当前分类
    currentCategory = categoryId;
    
    // 渲染内容
    renderContent(categoryId);
    
    // 在移动端点击导航项后关闭侧边栏
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

// 初始化事件监听器
function initializeEventListeners() {
    // 侧边栏切换
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // 点击侧边栏外部关闭侧边栏（移动端）
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('sidebar-open');
            }
        }
    });
    
    // 窗口大小改变时调整布局
    window.addEventListener('resize', handleResize);
    
    // 初始化窗口大小处理
    handleResize();
    
    console.log('事件监听器初始化完成');
}

// 切换侧边栏
function toggleSidebar() {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('sidebar-open');
}

// 处理窗口大小改变
function handleResize() {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-open');
    }
}

// 渲染内容
function renderContent(categoryId) {
    console.log('渲染内容，分类ID:', categoryId);
    
    if (!siteData.sites) {
        console.error('没有找到网站数据');
        showError('没有找到网站数据');
        return;
    }
    
    const sites = categoryId === 'all' 
        ? siteData.sites 
        : siteData.sites.filter(site => site.category === categoryId);
    
    console.log('过滤后的网站数量:', sites.length);
    
    const category = siteData.categories.find(cat => cat.id === categoryId);
    const categoryName = category ? category.name : '全部';
    
    contentWrapper.innerHTML = `
        <h1 class="category-title">${categoryName}</h1>
        <div class="sites-grid">
            ${sites.map(site => createSiteCard(site)).join('')}
        </div>
    `;
    
    // 添加点击事件到网站卡片
    document.querySelectorAll('.site-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const url = card.getAttribute('data-url');
            if (url) {
                console.log('点击网站卡片，跳转到:', url);
                window.open(url, '_blank');
            }
        });
    });
    
    console.log('内容渲染完成');
}

// 创建网站卡片
function createSiteCard(site) {
    // 判断是否为自定义图标文件
    const isCustomIcon = site.icon && (site.icon.includes('.') || site.icon.startsWith('icon/'));
    
    let iconElement;
    if (isCustomIcon) {
        // 自定义图标文件
        iconElement = `<img src="${site.icon}" alt="${site.name}" onerror="this.style.display='none'">`;
    } else {
        // Font Awesome 图标
        iconElement = `<i class="${site.icon || 'fas fa-globe'}"></i>`;
    }
    
    return `
        <div class="site-card" data-site-id="${site.id}" data-url="${site.url}">
            <div class="site-header">
                <div class="site-icon">
                    ${iconElement}
                </div>
                <div class="site-title">${site.name}</div>
            </div>
            <div class="site-description">${site.description}</div>
        </div>
    `;
}

// 显示错误信息
function showError(message) {
    contentWrapper.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-triangle"></i>
            <span style="margin-left: 10px;">${message}</span>
        </div>
    `;
}

// 显示加载状态
function showLoading() {
    contentWrapper.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span style="margin-left: 10px;">加载中...</span>
        </div>
    `;
} 