/* =====================================================
   PROJECTS PAGE JAVASCRIPT (FINAL FIXED)
   Jainal Abedin Portfolio
===================================================== */

const projectsContainer =
    document.getElementById(
        "projectsContainer"
    );

const emptyProjects =
    document.getElementById(
        "emptyProjects"
    );

const totalProjects =
    document.getElementById(
        "totalProjects"
    );

const loader =
    document.getElementById(
        "jaProjectLoader"
    );

let allProjects = [];

function loadProjects(){
    let storedProjects =
        localStorage.getItem(
            "portfolioProjects"
        );

    if(storedProjects){
        allProjects =
            JSON.parse(
                storedProjects
            );
    } else {
        allProjects = [];
    }

    // শুধুমাত্র পাবলিশড প্রজেক্টগুলো ফিল্টার করা
    allProjects =
        allProjects.filter(
            project =>
            project.status === "published"
        );

    if(totalProjects){
        totalProjects.innerText =
            allProjects.length;
    }

    renderProjects(
        allProjects
    );
}

function renderProjects(projects){
    if(!projectsContainer)
        return;

    projectsContainer.innerHTML = "";

    if(!projects || projects.length === 0){
        if(emptyProjects) {
            emptyProjects.style.display = "block";
        }
        return;
    }

    if(emptyProjects){
        emptyProjects.style.display = "none";
    }

    projects.forEach(
        (project)=>{

        let image =
            project.image
            ?
            project.image
            :
            "../images/project-placeholder.jpg";

        let technologies = [];

        if(
            Array.isArray(
                project.technologies
            )
        ){
            technologies =
                project.technologies;
        } else if(
            project.technologies
        ){
            technologies =
            project.technologies
            .split(",");
        } else if(
            project.tech
        ) {
            technologies = Array.isArray(project.tech) ? project.tech : project.tech.split(",");
        }

        let tagsHTML = "";

        technologies
        .slice(0,4)
        .forEach(
            tech=>{
            tagsHTML += `
                <span>
                    ${String(tech).trim()}
                </span>
            `;
        });

        let card = `
        <article class="project-card">
            <div class="project-card-image">
                <img src="${image}"
                     alt="${project.title || 'Project'}">
            </div>

            <div class="project-card-content">
                <span class="project-category">
                    ${project.category || "Project"}
                </span>

                <h3>
                    ${project.title || "Untitled Project"}
                </h3>

                <p>
                    ${project.shortDescription || ""}
                </p>

                <div class="project-tags">
                    ${tagsHTML}
                </div>

                <a href="project-details.html?id=${project.id}"
                   class="project-view-btn">
                    <span>
                        View Details
                    </span>
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </article>
        `;

        projectsContainer
        .insertAdjacentHTML(
            "beforeend",
            card
        );
    });
}

// ক্যাটাগরি ফিল্টার লজিক (ক্যাস কেস এবং ট্রিম সমস্যা দূর করার জন্য নিরাপদ তুলনামূলক পদ্ধতি)
const filterButtons =
    document.querySelectorAll(
        ".project-filter"
    );

filterButtons.forEach(
    button=>{
    button.addEventListener(
        "click",
        ()=>{
        filterButtons.forEach(
            btn=>{
                btn.classList.remove(
                    "active"
                );
            }
        );

        button.classList.add(
            "active"
        );

        let category =
            button.dataset.filter.trim().toLowerCase();

        if(category === "all"){
            renderProjects(
                allProjects
            );
        } else {
            let filtered =
                allProjects.filter(
                    project => {
                        let projCat = project.category ? project.category.trim().toLowerCase() : "";
                        return projCat === category;
                    }
                );
            renderProjects(
                filtered
            );
        }
    });
});

// থিম টগল সিস্টেম
const themeButton =
    document.getElementById(
        "jaProjectThemeButton"
    );

if(themeButton){
    let savedTheme =
        localStorage.getItem(
            "theme"
        );

    if(savedTheme === "dark"){
        document.body.classList.add(
            "dark-mode"
        );
    }

    themeButton.addEventListener(
        "click",
        ()=>{
        document.body.classList.toggle(
            "dark-mode"
        );

        if(
            document.body.classList.contains(
                "dark-mode"
            )
        ){
            localStorage.setItem(
                "theme",
                "dark"
            );
        } else {
            localStorage.setItem(
                "theme",
                "light"
            );
        }
    });
}

// মোবাইল মেনু টগল
const mobileButton =
    document.getElementById(
        "jaProjectMobileButton"
    );

const mobileNavigation =
    document.getElementById(
        "jaProjectMobileNavigation"
    );

if(
    mobileButton &&
    mobileNavigation
){
    mobileButton.addEventListener(
        "click",
        ()=>{
        mobileNavigation.classList.toggle(
            "show"
        );
    });
}

// পেজ লোডার হ্যান্ডেলিং
window.addEventListener(
    "load",
    ()=>{
    setTimeout(
        ()=>{
        if(loader){
            loader.style.display =
                "none";
        }
        },
        500
    );
});

// ইনিশিয়ালাইজেশন
document.addEventListener(
    "DOMContentLoaded",
    ()=>{
    loadProjects();
});
