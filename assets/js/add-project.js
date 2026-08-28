/* =====================================================
   MODERN ADD PROJECT BUILDER (FIXED & OPTIMIZED)
===================================================== */

const addProjectForm = document.getElementById("addProjectForm");
const projectImage = document.getElementById("projectImage");
const imageUploadArea = document.getElementById("imageUploadArea");
const imagePreview = document.getElementById("imagePreview");
const previewCardImage = document.getElementById("previewCardImage");
const previewImagePlaceholder = document.getElementById("previewImagePlaceholder");
const previewTitle = document.getElementById("previewTitle");
const previewDescription = document.getElementById("previewDescription");
const previewCategory = document.getElementById("previewCategory");
const technologiesInput = document.getElementById("technologies");
const technologyTags = document.getElementById("technologyTags");
const shortDescription = document.getElementById("shortDescription");
const shortDescriptionCount = document.getElementById("shortDescriptionCount");
const adminToast = document.getElementById("adminToast");

const projectTitle = document.getElementById("projectTitle");
if (projectTitle) {
    projectTitle.addEventListener("input", function () {
        previewTitle.textContent = this.value.trim() || "Your Project Title";
    });
}

if (shortDescription) {
    shortDescription.addEventListener("input", function () {
        previewDescription.textContent = this.value.trim() || "Your project short description will appear here.";
        if (shortDescriptionCount) {
            shortDescriptionCount.textContent = this.value.length;
        }
    });
}

const projectCategory = document.getElementById("projectCategory");
if (projectCategory) {
    projectCategory.addEventListener("change", function () {
        previewCategory.textContent = this.value || "CATEGORY";
    });
}

let technologies = [];

if (technologiesInput) {
    technologiesInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const value = this.value.trim();
            if (value !== "" && !technologies.includes(value)) {
                technologies.push(value);
                this.value = "";
                renderTechnologyTags();
            }
        }
    });
}

function renderTechnologyTags() {
    if (!technologyTags) return;
    technologyTags.innerHTML = "";
    technologies.forEach(function (technology, index) {
        const tag = document.createElement("span");
        tag.className = "technology-tag";
        tag.innerHTML = `
            ${technology}
            <button type="button" data-index="${index}" aria-label="Remove technology">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        technologyTags.appendChild(tag);
    });
    updatePreviewTechStack();
}

function updatePreviewTechStack() {
    const previewTechStack = document.getElementById("previewTechStack");
    if (!previewTechStack) return;
    previewTechStack.innerHTML = "";
    const previewItems = technologies.length ? technologies.slice(0, 4) : ["HTML", "CSS", "JS"];
    previewItems.forEach(function (technology) {
        const span = document.createElement("span");
        span.textContent = technology;
        previewTechStack.appendChild(span);
    });
}

if (technologyTags) {
    technologyTags.addEventListener("click", function (event) {
        const button = event.target.closest("button");
        if (!button) return;
        const index = Number(button.dataset.index);
        technologies.splice(index, 1);
        renderTechnologyTags();
    });
}

if (imageUploadArea && projectImage) {
    imageUploadArea.addEventListener("click", function () {
        projectImage.click();
    });

    projectImage.addEventListener("change", function () {
        handleImages(Array.from(this.files));
    });
}

function handleImages(files) {
    imagePreview.innerHTML = "";
    if (!files.length) return;

    files.forEach(function (file, index) {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result;

            if (index === 0 && previewCardImage) {
                previewCardImage.src = imageData;
                previewCardImage.style.display = "block";
                if (previewImagePlaceholder) {
                    previewImagePlaceholder.style.display = "none";
                }
            }

            const item = document.createElement("div");
            item.className = "gallery-item";
            item.innerHTML = `
                <img src="${imageData}" alt="Project Image ${index + 1}">
                <button type="button" class="gallery-remove"><i class="fa-solid fa-xmark"></i></button>
            `;
            item.querySelector(".gallery-remove").addEventListener("click", function (e) {
                e.stopPropagation();
                item.remove();
            });
            imagePreview.appendChild(item);
        };
        reader.readAsDataURL(file);
    });
}

function showToast(message, type = "success") {
    if (!adminToast) return;
    const icon = adminToast.querySelector("i");
    const text = adminToast.querySelector("span");
    text.textContent = message;

    if (type === "error") {
        icon.className = "fa-solid fa-circle-exclamation";
        icon.style.color = "#f87171";
    } else {
        icon.className = "fa-solid fa-circle-check";
        icon.style.color = "#34d399";
    }

    adminToast.classList.add("show");
    setTimeout(function () {
        adminToast.classList.remove("show");
    }, 3500);
}

// ইমেজ সাইজ কম্প্রেস করার ফাংশন (লোকালস্টোরেজ ফুল হওয়া রোধ করতে)
function compressImage(base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = base64Str;
        img.onload = function () {
            let canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
    });
}

if (addProjectForm) {
    addProjectForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = projectTitle.value.trim();
        const category = projectCategory.value;
        const status = document.getElementById("projectStatus").value;
        const shortText = shortDescription.value.trim();
        const description = document.getElementById("projectDescription").value.trim();
        const featuresText = document.getElementById("features").value.trim();
        const liveUrl = document.getElementById("liveUrl").value.trim();
        const githubUrl = document.getElementById("githubUrl").value.trim();
        const allowComments = document.getElementById("allowComments").checked;
        const showPortfolio = document.getElementById("showPortfolio").checked;

        if (!title || !category || !shortText || !description) {
            showToast("Please complete all required fields.", "error");
            return;
        }

        let compressedImage = "";
        if (projectImage.files[0]) {
            let base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(projectImage.files[0]);
            });
            compressedImage = await compressImage(base64Image);
        }

        const projects = JSON.parse(localStorage.getItem("portfolioProjects")) || [];

        const newProject = {
            id: Date.now(),
            title: title,
            category: category,
            status: status,
            shortDescription: shortText,
            description: description,
            technologies: technologies,
            tech: technologies,
            features: featuresText.split("\n").map(item => item.trim()).filter(item => item),
            liveUrl: liveUrl,
            githubUrl: githubUrl,
            image: compressedImage,
            allowComments: allowComments,
            showPortfolio: showPortfolio,
            views: 0,
            comments: 0,
            createdAt: new Date().toISOString()
        };

        projects.unshift(newProject);

        try {
            localStorage.setItem("portfolioProjects", JSON.stringify(projects));
            showToast("Project published successfully.");
            
            const submitButton = document.getElementById("saveProjectBtn");
            submitButton.disabled = true;
            submitButton.innerHTML = `<i class="fa-solid fa-check"></i> Published Successfully`;

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1200);

        } catch (error) {
            console.error("Storage limit exceeded:", error);
            showToast("Storage Full! Too many projects stored.", "error");
        }
    });
}