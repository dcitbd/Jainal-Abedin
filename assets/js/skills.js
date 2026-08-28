/* =====================================================
   SKILLS PAGE LOADER
===================================================== */

window.addEventListener("load", function () {


    const loader = document.getElementById("jaSkillsLoader");


    setTimeout(function () {


        if (loader) {

            loader.classList.add("hide");

        }


    }, 900);


});


/* =====================================================
   MOBILE MENU
===================================================== */

const skillsMenu =
    document.getElementById("jaSkillsMenu");


const skillsMobileNav =
    document.getElementById("jaSkillsMobileNav");


if (skillsMenu && skillsMobileNav) {


    skillsMenu.addEventListener("click", function () {


        skillsMobileNav.classList.toggle("active");


        skillsMenu.classList.toggle("active");


    });


}


/* =====================================================
   THEME TOGGLE
===================================================== */

const skillsTheme =
    document.getElementById("jaSkillsTheme");


if (skillsTheme) {


    skillsTheme.addEventListener("click", function () {


        document.body.classList.toggle("ja-skills-light");


        const icon =
            skillsTheme.querySelector("i");


        if (document.body.classList.contains("ja-skills-light")) {


            icon.classList.remove("fa-moon");

            icon.classList.add("fa-sun");


        } else {


            icon.classList.remove("fa-sun");

            icon.classList.add("fa-moon");


        }


    });


}


/* =====================================================
   COUNTER ANIMATION
===================================================== */

const counters =
    document.querySelectorAll("[data-counter]");


const counterObserver =
    new IntersectionObserver(function (entries, observer) {


        entries.forEach(function (entry) {


            if (entry.isIntersecting) {


                const counter =
                    entry.target;


                const target =
                    parseInt(counter.dataset.counter);


                let current = 0;


                const increment =
                    Math.max(1, Math.ceil(target / 60));


                const updateCounter =
                    setInterval(function () {


                        current += increment;


                        if (current >= target) {


                            current = target;

                            clearInterval(updateCounter);

                        }


                        counter.textContent =
                            current + "+";


                    }, 25);


                observer.unobserve(counter);


            }


        });


    },


    {

        threshold: 0.5

    });


counters.forEach(function (counter) {


    counterObserver.observe(counter);


});


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(

        ".ja-skill-card, " +
        ".ja-workflow-step, " +
        ".ja-skills-stat-card, " +
        ".ja-skills-client-section"

    );


revealElements.forEach(function (element) {


    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";


    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";


});


const revealObserver =
    new IntersectionObserver(function (entries, observer) {


        entries.forEach(function (entry) {


            if (entry.isIntersecting) {


                entry.target.style.opacity = "1";


                entry.target.style.transform =
                    "translateY(0)";


                observer.unobserve(entry.target);


            }


        });


    },


    {

        threshold: 0.15

    });


revealElements.forEach(function (element) {


    revealObserver.observe(element);


});


/* =====================================================
   SUBSCRIBE FORM
===================================================== */

const subscribeForm =
    document.getElementById("jaSkillsSubscribeForm");


if (subscribeForm) {


    subscribeForm.addEventListener("submit", function (event) {


        event.preventDefault();


        const email =
            subscribeForm.querySelector("input").value;


        if (email.trim() !== "") {


            alert(

                "Thank you for subscribing! " +
                "You will receive useful digital updates."

            );


            subscribeForm.reset();


        }


    });


}


/* =====================================================
   TERMINAL TYPING EFFECT
===================================================== */

const terminalCursor =
    document.querySelector(".ja-terminal-cursor");


if (terminalCursor) {


    const originalText =
        terminalCursor.textContent;


    terminalCursor.textContent = "";


    let index = 0;


    function typeTerminalText() {


        if (index < originalText.length) {


            terminalCursor.textContent +=
                originalText.charAt(index);


            index++;


            setTimeout(typeTerminalText, 35);


        }


    }


    setTimeout(typeTerminalText, 1200);


}