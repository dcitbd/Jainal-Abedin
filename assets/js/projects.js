/* =====================================================
   PROJECTS PAGE JAVASCRIPT
   Jainal Abedin Portfolio
===================================================== */


/* =====================================================
   DOM ELEMENTS
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





/* =====================================================
   LOAD PROJECTS
===================================================== */


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


    }
    else {


        allProjects = [];


    }



    /*
        Only published projects
    */


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





/* =====================================================
   RENDER PROJECT CARD
===================================================== */


function renderProjects(projects){



    if(!projectsContainer)
        return;



    projectsContainer.innerHTML = "";



    if(projects.length === 0){


        emptyProjects.style.display =
            "block";


        return;


    }



    emptyProjects.style.display =
        "none";




    projects.forEach(
        (project,index)=>{



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

        }
        else if(
            project.technologies
        ){

            technologies =
            project.technologies
            .split(",");

        }




        let tagsHTML =
            "";



        technologies
        .slice(0,4)
        .forEach(
            tech=>{


            tagsHTML += `

                <span>
                    ${tech}
                </span>

            `;


        });





        let card = `


        <article class="project-card">


            <div class="project-card-image">


                <img src="${image}"
                     alt="${project.title}">


            </div>



            <div class="project-card-content">



                <span class="project-category">

                    ${project.category || "Project"}

                </span>



                <h3>

                    ${project.title}

                </h3>



                <p>

                    ${project.shortDescription || ""}

                </p>




                <div class="project-tags">


                    ${tagsHTML}


                </div>




                <a href="project-details.html?id=${index}"
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







/* =====================================================
   CATEGORY FILTER
===================================================== */


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
            button.dataset.filter;



        if(category === "all"){


            renderProjects(
                allProjects
            );


        }
        else {


            let filtered =
                allProjects.filter(
                    project =>
                    project.category === category
                );



            renderProjects(
                filtered
            );


        }



    });


});







/* =====================================================
   DARK MODE
===================================================== */


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


        }
        else {


            localStorage.setItem(
                "theme",
                "light"
            );


        }



    });



}








/* =====================================================
   MOBILE MENU
===================================================== */


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








/* =====================================================
   PAGE LOADER
===================================================== */


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
        700
    );


});







/* =====================================================
   INITIAL LOAD
===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    ()=>{


    loadProjects();


});