/* =====================================================
   ADD PROJECT JAVASCRIPT
===================================================== */


/* ================= SIDEBAR ================= */

const menuBtn =
    document.getElementById("menuBtn");

const closeSidebar =
    document.getElementById("closeSidebar");

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");


if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.add(
                "open"
            );

            sidebarOverlay.classList.add(
                "active"
            );

            document.body.style.overflow =
                "hidden";

        }

    );

}


function closeSidebarMenu() {

    sidebar.classList.remove(
        "open"
    );

    sidebarOverlay.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


if (closeSidebar) {

    closeSidebar.addEventListener(
        "click",
        closeSidebarMenu
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebarMenu
    );

}


/* ================= LOGOUT ================= */

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                localStorage.removeItem(
                    "adminLoggedIn"
                );


                sessionStorage.removeItem(
                    "adminLoggedIn"
                );


                window.location.href =
                    "login.html";

            }

        }

    );

}


/* ================= SHORT DESCRIPTION COUNT ================= */

const shortDescription =
    document.getElementById(
        "shortDescription"
    );


const shortDescriptionCount =
    document.getElementById(
        "shortDescriptionCount"
    );


if (shortDescription) {

    shortDescription.addEventListener(
        "input",
        function () {

            shortDescriptionCount.textContent =
                this.value.length;

        }

    );

}


/* ================= MULTI IMAGE UPLOAD ================= */

const projectImage = document.getElementById("projectImage");
const imageUploadArea = document.getElementById("imageUploadArea");
const imagePreview = document.getElementById("imagePreview");

if (imageUploadArea) {

    imageUploadArea.addEventListener("click", function () {

        projectImage.click();

    });

}

if (projectImage) {

    projectImage.addEventListener("change", function () {

        imagePreview.innerHTML = "";

        const files = Array.from(this.files);

        files.forEach(function (file, index) {

            if (!file.type.startsWith("image/")) {
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                const item = document.createElement("div");

                item.className = "gallery-item";

                item.innerHTML = `

                    <img
                        src="${event.target.result}"
                        alt="Project Image ${index + 1}"
                    >

                    <button
                        type="button"
                        class="gallery-remove"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                `;

                item.querySelector(".gallery-remove")
                    .addEventListener("click", function (e) {

                        e.stopPropagation();

                        item.remove();

                    });

                imagePreview.appendChild(item);

            };

            reader.readAsDataURL(file);

        });

    });

}


/* ================= FORM ================= */

const projectForm =
    document.getElementById(
        "projectForm"
    );


const publishBtn =
    document.getElementById(
        "publishBtn"
    );


const saveDraftBtn =
    document.getElementById(
        "saveDraftBtn"
    );


/* ================= SAVE PROJECT ================= */

function saveProject(
    status
) {


    const title =
        document.getElementById(
            "projectTitle"
        ).value.trim();


    const category =
        document.getElementById(
            "projectCategory"
        ).value;


    const shortDescription =
        document.getElementById(
            "shortDescription"
        ).value.trim();


    const fullDescription =
        document.getElementById(
            "fullDescription"
        ).value.trim();


    const technologies =
        document.getElementById(
            "technologies"
        ).value.trim();


    const completionDate =
        document.getElementById(
            "completionDate"
        ).value;


    const projectUrl =
        document.getElementById(
            "projectUrl"
        ).value.trim();


    const githubUrl =
        document.getElementById(
            "githubUrl"
        ).value.trim();


    const featured =
        document.getElementById(
            "featuredProject"
        ).checked;


    const allowComments =
        document.getElementById(
            "allowComments"
        ).checked;


    const project = {


        id:
            Date.now(),


        title:
            title,


        category:
            category,


        shortDescription:
            shortDescription,


        fullDescription:
            fullDescription,


        technologies:
            technologies
                .split(",")
                .map(
                    function (item) {

                        return item.trim();

                    }

                )
                .filter(
                    function (item) {

                        return item !== "";

                    }

                ),


        completionDate:
            completionDate,


        projectUrl:
            projectUrl,


        githubUrl:
            githubUrl,


        featured:
            featured,


        allowComments:
            allowComments,


        status:
            status,


        views:
            0,


        comments:
            0,


        createdAt:
            new Date().toISOString()

    };


    const projects =
        JSON.parse(

            localStorage.getItem(
                "portfolioProjects"
            )

        ) || [];


    projects.unshift(
        project
    );





    try {

    localStorage.setItem(

        "portfolioProjects",

        JSON.stringify(projects)

    );

}

catch(error){

    console.error(error);

    alert(

        "Storage Full"

    );

}


    return project;

}


/* ================= PUBLISH ================= */

if (projectForm) {

    projectForm.addEventListener(
        "submit",
        function (event) {


            event.preventDefault();


            const clickedButton =
                event.submitter;


            let status =
                "published";


            if (
                clickedButton &&
                clickedButton.id ===
                "saveDraftBtn"
            ) {

                status =
                    "draft";

            }


            if (
                !projectForm.checkValidity()
            ) {

                projectForm.reportValidity();

                return;

            }


            const project =
                saveProject(
                    status
                );


            if (
                status ===
                "published"
            ) {


                alert(
                    "Project published successfully!"
                );


                window.location.href =
                    "dashboard.html";

            }

            else {


                alert(
                    "Project saved as draft successfully!"
                );


                window.location.href =
                    "dashboard.html";

            }

        }

    );

}