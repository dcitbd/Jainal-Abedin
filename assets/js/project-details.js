/* =====================================================
   PROJECT DETAILS JAVASCRIPT
   Jainal Abedin Portfolio
===================================================== */


document.addEventListener(
"DOMContentLoaded",
function(){



/* ================= LOADER ================= */


const loader =
document.getElementById(
"jdLoader"
);


if(loader){

setTimeout(()=>{

loader.style.opacity="0";

setTimeout(()=>{

loader.style.display="none";

},400);


},700);

}




/* ================= THEME ================= */


const themeButton =
document.getElementById(
"jdThemeButton"
);


if(
localStorage.getItem("theme")
==="dark"
){

document.body.classList.add(
"dark-mode"
);

}



if(themeButton){


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


themeButton.innerHTML =
`
<i class="fa-solid fa-sun"></i>
`;


}
else{


localStorage.setItem(
"theme",
"light"
);


themeButton.innerHTML =
`
<i class="fa-solid fa-moon"></i>
`;


}


});

}




/* ================= MOBILE MENU ================= */


const mobileButton =
document.getElementById(
"jdMobileButton"
);


const mobileNavigation =
document.getElementById(
"jdMobileNavigation"
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




/* ================= GET ID ================= */


const params =
new URLSearchParams(
window.location.search
);


const projectId =
params.get("id");





/* ================= GET PROJECT ================= */


const projects =
JSON.parse(
    localStorage.getItem(
        "portfolioProjects"
    )
) || [];



console.log(
    "All Projects:",
    projects
);



let project = null;



// Find by ID

if(projectId){


    project =
    projects.find(

        item =>

        String(item.id)
        ===
        String(projectId)

    );


}




/*
    Fallback:
    যদি id না মিলে,
    তাহলে index দিয়ে খুঁজবে
*/


if(!project && projectId){


    const index =
    Number(projectId);



    if(
        !isNaN(index)
        &&
        projects[index]
    ){

        project =
        projects[index];

    }


}




console.log(
    "Selected Project:",
    project
);






/* ================= PROJECT NOT FOUND ================= */


if(!project){


document.querySelector(
".jd-content-section"
).innerHTML = `


<div class="jd-container">

<div class="jd-card"
style="text-align:center;">


<h2>

<i class="fa-solid fa-circle-exclamation"></i>

</h2>


<h2>
Project Not Found
</h2>


<p>
This project does not exist or has been removed.
</p>


<a href="projects.html"
class="jd-link-button">

Back To Projects

</a>


</div>

</div>


`;

return;


}



/* ================= TEXT SET ================= */


function setText(
id,
value
){


const el =
document.getElementById(id);


if(el){

el.textContent =
value || "-";

}


}



setText(
"projectTitle",
project.title
);


setText(
"projectShortDescription",
project.shortDescription
);



setText(
"projectDescription",
project.description
);



setText(
"projectCategory",
project.category
);



setText(
"projectType",
project.category
);



setText(
"infoCategory",
project.category
);



setText(
"infoStatus",
project.status
);



setText(
"projectDate",
project.createdAt
?
new Date(
project.createdAt
)
.toLocaleDateString()
:
"Recently Published"
);






/* ================= IMAGE ================= */


const image =
document.getElementById(
"projectImage"
);



const placeholder =
document.getElementById(
"imagePlaceholder"
);



if(project.image){


image.src =
project.image;


image.style.display =
"block";


if(placeholder){

placeholder.style.display =
"none";

}


}






/* ================= TECHNOLOGY ================= */


const techBox =
document.getElementById(
"technologyList"
);



if(techBox){


    techBox.innerHTML = "";



    let tech =
    project.technologies || project.tech || [];



    if(
        typeof tech === "string"
    ){

        tech =
        tech.split(",");

    }



    if(
        Array.isArray(tech) &&
        tech.length > 0
    ){

        tech.forEach(
            item=>{


                if(
                    item.trim()
                ){


                    techBox.innerHTML +=
                    `

                    <span>
                    ${item.trim()}
                    </span>

                    `;


                }


            }
        );

    }
    else{

        techBox.innerHTML =
        `
        <span style="color:var(--jd-muted);">
        No technologies specified
        </span>
        `;

    }


}






/* ================= FEATURES ================= */


const featureBox =
document.getElementById(
"featureList"
);



if(featureBox){


featureBox.innerHTML="";



let features =
project.features || [];



if(
typeof features === "string"
){

features =
features.split("\n");

}



features.forEach(
item=>{


if(
item.trim()
){


featureBox.innerHTML +=
`

<li>
${item}
</li>

`;


}


});


}







/* ================= LINKS ================= */


const live =
document.getElementById(
"liveProjectLink"
);



const github =
document.getElementById(
"githubProjectLink"
);




if(
project.liveUrl
){


live.href =
project.liveUrl;


}
else{


live.style.display="none";


}





if(
project.githubUrl
){


github.href =
project.githubUrl;


}
else{


github.style.display="none";


}







});