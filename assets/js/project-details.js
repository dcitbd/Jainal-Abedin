/* =====================================================
   PROJECT DETAILS JAVASCRIPT (FINAL FIXED + LIKES & COMMENTS)
   Jainal Abedin Portfolio
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ================= LOADER (FIXED) ================= */
    const loader = document.getElementById("jdLoader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 300);
    }

    /* ================= THEME ================= */
    const themeButton = document.getElementById("jdThemeButton");
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
                themeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
            } else {
                localStorage.setItem("theme", "light");
                themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
            }
        });
    }

    /* ================= MOBILE MENU ================= */
    const mobileButton = document.getElementById("jdMobileButton");
    const mobileNavigation = document.getElementById("jdMobileNavigation");

    if (mobileButton && mobileNavigation) {
        mobileButton.addEventListener("click", () => {
            mobileNavigation.classList.toggle("show");
        });
    }

    /* ================= GET ID ================= */
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("id");

    /* ================= GET PROJECT (ROBUST FINDER) ================= */
    const projects = JSON.parse(localStorage.getItem("portfolioProjects")) || [];

    let project = null;

    if (projectId !== null && projectId !== "") {
        // ১. প্রথমে ইউনিক ID দিয়ে খোঁজার চেষ্টা
        project = projects.find(item => String(item.id) === String(projectId));

        // ২. আইডি দিয়ে না পেলে ইনডেক্স (Index) হিসেবে খোঁজা
        if (!project) {
            const index = Number(projectId);
            if (!isNaN(index) && projects[index]) {
                project = projects[index];
            }
        }
    }

    // যদি ইউজার সরাসরি ID বা Index ছাড়া পেজে আসে, তবে লেটেস্ট প্রজেক্ট বা প্রথম প্রজেক্ট দেখানোর ফলব্যাক
    if (!project && projects.length > 0) {
        project = projects[0];
    }

    /* ================= PROJECT NOT FOUND ================= */
    if (!project) {
        const contentSection = document.querySelector(".jd-content-section");
        if (contentSection) {
            contentSection.innerHTML = `
                <div class="jd-container">
                    <div class="jd-card" style="text-align:center;">
                        <h2><i class="fa-solid fa-circle-exclamation"></i></h2>
                        <h2>Project Not Found</h2>
                        <p>This project does not exist or has been removed.</p>
                        <a href="projects.html" class="jd-link-button">Back To Projects</a>
                    </div>
                </div>
            `;
        }
        return;
    }

    /* ================= TEXT SET ================= */
    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value || "-";
        }
    }

    setText("projectTitle", project.title);
    setText("projectShortDescription", project.shortDescription);
    setText("projectDescription", project.description || project.fullDescription);
    setText("projectCategory", project.category);
    setText("projectType", project.category);
    setText("infoCategory", project.category);
    setText("infoStatus", project.status);
    setText("projectDate", project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Recently Published");

    /* ================= IMAGE ================= */
    const image = document.getElementById("projectImage");
    const placeholder = document.getElementById("imagePlaceholder");

    if (project.image && image) {
        image.src = project.image;
        image.style.display = "block";
        if (placeholder) {
            placeholder.style.display = "none";
        }
    }

    /* ================= TECHNOLOGY (ROBUST PARSER) ================= */
    const techBox = document.getElementById("technologyList");

    if (techBox) {
        techBox.innerHTML = "";
        let rawTech = project.technologies || project.tech || [];
        let techArray = [];

        if (Array.isArray(rawTech)) {
            techArray = rawTech;
        } else if (typeof rawTech === "string") {
            techArray = rawTech.split(",");
        }

        if (techArray.length > 0) {
            techArray.forEach(item => {
                let cleanItem = String(item).trim();
                if (cleanItem !== "") {
                    techBox.innerHTML += `<span>${cleanItem}</span>`;
                }
            });
        }

        if (techBox.innerHTML.trim() === "") {
            techBox.innerHTML = `<span style="color:var(--jd-muted);">No technologies specified</span>`;
        }
    }

    /* ================= FEATURES ================= */
    const featureBox = document.getElementById("featureList");

    if (featureBox) {
        featureBox.innerHTML = "";
        let features = project.features || [];

        if (typeof features === "string") {
            features = features.split("\n");
        }

        if (Array.isArray(features)) {
            features.forEach(item => {
                if (item && String(item).trim()) {
                    featureBox.innerHTML += `<li>${String(item).trim()}</li>`;
                }
            });
        }
    }

    /* ================= LINKS ================= */
    const live = document.getElementById("liveProjectLink");
    const github = document.getElementById("githubProjectLink");

    if (live) {
        if (project.liveUrl || project.projectUrl) {
            live.href = project.liveUrl || project.projectUrl;
            live.style.display = "flex";
        } else {
            live.style.display = "none";
        }
    }

    if (github) {
        if (project.githubUrl) {
            github.href = project.githubUrl;
            github.style.display = "flex";
        } else {
            github.style.display = "none";
        }
    }

    /* ================= LIKES & COMMENTS SYSTEM ================= */
    const likeBtn = document.getElementById("jdLikeBtn");
    const likeCountSpan = document.getElementById("jdLikeCount");
    const commentForm = document.getElementById("jdCommentForm");
    const commentList = document.getElementById("jdCommentList");

    const identifier = project.id || projectId || "default_project";
    const likeStorageKey = `project_likes_${identifier}`;
    const userLikedKey = `project_user_liked_${identifier}`;
    const commentStorageKey = `project_comments_${identifier}`;

    let currentLikes = parseInt(localStorage.getItem(likeStorageKey)) || 10;
    let isLiked = localStorage.getItem(userLikedKey) === "true";

    function updateLikeUI() {
        if (likeCountSpan) {
            likeCountSpan.textContent = `${currentLikes} Likes`;
        }
        if (likeBtn) {
            if (isLiked) {
                likeBtn.classList.add("liked");
                likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i><span>Liked</span>`;
            } else {
                likeBtn.classList.remove("liked");
                likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i><span>Like Project</span>`;
            }
        }
    }
    updateLikeUI();

    if (likeBtn) {
        likeBtn.addEventListener("click", () => {
            if (!isLiked) {
                currentLikes++;
                isLiked = true;
            } else {
                currentLikes--;
                isLiked = false;
            }
            localStorage.setItem(likeStorageKey, currentLikes);
            localStorage.setItem(userLikedKey, isLiked);
            updateLikeUI();
        });
    }

    function loadComments() {
        if (!commentList) return;
        const savedComments = JSON.parse(localStorage.getItem(commentStorageKey)) || [];
        
        commentList.innerHTML = "";
        if (savedComments.length === 0) {
            commentList.innerHTML = `<p style="color:var(--jd-muted); font-style:italic;">No comments yet. Be the first one to comment!</p>`;
            return;
        }

        savedComments.forEach(cmt => {
            commentList.innerHTML += `
                <div class="jd-comment-item">
                    <div class="jd-comment-header">
                        <strong><i class="fa-solid fa-user-circle"></i> ${escapeHtml(cmt.name)}</strong>
                        <span>${cmt.date}</span>
                    </div>
                    <p>${escapeHtml(cmt.text)}</p>
                </div>
            `;
        });
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    loadComments();

    if (commentForm) {
        commentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("commentName");
            const textInput = document.getElementById("commentText");

            const name = nameInput.value.trim();
            const text = textInput.value.trim();

            if (!name || !text) return;

            const newComment = {
                name: name,
                text: text,
                date: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
            };

            const savedComments = JSON.parse(localStorage.getItem(commentStorageKey)) || [];
            savedComments.unshift(newComment);
            localStorage.setItem(commentStorageKey, JSON.stringify(savedComments));

            nameInput.value = "";
            textInput.value = "";
            loadComments();
        });
    }

});
