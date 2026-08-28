/* =====================================================
   DASHBOARD + EDIT PROJECT SYSTEM
===================================================== */


/* =====================================================
   AUTH PROTECTION
===================================================== */

const isLoggedIn =
    localStorage.getItem(
        "adminLoggedIn"
    ) === "true"
    ||
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true";


if (
    !isLoggedIn
    &&
    window.location.pathname.includes(
        "/admin/"
    )
    &&
    !window.location.pathname.includes(
        "login.html"
    )
) {

    window.location.href =
        "login.html";

}


/* =====================================================
   PROJECT STORAGE
===================================================== */

function getProjects() {

    return JSON.parse(

        localStorage.getItem(
            "portfolioProjects"
        )

    ) || [];

}


function saveProjects(
    projects
) {

    localStorage.setItem(

        "portfolioProjects",

        JSON.stringify(
            projects
        )

    );

}


/* =====================================================
   DASHBOARD
===================================================== */

const projectsTableBody =
    document.getElementById(
        "projectsTableBody"
    );


if (
    projectsTableBody
) {

    const projects =
        getProjects();


    const totalProjects =
        document.getElementById(
            "totalProjects"
        );


    const publishedProjects =
        document.getElementById(
            "publishedProjects"
        );


    const totalViews =
        document.getElementById(
            "totalViews"
        );


    if (
        totalProjects
    ) {

        totalProjects.textContent =
            projects.length;

    }


    if (
        publishedProjects
    ) {

        publishedProjects.textContent =

            projects.filter(

                project =>

                    project.status ===
                    "published"

            ).length;

    }


    if (
        totalViews
    ) {

        totalViews.textContent =

            projects.reduce(

                (

                    total,

                    project

                ) =>

                    total +
                    Number(
                        project.views
                    ),

                0

            );

    }


    const emptyProjects =
        document.getElementById(
            "emptyProjects"
        );


    if (
        projects.length === 0
    ) {

        emptyProjects.style.display =
            "flex";

        projectsTableBody.innerHTML =
            "";

    }


    else {

        emptyProjects.style.display =
            "none";


        projectsTableBody.innerHTML =

            projects
                .slice()
                .reverse()
                .slice(
                    0,
                    10
                )
                .map(

                    project => `

                    <tr>

                        <td>

                            <div class="table-project">

                                <div class="table-project-image">

                                    ${
                                        project.image

                                        ?

                                        `<img src="${project.image}">`

                                        :

                                        `<i class="fa-solid fa-image"></i>`

                                    }

                                </div>

                                <div>

                                    <strong>

                                        ${project.title}

                                    </strong>

                                    <span>

                                        ${project.description || "No description"}

                                    </span>

                                </div>

                            </div>

                        </td>


                        <td>

                            <span class="category-badge">

                                ${project.category}

                            </span>

                        </td>


                        <td>

                            <span class="status-badge ${project.status}">

                                ${project.status}

                            </span>

                        </td>


                        <td>

                            <span class="views-count">

                                <i class="fa-solid fa-eye"></i>

                                ${project.views || 0}

                            </span>

                        </td>


                        <td>

                            <div class="table-actions">


                                <button

                                    class="table-action edit"

                                    onclick="editProject('${project.id}')">

                                    <i class="fa-solid fa-pen"></i>

                                </button>


                                <button

                                    class="table-action delete"

                                    onclick="deleteProject('${project.id}')">

                                    <i class="fa-solid fa-trash"></i>

                                </button>


                            </div>

                        </td>

                    </tr>

                    `

                )

                .join(

                    ""

                );

    }

}


/* =====================================================
   EDIT PROJECT
===================================================== */

const editForm =
    document.getElementById(
        "editProjectForm"
    );


if (
    editForm
) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const projectId =
        params.get(
            "id"
        );


    const projects =
        getProjects();


    const project =
        projects.find(

            item =>

                String(
                    item.id
                )
                ===
                String(
                    projectId
                )

        );


    if (
        !project
    ) {

        alert(
            "Project not found."
        );


        window.location.href =
            "dashboard.html";

    }


    else {


        document
            .getElementById(
                "projectTitle"
            )
            .value =
            project.title
            || "";


        document
            .getElementById(
                "projectCategory"
            )
            .value =
            project.category
            || "Web Design";


        document
            .getElementById(
                "projectStatus"
            )
            .value =
            project.status
            || "published";


        document
            .getElementById(
                "projectDescription"
            )
            .value =
            project.description
            || "";


        document
            .getElementById(
                "projectUrl"
            )
            .value =
            project.url
            || "";


        document
            .getElementById(
                "projectGithub"
            )
            .value =
            project.github
            || "";


        document
            .getElementById(
                "featuredProject"
            )
            .checked =
            project.featured
            || false;


        document
            .getElementById(
                "allowComments"
            )
            .checked =
            project.allowComments
            !== false;


        const currentImage =
            document.getElementById(
                "currentImage"
            );


        if (
            project.image
        ) {

            currentImage.innerHTML = `

                <div class="current-image-card">

                    <img src="${project.image}">

                    <span>

                        Current Project Image

                    </span>

                </div>

            `;

        }


        editForm.addEventListener(

            "submit",

            function (
                event
            ) {

                event.preventDefault();


                const updatedProject = {


                    ...project,


                    title:

                        document
                            .getElementById(
                                "projectTitle"
                            )
                            .value
                            .trim(),


                    category:

                        document
                            .getElementById(
                                "projectCategory"
                            )
                            .value,


                    status:

                        document
                            .getElementById(
                                "projectStatus"
                            )
                            .value,


                    description:

                        document
                            .getElementById(
                                "projectDescription"
                            )
                            .value
                            .trim(),


                    url:

                        document
                            .getElementById(
                                "projectUrl"
                            )
                            .value
                            .trim(),


                    github:

                        document
                            .getElementById(
                                "projectGithub"
                            )
                            .value
                            .trim(),


                    featured:

                        document
                            .getElementById(
                                "featuredProject"
                            )
                            .checked,


                    allowComments:

                        document
                            .getElementById(
                                "allowComments"
                            )
                            .checked,


                    updatedAt:

                        new Date()
                            .toISOString()

                };


                const imageInput =
                    document
                        .getElementById(
                            "projectImage"
                        );


                if (

                    imageInput.files
                    &&
                    imageInput.files[0]

                ) {

                    const reader =
                        new FileReader();


                    reader.onload =
                        function () {


                            updatedProject.image =
                                reader.result;


                            updateProject(
                                updatedProject
                            );


                        };


                    reader.readAsDataURL(

                        imageInput.files[0]

                    );

                }


                else {

                    updateProject(

                        updatedProject

                    );

                }


            }

        );


        function updateProject(

            updatedProject

        ) {


            const allProjects =
                getProjects();


            const index =
                allProjects.findIndex(

                    item =>

                        String(
                            item.id
                        )
                        ===
                        String(
                            projectId
                        )

                );


            allProjects[index] =
                updatedProject;


            saveProjects(
                allProjects
            );


            alert(
                "Project updated successfully."
            );


            window.location.href =
                "dashboard.html";


        }


        document
            .getElementById(
                "deleteProjectBtn"
            )
            ?.addEventListener(

                "click",

                function () {


                    const confirmDelete =
                        confirm(

                            "Are you sure you want to delete this project?"

                        );


                    if (
                        !confirmDelete
                    ) {

                        return;

                    }


                    const remainingProjects =

                        projects.filter(

                            item =>

                                String(
                                    item.id
                                )
                                !==
                                String(
                                    projectId
                                )

                        );


                    saveProjects(

                        remainingProjects

                    );


                    alert(

                        "Project deleted successfully."

                    );


                    window.location.href =
                        "dashboard.html";


                }

            );

    }

}


/* =====================================================
   EDIT FUNCTION
===================================================== */

function editProject(

    id

) {

    window.location.href =

        `edit-project.html?id=${id}`;

}


/* =====================================================
   DELETE FUNCTION
===================================================== */

function deleteProject(

    id

) {


    const confirmDelete =
        confirm(

            "Are you sure you want to delete this project?"

        );


    if (
        !confirmDelete
    ) {

        return;

    }


    const projects =
        getProjects();


    const remainingProjects =

        projects.filter(

            project =>

                String(
                    project.id
                )
                !==
                String(
                    id
                )

        );


    saveProjects(

        remainingProjects

    );


    location.reload();

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

const imageInput =
    document.getElementById(
        "projectImage"
    );


if (
    imageInput
) {

    imageInput.addEventListener(

        "change",

        function () {


            const file =
                this.files[0];


            if (
                !file
            ) {

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (
                    event
                ) {


                    document
                        .getElementById(
                            "imagePreview"
                        )
                        .innerHTML = `

                        <div class="preview-image-card">

                            <img src="${event.target.result}">

                            <span>

                                New Image Preview

                            </span>

                        </div>

                    `;


                };


            reader.readAsDataURL(
                file
            );

        }

    );

}
































/* =====================================================
   MODERN ADD PROJECT BUILDER
===================================================== */


/* ================= ELEMENTS ================= */

const addProjectForm =
    document.getElementById(
        "addProjectForm"
    );


const projectImage =
    document.getElementById(
        "projectImage"
    );


const imageUploadArea =
    document.getElementById(
        "imageUploadArea"
    );


const imagePreview =
    document.getElementById(
        "imagePreview"
    );


const previewCardImage =
    document.getElementById(
        "previewCardImage"
    );


const previewImagePlaceholder =
    document.getElementById(
        "previewImagePlaceholder"
    );


const previewTitle =
    document.getElementById(
        "previewTitle"
    );


const previewDescription =
    document.getElementById(
        "previewDescription"
    );


const previewCategory =
    document.getElementById(
        "previewCategory"
    );


const technologiesInput =
    document.getElementById(
        "technologies"
    );


const technologyTags =
    document.getElementById(
        "technologyTags"
    );


const shortDescription =
    document.getElementById(
        "shortDescription"
    );


const shortDescriptionCount =
    document.getElementById(
        "shortDescriptionCount"
    );


const adminToast =
    document.getElementById(
        "adminToast"
    );


/* ================= PREVIEW TITLE ================= */

const projectTitle =
    document.getElementById(
        "projectTitle"
    );


if (projectTitle) {


    projectTitle.addEventListener(

        "input",

        function () {


            previewTitle.textContent =

                this.value.trim() ||

                "Your Project Title";


        }

    );

}


/* ================= PREVIEW DESCRIPTION ================= */

if (shortDescription) {


    shortDescription.addEventListener(

        "input",

        function () {


            previewDescription.textContent =

                this.value.trim() ||

                "Your project short description will appear here.";


            if (shortDescriptionCount) {


                shortDescriptionCount.textContent =

                    this.value.length;


            }


        }

    );

}


/* ================= PREVIEW CATEGORY ================= */

const projectCategory =
    document.getElementById(
        "projectCategory"
    );


if (projectCategory) {


    projectCategory.addEventListener(

        "change",

        function () {


            previewCategory.textContent =

                this.value ||

                "CATEGORY";


        }

    );

}


/* ================= TECHNOLOGY TAGS ================= */

let technologies = [];


if (technologiesInput) {


    technologiesInput.addEventListener(

        "keydown",

        function (event) {


            if (

                event.key ===

                "Enter"

            ) {


                event.preventDefault();


                const value =

                    this.value.trim();


                if (

                    value !== "" &&

                    !technologies.includes(

                        value

                    )

                ) {


                    technologies.push(

                        value

                    );


                    this.value = "";


                    renderTechnologyTags();


                }

            }

        }

    );

}


function renderTechnologyTags() {


    if (!technologyTags) {

        return;

    }


    technologyTags.innerHTML = "";


    technologies.forEach(

        function (

            technology,

            index

        ) {


            const tag =

                document.createElement(

                    "span"

                );


            tag.className =

                "technology-tag";


            tag.innerHTML = `

                ${technology}

                <button

                    type="button"

                    data-index="${index}"

                    aria-label="Remove technology"

                >

                    <i class="fa-solid fa-xmark"></i>

                </button>

            `;


            technologyTags.appendChild(

                tag

            );


        }

    );


    updatePreviewTechStack();

}


function updatePreviewTechStack() {


    const previewTechStack =

        document.getElementById(

            "previewTechStack"

        );


    if (!previewTechStack) {

        return;

    }


    previewTechStack.innerHTML = "";


    const previewItems =

        technologies.length

            ?

            technologies.slice(

                0,

                4

            )

            :

            [

                "HTML",

                "CSS",

                "JS"

            ];


    previewItems.forEach(

        function (

            technology

        ) {


            const span =

                document.createElement(

                    "span"

                );


            span.textContent =

                technology;


            previewTechStack.appendChild(

                span

            );


        }

    );

}


if (technologyTags) {


    technologyTags.addEventListener(

        "click",

        function (event) {


            const button =

                event.target.closest(

                    "button"

                );


            if (!button) {

                return;

            }


            const index =

                Number(

                    button.dataset.index

                );


            technologies.splice(

                index,

                1

            );


            renderTechnologyTags();


        }

    );

}


/* ================= IMAGE UPLOAD ================= */

if (imageUploadArea && projectImage) {

    imageUploadArea.addEventListener(
        "click",
        function () {

            projectImage.click();

        }
    );

    projectImage.addEventListener(
        "change",
        function () {

            handleImages(
                Array.from(this.files)
            );

        }
    );

    [
        "dragenter",
        "dragover"
    ].forEach(function (eventName) {

        imageUploadArea.addEventListener(
            eventName,
            function (event) {

                event.preventDefault();

                imageUploadArea.classList.add(
                    "dragover"
                );

            }
        );

    });

    [
        "dragleave",
        "drop"
    ].forEach(function (eventName) {

        imageUploadArea.addEventListener(
            eventName,
            function (event) {

                event.preventDefault();

                imageUploadArea.classList.remove(
                    "dragover"
                );

            }
        );

    });

    imageUploadArea.addEventListener(
        "drop",
        function (event) {

            const files =
                Array.from(
                    event.dataTransfer.files
                );

            if (files.length) {

                projectImage.files =
                    event.dataTransfer.files;

                handleImages(
                    files
                );

            }

        }
    );

}


/* ================= HANDLE IMAGES ================= */

function handleImages(
    files
) {

    imagePreview.innerHTML = "";

    if (!files.length) {
        return;
    }

    files.forEach(function (
        file,
        index
    ) {

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            return;

        }

        const reader =
            new FileReader();

        reader.onload =
            function (event) {

                const imageData =
                    event.target.result;

                /* First image = Cover Preview */

                if (
                    index === 0 &&
                    previewCardImage
                ) {

                    previewCardImage.src =
                        imageData;

                    previewCardImage.style.display =
                        "block";

                    if (
                        previewImagePlaceholder
                    ) {

                        previewImagePlaceholder.style.display =
                            "none";

                    }

                }

                /* Gallery Item */

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "gallery-item";

                item.innerHTML = `

                    <img
                        src="${imageData}"
                        alt="Project Image ${index + 1}"
                    >

                    <button
                        type="button"
                        class="gallery-remove"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                `;

                item.querySelector(
                    ".gallery-remove"
                ).addEventListener(
                    "click",
                    function (e) {

                        e.stopPropagation();

                        item.remove();

                    }
                );

                imagePreview.appendChild(
                    item
                );

            };

        reader.readAsDataURL(
            file
        );

    });

}


/* ================= TOAST ================= */

function showToast(

    message,

    type = "success"

) {


    if (!adminToast) {

        return;

    }


    const icon =

        adminToast.querySelector(

            "i"

        );


    const text =

        adminToast.querySelector(

            "span"

        );


    text.textContent =

        message;


    if (

        type ===

        "error"

    ) {


        icon.className =

            "fa-solid fa-circle-exclamation";


        icon.style.color =

            "#f87171";

    }


    else {


        icon.className =

            "fa-solid fa-circle-check";


        icon.style.color =

            "#34d399";

    }


    adminToast.classList.add(

        "show"

    );


    setTimeout(

        function () {


            adminToast.classList.remove(

                "show"

            );


        },

        3500

    );

}


/* ================= SAVE PROJECT ================= */

if (addProjectForm) {


    addProjectForm.addEventListener(

        "submit",

        function (event) {


            event.preventDefault();


            const title =

                projectTitle.value.trim();


            const category =

                projectCategory.value;


            const status =

                document.getElementById(

                    "projectStatus"

                ).value;


            const shortText =

                shortDescription.value.trim();


            const description =

                document.getElementById(

                    "projectDescription"

                ).value.trim();


            const featuresText =

                document.getElementById(

                    "features"

                ).value.trim();


            const liveUrl =

                document.getElementById(

                    "liveUrl"

                ).value.trim();


            const githubUrl =

                document.getElementById(

                    "githubUrl"

                ).value.trim();


            const allowComments =

                document.getElementById(

                    "allowComments"

                ).checked;


            const showPortfolio =

                document.getElementById(

                    "showPortfolio"

                ).checked;


            if (

                !title ||

                !category ||

                !shortText ||

                !description

            ) {


                showToast(

                    "Please complete all required fields.",

                    "error"

                );


                return;

            }


            const saveProject =

                function (

                    imageData = ""

                ) {


                    const projects =

                        JSON.parse(

                            localStorage.getItem(

                                "portfolioProjects"

                            )

                        ) || [];


                    const newProject = {


                        id:

                            Date.now(),


                        title:


                            title,


                        category:


                            category,


                        status:


                            status,


                        shortDescription:


                            shortText,


                        description:


                            description,


                        technologies:


                            technologies,


                        features:


                            featuresText

                                .split(

                                    "\n"

                                )

                                .map(

                                    item =>

                                        item.trim()

                                )

                                .filter(

                                    item =>

                                        item

                                ),


                        liveUrl:


                            liveUrl,


                        githubUrl:


                            githubUrl,


                        image:


                            imageData,


                        allowComments:


                            allowComments,


                        showPortfolio:


                            showPortfolio,


                        views:


                            0,


                        comments:


                            0,


                        createdAt:


                            new Date()

                                .toISOString()


                    };


                    projects.unshift(

                        newProject

                    );


                    localStorage.setItem(

                        "portfolioProjects",

                        JSON.stringify(

                            projects

                        )

                    );


                    showToast(

                        "Project published successfully."

                    );


                    const submitButton =

                        document.getElementById(

                            "saveProjectBtn"

                        );


                    submitButton.disabled =

                        true;


                    submitButton.innerHTML = `

                        <i class="fa-solid fa-check"></i>

                        Published Successfully

                    `;


                    setTimeout(

                        function () {


                            window.location.href =

                                "dashboard.html";


                        },

                        1200

                    );

                };


            if (

                projectImage.files[0]

            ) {


                const reader =

                    new FileReader();


                reader.onload =

                    function (event) {


                        saveProject(

                            event.target.result

                        );

                    };


                reader.readAsDataURL(

                    projectImage.files[0]

                );

            }


            else {


                saveProject();

            }


        }

    );

}