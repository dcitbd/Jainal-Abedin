/* =====================================================
   PUBLIC TEMPLATES PAGE JAVASCRIPT
   Jainal Abedin Portfolio
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "jainalTemplates";
    
    // GitHub রিমোট ফাইলের কনফিগারেশন (প্রয়োজনে আপনার ইউজারনেম ও রিপো নাম দিয়ে আপডেট করুন)
    const GITHUB_RAW_URL = "https://raw.githubusercontent.com/jainalsagor/portfolio/main/templates-data.json";

    /* ================= LOADER ================= */
    const loader = document.getElementById("jaCompaniesLoader");
    window.addEventListener("load", function () {
        setTimeout(function () {
            loader?.classList.add("hide");
        }, 400);
    });

    /* ================= MOBILE MENU ================= */
    const menuButton = document.getElementById("jaCompaniesMenu");
    const mobileNav = document.getElementById("jaCompaniesMobileNav");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("show");
        });
    }

    /* ================= THEME TOGGLE ================= */
    const themeButton = document.getElementById("jaCompaniesTheme");

    function updateThemeIcon() {
        const icon = themeButton?.querySelector("i");
        if (!icon) return;
        if (document.body.classList.contains("light-theme")) {
            icon.className = "fa-solid fa-sun";
        } else {
            icon.className = "fa-solid fa-moon";
        }
    }

    const savedTheme = localStorage.getItem("jaTheme");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }
    updateThemeIcon();

    themeButton?.addEventListener("click", function () {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");
        localStorage.setItem("jaTheme", isLight ? "light" : "dark");
        updateThemeIcon();
    });

    /* ================= DOM ELEMENTS ================= */
    const templatesGrid = document.getElementById("templatesGrid");
    const templatesEmpty = document.getElementById("templatesEmpty");
    const templateNoResult = document.getElementById("templateNoResult");
    const templateSearch = document.getElementById("templateSearch");
    const templateCategory = document.getElementById("templateCategory");
    const templateCount = document.getElementById("templateCount");

    /* ================= HELPERS ================= */
    function escapeHTML(value) {
        if (value === null || value === undefined) return "";
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatDate(date) {
        if (!date) return "";
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return "";
        return parsed.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }

    /* ================= TEMPLATE STORAGE & FETCH ================= */
    async function getTemplates() {
        // ১. সরাসরি রিমোট গিটহাব বা ক্লাউড থেকে লোড করার চেষ্টা
        try {
            const response = await fetch(GITHUB_RAW_URL, { cache: "no-store" });
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    return data;
                }
            }
        } catch (error) {
            console.warn("GitHub live fetch fallback to local cache:", error);
        }

        // ২. রিমোট ফেচ ব্যর্থ হলে লোকাল ক্যাশ থেকে ডাটা রিড করা
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Template storage error:", error);
            return [];
        }
    }

    /* ================= CREATE CARD ================= */
    function createTemplateCard(template) {
        const image = template.image || template.thumbnail || "../images/template-placeholder.jpg";
        const name = template.title || template.name || "Untitled Template";
        const category = template.category || "General";
        const description = template.description || template.shortDescription || "Professional website template.";
        const tags = Array.isArray(template.tags) ? template.tags : [];
        const url = template.url || template.liveUrl || "#";
        const createdAt = formatDate(template.createdAt || template.date);

        const tagsHTML = tags
            .slice(0, 5)
            .map(tag => `<span class="template-tag">${escapeHTML(tag)}</span>`)
            .join("");

        const card = document.createElement("article");
        card.className = "template-card";
        card.dataset.name = name.toLowerCase();
        card.dataset.category = category.toLowerCase();

        card.innerHTML = `
            <div class="template-card-image">
                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                    onerror="this.src='../images/template-placeholder.jpg'">
                <span class="template-category">
                    ${escapeHTML(category)}
                </span>
            </div>

            <div class="template-card-body">
                <h3>${escapeHTML(name)}</h3>
                <p>${escapeHTML(description)}</p>
                ${tagsHTML ? `<div class="template-tags">${tagsHTML}</div>` : ""}

                <div class="template-card-footer">
                    <span class="template-card-date">
                        ${createdAt ? `Added ${createdAt}` : "Portfolio Template"}
                    </span>

                    <a href="${escapeHTML(url)}"
                       class="template-view-btn"
                       target="_blank"
                       rel="noopener">
                        View Template
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            </div>
        `;
        return card;
    }

    /* ================= CATEGORY BUILDER ================= */
    function buildCategories(templates) {
        if (!templateCategory) return;
        const currentSelection = templateCategory.value;
        const categories = [...new Set(templates.map(t => t.category).filter(Boolean))].sort();

        templateCategory.innerHTML = `<option value="all">All Categories</option>`;

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.toLowerCase();
            option.textContent = category;
            templateCategory.appendChild(option);
        });

        if (categories.map(c => c.toLowerCase()).includes(currentSelection)) {
            templateCategory.value = currentSelection;
        }
    }

    /* ================= RENDER TEMPLATES ================= */
    async function renderTemplates() {
        if (!templatesGrid) return;

        const allTemplates = await getTemplates();
        
        // শুধু পাবলিশড স্ট্যাটাসগুলো ফিল্টার করা
        const templates = allTemplates.filter(t => String(t.status || 'published').toLowerCase() !== 'draft');

        buildCategories(templates);

        templatesGrid.querySelectorAll(".template-card").forEach(card => card.remove());

        if (!templates.length) {
            templatesEmpty?.classList.add("show");
            templateNoResult?.classList.remove("show");
            if (templateCount) templateCount.textContent = "0";
            return;
        }

        templatesEmpty?.classList.remove("show");

        const search = templateSearch ? templateSearch.value.trim().toLowerCase() : "";
        const category = templateCategory ? templateCategory.value : "all";

        const filtered = templates.filter(template => {
            const name = (template.title || template.name || "").toLowerCase();
            const description = (template.description || template.shortDescription || "").toLowerCase();
            const templateCategoryName = (template.category || "").toLowerCase();
            const tags = Array.isArray(template.tags) ? template.tags.join(" ").toLowerCase() : "";

            const matchesSearch =
                !search ||
                name.includes(search) ||
                description.includes(search) ||
                templateCategoryName.includes(search) ||
                tags.includes(search);

            const matchesCategory =
                category === "all" ||
                templateCategoryName === category;

            return matchesSearch && matchesCategory;
        });

        if (templateCount) {
            templateCount.textContent = filtered.length;
        }

        if (!filtered.length) {
            templateNoResult?.classList.add("show");
            return;
        }

        templateNoResult?.classList.remove("show");

        filtered
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date || 0);
                const dateB = new Date(b.createdAt || b.date || 0);
                return dateB - dateA;
            })
            .forEach(template => {
                templatesGrid.insertBefore(createTemplateCard(template), templateNoResult);
            });
    }

    /* ================= EVENT LISTENERS ================= */
    templateSearch?.addEventListener("input", renderTemplates);
    templateCategory?.addEventListener("change", renderTemplates);

    window.addEventListener("storage", function (event) {
        if (event.key === STORAGE_KEY) {
            renderTemplates();
        }
    });

    // ইনিশিয়াল কল
    renderTemplates();
});
