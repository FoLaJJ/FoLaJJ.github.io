// 高性能导航页面应用
class NavigationApp {
    constructor() {
        // 状态管理
        this.state = {
            currentCategory: 'all',
            searchQuery: '',
            isLoading: false
        };
        
        // DOM 元素缓存
        this.elements = {};
        
        // 搜索防抖定时器
        this.searchDebounceTimer = null;
        
        // 虚拟滚动配置
        this.virtualScroll = {
            itemHeight: 200,
            containerHeight: 0,
            visibleItems: 0,
            scrollTop: 0,
            startIndex: 0,
            endIndex: 0
        };
        
        // 初始化应用
        this.init();
    }
    
    // 初始化应用
    async init() {
        try {
            console.log('🚀 初始化导航应用...');
            
            // 缓存DOM元素
            this.cacheElements();
            
            // 初始化主题
            this.initTheme();
            
            // 初始化事件监听器
            this.initEventListeners();
            
            // 初始化侧边栏
            this.initSidebar();
            
            // 渲染默认内容
            await this.renderContent('all');
            
            console.log('✅ 应用初始化完成');
            
        } catch (error) {
            console.error('❌ 初始化失败:', error);
            this.showError('应用初始化失败，请刷新页面重试');
        }
    }
    
    // 缓存DOM元素
    cacheElements() {
        this.elements = {
            sidebarToggle: document.getElementById('sidebarToggle'),
            sidebar: document.getElementById('sidebar'),
            mainContent: document.getElementById('mainContent'),
            sidebarNav: document.querySelector('.sidebar-nav'),
            contentWrapper: document.querySelector('.content-wrapper'),
            headerSearchBox: document.getElementById('headerSearchBox'),
            headerSearchClear: document.getElementById('headerSearchClear')
        };
        
        // 验证必要元素
        const requiredElements = ['sidebarToggle', 'sidebar', 'mainContent', 'sidebarNav', 'contentWrapper'];
        for (const elementName of requiredElements) {
            if (!this.elements[elementName]) {
                throw new Error(`必要的DOM元素未找到: ${elementName}`);
            }
        }
        
        // 初始化搜索框事件
        this.initHeaderSearchEvents();
    }
    
    // 初始化主题（已删除暗黑模式功能）
    initTheme() {
        // 不再需要主题相关功能
    }
    
    // 初始化事件监听器
    initEventListeners() {
        // 侧边栏切换
        this.elements.sidebarToggle?.addEventListener('click', () => this.toggleSidebar());
        
        // 点击侧边栏外部关闭侧边栏（移动端）
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.elements.sidebar.contains(e.target) && 
                    !this.elements.sidebarToggle.contains(e.target)) {
                    this.closeSidebar();
                }
            }
        });
        
        // 窗口大小改变
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.handleResize(), 5);
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K 打开搜索
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
            
            // ESC 关闭侧边栏或清空搜索
            if (e.key === 'Escape') {
                if (this.state.searchQuery) {
                    this.clearSearch();
                } else if (window.innerWidth <= 768) {
                    this.closeSidebar();
                }
            }
        });
        
        // 初始化窗口大小处理
        this.handleResize();
    }
    
    // 切换侧边栏
    toggleSidebar() {
        this.elements.sidebar.classList.toggle('active');
        this.elements.mainContent.classList.toggle('sidebar-open');
    }
    
    // 关闭侧边栏
    closeSidebar() {
        this.elements.sidebar.classList.remove('active');
        this.elements.mainContent.classList.remove('sidebar-open');
    }
    
    // 处理窗口大小改变
    handleResize() {
        if (window.innerWidth > 768) {
            this.elements.sidebar.classList.remove('active');
            this.elements.mainContent.classList.remove('sidebar-open');
        }
        
        // 更新虚拟滚动配置
        this.updateVirtualScrollConfig();
    }
    
    // 初始化侧边栏
    initSidebar() {
        if (!siteDataConfig.categories || siteDataConfig.categories.length === 0) {
            console.error('❌ 没有找到分类数据');
            return;
        }
        
        // 清空侧边栏
        this.elements.sidebarNav.innerHTML = '';
        
        // 创建分类导航项
        const fragment = document.createDocumentFragment();
        
        siteDataConfig.categories.forEach(category => {
            const navItem = this.createNavItem(category);
            fragment.appendChild(navItem);
        });
        
        this.elements.sidebarNav.appendChild(fragment);
        
        // 默认选中第一个分类
        if (siteDataConfig.categories.length > 0) {
            this.selectCategory(siteDataConfig.categories[0].id);
        }
    }
    
    // 创建导航项
    createNavItem(category) {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.setAttribute('data-category', category.id);
        navItem.innerHTML = `
            <i class="${category.icon}"></i>
            <span>${category.name}</span>
        `;
        
        navItem.addEventListener('click', () => {
            this.selectCategory(category.id);
        });
        
        return navItem;
    }
    
    // 选择分类
    async selectCategory(categoryId) {
        console.log('📂 选择分类:', categoryId);
        
        // 切换分类时清空搜索状态
        this.state.searchQuery = '';
        if (this.elements.headerSearchBox) {
            this.elements.headerSearchBox.value = '';
        }
        if (this.elements.headerSearchClear) {
            this.elements.headerSearchClear.classList.remove('visible');
        }
        
        // 更新导航项状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-category="${categoryId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        // 更新当前分类
        this.state.currentCategory = categoryId;
        
        // 渲染内容
        await this.renderContent(categoryId);
        
        // 在移动端点击导航项后关闭侧边栏
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
    }
    
    // 渲染内容
    async renderContent(categoryId) {
        try {
            this.showLoading();
            
            // 获取分类信息
            const category = siteDataConfig.categories.find(cat => cat.id === categoryId);
            const categoryName = category ? category.name : '全部';
            
            // 过滤网站数据
            let sites = categoryId === 'all' 
                ? siteDataConfig.sites 
                : siteDataConfig.sites.filter(site => site.category === categoryId);
            
            // 应用搜索过滤
            if (this.state.searchQuery) {
                sites = this.filterSites(sites, this.state.searchQuery);
            }
            
            this.state.filteredSites = sites;
            
            // 渲染内容
            await this.renderContentHTML(categoryName, sites);
            
        } catch (error) {
            console.error('❌ 渲染内容失败:', error);
            this.showError('内容加载失败');
        }
    }
    
    // 渲染内容HTML
    async renderContentHTML(categoryName, sites) {
        // 创建标题
        const titleHTML = `
            <div class="category-header">
                <h1 class="category-title">
                    <i class="fas fa-${this.getCategoryIcon()}"></i>
                    ${categoryName}
                </h1>
                <p class="category-subtitle">共 ${sites.length} 个网站</p>
            </div>
        `;
        
        // 创建网站网格
        const sitesHTML = sites.length > 0 
            ? `<div class="sites-grid">${sites.map(site => this.createSiteCard(site)).join('')}</div>`
            : '<div class="empty-state"><i class="fas fa-search"></i><p>没有找到匹配的网站</p></div>';
        
        // 更新内容
        this.elements.contentWrapper.innerHTML = titleHTML + sitesHTML;
        
        // 添加网站卡片点击事件
        this.initSiteCardEvents();
        
        // 添加加载完成的动画
        requestAnimationFrame(() => {
            this.elements.contentWrapper.classList.add('loaded');
        });
    }
    
    // 初始化头部搜索框事件
    initHeaderSearchEvents() {
        if (this.elements.headerSearchBox) {
            // 实时搜索输入事件
            this.elements.headerSearchBox.addEventListener('input', (e) => {
                const query = e.target.value;
                this.handleHeaderSearch(query);
            });
            
            // 搜索框焦点事件
            this.elements.headerSearchBox.addEventListener('focus', () => {
                this.elements.headerSearchBox.parentElement.classList.add('focused');
            });
            
            this.elements.headerSearchBox.addEventListener('blur', () => {
                this.elements.headerSearchBox.parentElement.classList.remove('focused');
            });
        }
        
        if (this.elements.headerSearchClear) {
            this.elements.headerSearchClear.addEventListener('click', () => {
                this.clearHeaderSearch();
            });
        }
    }
    
    // 获取分类图标
    getCategoryIcon() {
        const category = siteDataConfig.categories.find(cat => cat.id === this.state.currentCategory);
        if (category && category.icon) {
            // 提取FontAwesome图标名称
            const iconMatch = category.icon.match(/fa-(.+)/);
            return iconMatch ? iconMatch[1] : 'globe';
        }
        return 'globe';
    }
    
    // 处理头部搜索
    async handleHeaderSearch(query) {
        this.state.searchQuery = query.trim();
        
        // 更新清除按钮显示状态
        if (this.elements.headerSearchClear) {
            this.elements.headerSearchClear.classList.toggle('visible', !!this.state.searchQuery);
        }
        
        // 实时搜索，无防抖
        await this.renderContent(this.state.currentCategory);
    }
    
    // 清空头部搜索
    async clearHeaderSearch() {
        this.state.searchQuery = '';
        if (this.elements.headerSearchBox) {
            this.elements.headerSearchBox.value = '';
        }
        if (this.elements.headerSearchClear) {
            this.elements.headerSearchClear.classList.remove('visible');
        }
        
        await this.renderContent(this.state.currentCategory);
    }
    
    // 聚焦搜索框
    focusSearch() {
        if (this.elements.headerSearchBox) {
            this.elements.headerSearchBox.focus();
            this.elements.headerSearchBox.select();
        }
    }
    
    
    // 高性能搜索过滤（仅搜索名称和描述）
    filterSites(sites, query) {
        if (!query) return sites;
        
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        return sites.filter(site => {
            const searchableText = [
                site.name,
                site.description
            ].join(' ').toLowerCase();
            
            return searchTerms.every(term => searchableText.includes(term));
        });
    }
    
    // 创建网站卡片
    createSiteCard(site) {
        // 判断是否为自定义图标文件
        const isCustomIcon = site.icon && (site.icon.includes('.') || site.icon.startsWith('icon/'));
        
        let iconElement;
        if (isCustomIcon) {
            iconElement = `<img src="${site.icon}" alt="${site.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><i class="fas fa-globe" style="display:none;"></i>`;  
        } else {
            iconElement = `<i class="${site.icon || 'fas fa-globe'}"></i>`;
        }
        
        return `
            <div class="site-card" data-site-id="${site.id}" data-url="${site.url}">
                <div class="site-header">
                    <div class="site-icon">
                        ${iconElement}
                    </div>
                    <div class="site-title">${this.highlightSearchTerms(site.name)}</div>
                </div>
                <div class="site-description">${this.highlightSearchTerms(site.description)}</div>
            </div>
        `;
    }
    
    // 高亮搜索关键词
    highlightSearchTerms(text) {
        if (!this.state.searchQuery) return text;
        
        const searchTerms = this.state.searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
        let highlightedText = text;
        
        searchTerms.forEach(term => {
            const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        
        return highlightedText;
    }
    
    // 转义正则表达式特殊字符
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 初始化网站卡片事件
    initSiteCardEvents() {
        document.querySelectorAll('.site-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const url = card.getAttribute('data-url');
                if (url) {
                    // 添加点击动画
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.transform = '';
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }, 150);
                }
            });
            
            // 添加键盘支持
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }
    
    // 显示加载状态
    showLoading() {
        this.state.isLoading = true;
        this.elements.contentWrapper.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <span>加载中...</span>
            </div>
        `;
    }
    
    // 显示错误信息
    showError(message) {
        this.elements.contentWrapper.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>出错了</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-button">
                    <i class="fas fa-redo"></i>
                    重试
                </button>
            </div>
        `;
    }
    
    // 更新虚拟滚动配置
    updateVirtualScrollConfig() {
        const container = this.elements.contentWrapper;
        if (container) {
            this.virtualScroll.containerHeight = container.clientHeight;
            this.virtualScroll.visibleItems = Math.ceil(this.virtualScroll.containerHeight / this.virtualScroll.itemHeight) + 2;
        }
    }
}

// 应用入口点
document.addEventListener('DOMContentLoaded', () => {
    // 创建全局应用实例
    window.navigationApp = new NavigationApp();
});

// 导出应用类（用于模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationApp;
}
