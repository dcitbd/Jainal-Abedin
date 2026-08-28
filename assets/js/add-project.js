/* =====================================================
   MODERN ADD PROJECT BUILDER (ULTIMATE TECH STACK FIX)
   Jainal Abedin Portfolio
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

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
    const projectCategory = document.getElementById("projectCategory");

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

    if (projectCategory) {
        projectCategory.addEventListener("change", function () {
            previewCategory.textContent = this.value || "CATEGORY";
        });
    }

    let technologies = [];

    // টেকনোলজি ইনপুট ফিল্ডে এন্টার প্রেস করলে ট্যাগ হিসেবে যুক্ত হওয়া
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

    // প্রিভিউ সেকশনে সঠিক টেকনোলজি আপডেট করা (ফলব্যাক রিমুভ করা হয়েছে যাতে কাস্টম ট্যাগ নষ্ট না হয়)
    function updatePreviewTechStack() {
        const previewTechStack = document.getElementById("previewTechStack");
        if (!previewTechStack) return;
        previewTechStack.innerHTML = "";
        
        const previewItems = technologies.length > 0 ? technologies.slice(0, 4) : ["Add Technologies"];
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

            const title = projectTitle ? projectTitle.value.trim() : "";
            const category = projectCategory ? projectCategory.value : "";
            const statusElem = document.getElementById("projectStatus");
            const status = statusElem ? statusElem.value : "published";
            const shortText = shortDescription ? shortDescription.value.trim() : "";
            const descElem = document.getElementById("projectDescription");
            const description = descElem ? descElem.value.trim() : "";
            const featElem = document.getElementById("features");
            const featuresText = featElem ? featElem.value.trim() : "";
            const liveElem = document.getElementById("liveUrl");
            const liveUrl = liveElem ? liveElem.value.trim() : "";
            const gitElem = document.getElementById("githubUrl");
            const githubUrl = gitElem ? gitElem.value.trim() : "";
            const commElem = document.getElementById("allowComments");
            const allowComments = commElem ? commElem.checked : true;
            const portElem = document.getElementById("showPortfolio");
            const showPortfolio = portElem ? portElem.checked : true;

            // সুনিশ্চিত এবং সঠিক টেকনোলজি প্রসেসিং (ইউজারের টাইপ করা বা এন্টার দেওয়া ট্যাগগুলো কালেক্ট করা)
            let finalTechnologies = [...technologies];
            
            if (technologiesInput && technologiesInput.value.trim() !== "") {
                const manualTechs = technologiesInput.value.split(",").map(t => t.trim()).filter(t => t);
                manualTechs.forEach(t => {
                    if (!finalTechnologies.includes(t)) {
                        finalTechnologies.push(t);
                    }
                });
            }

            // যদি কোনো ট্যাগ বা ইনপুট না থাকে, তবে একটি বেসিক ফিল্ড নিশ্চিত করা
            if (finalTechnologies.length === 0) {
                finalTechnologies = ["Web Application"];
            }

            if (!title || !category || !shortText || !description) {
                showToast("Please complete all required fields.", "error");
                return;
            }

            let compressedImage = "";
            if (projectImage && projectImage.files[0]) {
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
                technologies: finalTechnologies,
                tech: finalTechnologies,
                features: featuresText ? featuresText.split("\n").map(item => item.trim()).filter(item => item) : [],
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
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = `<i class="fa-solid fa-check"></i> Published Successfully`;
                }

                setTimeout(function () {
                    window.location.href = "dashboard.html";
                }, 1200);

            } catch (error) {
                console.error("Storage limit exceeded:", error);
                showToast("Storage Full! Too many projects stored.", "error");
            }
        });
    }

});
