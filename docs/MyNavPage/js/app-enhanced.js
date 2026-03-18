class NavigationApp {
    constructor() {
        this.state = {
            currentCategory: "all",
            searchQuery: "",
            matchMode: "all",
            filteredSites: []
        };

        this.elements = {};
        this.searchDebounceTimer = null;
        this.init();
    }

    async init() {
        try {
            this.cacheElements();
            this.initEventListeners();
            await this.initSidebar();
        } catch (error) {
            console.error("初始化失败:", error);
            this.showError("应用初始化失败，请刷新页面重试。");
        }
    }

    cacheElements() {
        this.elements = {
            sidebar: document.getElementById("sidebar"),
            sidebarToggle: document.getElementById("sidebarToggle"),
            sidebarNav: document.querySelector(".sidebar-nav"),
            mainContent: document.getElementById("mainContent"),
            contentWrapper: document.querySelector(".content-wrapper"),
            headerSearchBox: document.getElementById("headerSearchBox"),
            headerSearchClear: document.getElementById("headerSearchClear"),
            scrollTopBtn: document.getElementById("scrollTopBtn"),
            searchFab: document.getElementById("searchFab"),
            searchOverlay: document.getElementById("searchOverlay"),
            searchOverlayBackdrop: document.getElementById("searchOverlayBackdrop")
        };

        const required = ["sidebar", "sidebarNav", "mainContent", "contentWrapper"];
        required.forEach((key) => {
            if (!this.elements[key]) {
                throw new Error(`必要的 DOM 元素未找到: ${key}`);
            }
        });
    }

    initEventListeners() {
        this.elements.sidebarToggle?.addEventListener("click", () => this.toggleSidebar());

        document.addEventListener("click", (event) => {
            if (window.innerWidth > 768) {
                return;
            }

            const insideSidebar = this.elements.sidebar.contains(event.target);
            const clickedToggle = this.elements.sidebarToggle?.contains(event.target);
            if (!insideSidebar && !clickedToggle) {
                this.closeSidebar();
            }
        });

        this.elements.headerSearchBox?.addEventListener("input", (event) => {
            this.handleHeaderSearch(event.target.value);
        });

        this.elements.headerSearchBox?.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.closeSearchOverlay();
            }
        });

        this.elements.headerSearchBox?.addEventListener("focus", () => {
            this.elements.headerSearchBox.parentElement?.classList.add("focused");
        });

        this.elements.headerSearchBox?.addEventListener("blur", () => {
            this.elements.headerSearchBox.parentElement?.classList.remove("focused");
        });

        this.elements.headerSearchClear?.addEventListener("click", () => {
            this.clearHeaderSearch();
        });

        this.elements.searchFab?.addEventListener("click", () => {
            this.openSearchOverlay();
        });

        this.elements.searchOverlayBackdrop?.addEventListener("click", () => {
            this.closeSearchOverlay();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });

        window.addEventListener("scroll", () => this.handleWindowScroll(), { passive: true });
        this.elements.scrollTopBtn?.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        document.addEventListener("keydown", (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                this.openSearchOverlay();
            }

            if (event.key === "Escape") {
                if (this.isSearchOverlayOpen()) {
                    this.closeSearchOverlay();
                } else if (this.state.searchQuery) {
                    this.clearHeaderSearch();
                } else if (window.innerWidth <= 768) {
                    this.closeSidebar();
                }
            }
        });

        this.handleWindowScroll();
    }

    async initSidebar() {
        if (!siteDataConfig?.categories?.length) {
            throw new Error("未找到分类数据");
        }

        const fragment = document.createDocumentFragment();
        this.elements.sidebarNav.innerHTML = "";

        siteDataConfig.categories.forEach((category) => {
            fragment.appendChild(this.createNavItem(category));
        });

        this.elements.sidebarNav.appendChild(fragment);
        await this.selectCategory("all");
    }

    createNavItem(category) {
        const navItem = document.createElement("button");
        navItem.type = "button";
        navItem.className = "nav-item";
        navItem.setAttribute("data-category", category.id);
        navItem.innerHTML = `
            <i class="${category.icon}"></i>
            <span>${this.escapeHTML(category.name)}</span>
        `;

        navItem.addEventListener("click", async () => {
            await this.selectCategory(category.id);
        });

        return navItem;
    }

    async selectCategory(categoryId) {
        this.state.currentCategory = categoryId;
        this.state.searchQuery = "";
        this.state.matchMode = "all";

        if (this.elements.headerSearchBox) {
            this.elements.headerSearchBox.value = "";
        }

        this.elements.headerSearchClear?.classList.remove("visible");

        document.querySelectorAll(".nav-item").forEach((item) => {
            item.classList.toggle("active", item.getAttribute("data-category") === categoryId);
        });

        await this.renderContent();
        this.scrollToContentTop();

        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
    }

    async renderContent() {
        try {
            this.showLoading();

            const category = this.getCategoryById(this.state.currentCategory);
            const allSites = this.getSitesByCategory(this.state.currentCategory);
            const sites = this.applySearchFilter(allSites);

            this.state.filteredSites = sites;
            this.renderContentHTML(category, sites, allSites.length);
        } catch (error) {
            console.error("渲染内容失败:", error);
            this.showError("内容加载失败。");
        }
    }

    renderContentHTML(category, sites, totalSites) {
        const contentHTML = `
            ${this.createSectionHeader(category, sites.length, totalSites)}
            ${this.state.searchQuery ? this.createSearchToolbar(sites.length, totalSites) : ""}
            ${sites.length ? `<div class="sites-grid">${sites.map((site) => this.createSiteCard(site)).join("")}</div>` : this.createEmptyState()}
        `;

        this.elements.contentWrapper.classList.remove("loaded");
        this.elements.contentWrapper.innerHTML = contentHTML;
        this.initFilterToolbarEvents();
        this.initSiteCardEvents();

        requestAnimationFrame(() => {
            this.elements.contentWrapper.classList.add("loaded");
        });
    }

    createSectionHeader(category, visibleCount, totalCount) {
        const categoryName = this.escapeHTML(category?.name || "全部");
        const summaryPrimary = this.state.searchQuery
            ? `已筛选 ${visibleCount} / ${totalCount}`
            : `共收录 ${totalCount} 个站点`;
        const summarySecondary = this.state.searchQuery
            ? `匹配范围：${this.getMatchModeLabel()}`
            : "点击卡片任意位置即可打开";

        return `
            <section class="section-head">
                <div class="section-head-main">
                    <div class="section-head-path">导航 / ${categoryName}</div>
                    <div class="section-head-row">
                        <h1 class="section-head-title">${categoryName}</h1>
                        <div class="section-head-inline-meta">
                            <span class="section-head-inline-item section-head-inline-item-strong">${summaryPrimary}</span>
                            <span class="section-head-inline-divider"></span>
                            <span class="section-head-inline-item">${summarySecondary}</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    createSearchToolbar(visibleCount, totalCount) {
        return `
            <section class="search-toolbar">
                <div class="search-toolbar-summary">
                    <span>“${this.escapeHTML(this.state.searchQuery)}”</span>
                    <small>${visibleCount} / ${totalCount}</small>
                </div>
                <div class="segmented-control">
                    ${this.createChip("all", "全部字段", this.state.matchMode === "all")}
                    ${this.createChip("name", "仅名称", this.state.matchMode === "name")}
                    ${this.createChip("description", "仅描述", this.state.matchMode === "description")}
                </div>
            </section>
        `;
    }

    createChip(value, label, active) {
        return `
            <button
                type="button"
                class="filter-chip ${active ? "active" : ""}"
                data-match-mode="${value}"
            >
                ${this.escapeHTML(label)}
            </button>
        `;
    }

    createSiteCard(site) {
        const iconElement = this.createSiteIcon(site);
        const host = this.getHostLabel(site.url);

        return `
            <article
                class="site-card"
                data-url="${this.escapeHTML(site.url || "#")}"
                role="link"
                tabindex="0"
                aria-label="打开 ${this.escapeHTML(site.name || "")}"
            >
                <div class="site-header">
                    <div class="site-icon">${iconElement}</div>
                    <div class="site-title-wrap">
                        <div class="site-title">${this.highlightSearchTerms(site.name || "")}</div>
                        <div class="site-host">${this.escapeHTML(host)}</div>
                    </div>
                </div>
                <p class="site-description">${this.highlightSearchTerms(site.description || "")}</p>
            </article>
        `;
    }

    createSiteIcon(site) {
        const icon = site.icon || "fas fa-globe";
        const isImage = icon.includes(".") || icon.startsWith("icon/");

        if (isImage) {
            return `<img src="${this.escapeHTML(icon)}" alt="${this.escapeHTML(site.name || "")}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><i class="fas fa-globe" style="display:none;"></i>`;
        }

        return `<i class="${icon}"></i>`;
    }

    initFilterToolbarEvents() {
        this.elements.contentWrapper.querySelectorAll("[data-match-mode]").forEach((button) => {
            button.addEventListener("click", async () => {
                const nextMode = button.getAttribute("data-match-mode");
                if (!nextMode || nextMode === this.state.matchMode) {
                    return;
                }

                this.state.matchMode = nextMode;
                await this.renderContent();
            });
        });
    }

    initSiteCardEvents() {
        document.querySelectorAll(".site-card").forEach((card) => {
            const openSite = () => {
                const url = card.getAttribute("data-url");
                if (url) {
                    window.open(url, "_blank", "noopener,noreferrer");
                }
            };

            card.addEventListener("click", openSite);
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openSite();
                }
            });
        });
    }

    handleHeaderSearch(query) {
        this.state.searchQuery = query.trim();
        if (!this.state.searchQuery) {
            this.state.matchMode = "all";
        }

        this.elements.headerSearchClear?.classList.toggle("visible", Boolean(this.state.searchQuery));

        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = window.setTimeout(() => this.renderContent(), 100);
    }

    async clearHeaderSearch() {
        clearTimeout(this.searchDebounceTimer);
        this.state.searchQuery = "";
        this.state.matchMode = "all";

        if (this.elements.headerSearchBox) {
            this.elements.headerSearchBox.value = "";
        }

        this.elements.headerSearchClear?.classList.remove("visible");
        await this.renderContent();
    }

    focusSearch() {
        this.elements.headerSearchBox?.focus();
        this.elements.headerSearchBox?.select();
    }

    openSearchOverlay() {
        this.elements.searchOverlay?.classList.add("active");
        this.elements.searchOverlayBackdrop?.classList.add("active");
        document.body.classList.add("search-open");
        requestAnimationFrame(() => this.focusSearch());
    }

    closeSearchOverlay() {
        this.elements.headerSearchBox?.blur();
        this.elements.searchOverlay?.classList.remove("active");
        this.elements.searchOverlayBackdrop?.classList.remove("active");
        document.body.classList.remove("search-open");
    }

    isSearchOverlayOpen() {
        return this.elements.searchOverlay?.classList.contains("active");
    }

    toggleSidebar() {
        this.elements.sidebar.classList.toggle("active");
        this.elements.mainContent.classList.toggle("sidebar-open");
    }

    closeSidebar() {
        this.elements.sidebar.classList.remove("active");
        this.elements.mainContent.classList.remove("sidebar-open");
    }

    handleWindowScroll() {
        const active = window.scrollY > 280;
        this.elements.scrollTopBtn?.classList.toggle("visible", active);
    }

    scrollToContentTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    getSitesByCategory(categoryId) {
        if (categoryId === "all") {
            return [...siteDataConfig.sites];
        }

        return siteDataConfig.sites.filter((site) => site.category === categoryId);
    }

    getCategoryById(categoryId) {
        return siteDataConfig.categories.find((category) => category.id === categoryId)
            || { id: "all", name: "全部", icon: "fas fa-globe" };
    }

    applySearchFilter(sites) {
        if (!this.state.searchQuery) {
            return sites;
        }

        const terms = this.state.searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

        return sites.filter((site) => {
            const name = (site.name || "").toLowerCase();
            const description = (site.description || "").toLowerCase();
            const fields = this.state.matchMode === "name"
                ? [name]
                : this.state.matchMode === "description"
                    ? [description]
                    : [name, description];

            return terms.every((term) => fields.some((field) => field.includes(term)));
        });
    }

    getMatchModeLabel() {
        if (this.state.matchMode === "name") {
            return "仅名称";
        }

        if (this.state.matchMode === "description") {
            return "仅描述";
        }

        return "全部字段";
    }

    getHostLabel(url) {
        try {
            const parsed = new URL(url);
            return parsed.hostname.replace(/^www\./, "");
        } catch {
            return "外部链接";
        }
    }

    highlightSearchTerms(text) {
        const safeText = this.escapeHTML(text);
        if (!this.state.searchQuery) {
            return safeText;
        }

        return this.state.searchQuery
            .split(/\s+/)
            .filter(Boolean)
            .reduce((result, term) => {
                const regex = new RegExp(`(${this.escapeRegExp(term)})`, "gi");
                return result.replace(regex, "<mark>$1</mark>");
            }, safeText);
    }

    escapeRegExp(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    showLoading() {
        this.elements.contentWrapper.classList.remove("loaded");
        this.elements.contentWrapper.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <span>加载中...</span>
            </div>
        `;
    }

    showError(message) {
        this.elements.contentWrapper.classList.remove("loaded");
        this.elements.contentWrapper.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>出错了</h3>
                <p>${this.escapeHTML(message)}</p>
                <button onclick="location.reload()" class="retry-button" type="button">
                    <i class="fas fa-rotate-right"></i>
                    重试
                </button>
            </div>
        `;
    }

    createEmptyState() {
        return `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>没有找到匹配的网站</p>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.navigationApp = new NavigationApp();
});

if (typeof module !== "undefined" && module.exports) {
    module.exports = NavigationApp;
}
