/* =====================================================
   PAGE LOADER
===================================================== */

window.addEventListener("load", function () {

    const loader =
        document.getElementById("jaCompaniesLoader");


    if (loader) {

        setTimeout(function () {

            loader.classList.add("hide");

        }, 700);

    }

});


/* =====================================================
   MOBILE MENU
===================================================== */

const jaCompaniesMenu =
    document.getElementById("jaCompaniesMenu");


const jaCompaniesMobileNav =
    document.getElementById("jaCompaniesMobileNav");


if (jaCompaniesMenu && jaCompaniesMobileNav) {


    jaCompaniesMenu.addEventListener("click", function () {


        jaCompaniesMobileNav.classList.toggle("open");


        const icon =
            jaCompaniesMenu.querySelector("i");


        if (icon) {

            icon.classList.toggle("fa-xmark");

        }

    });

}


/* =====================================================
   THEME TOGGLE
===================================================== */

const jaCompaniesTheme =
    document.getElementById("jaCompaniesTheme");


if (jaCompaniesTheme) {


    jaCompaniesTheme.addEventListener("click", function () {


        document.body.classList.toggle(
            "ja-companies-light-mode"
        );


        const icon =
            jaCompaniesTheme.querySelector("i");


        if (icon) {

            icon.classList.toggle("fa-sun");

            icon.classList.toggle("fa-moon");

        }

    });

}


/* =====================================================
   COUNTER ANIMATION
===================================================== */

const jaCompanyCounters =
    document.querySelectorAll(
        "[data-company-counter]"
    );


const jaCompanyCounterObserver =
    new IntersectionObserver(function (entries) {


        entries.forEach(function (entry) {


            if (!entry.isIntersecting) {

                return;

            }


            const counter =
                entry.target;


            const target =
                parseInt(
                    counter.dataset.companyCounter
                );


            let current = 0;


            const duration = 1500;


            const increment =
                target / (duration / 16);


            const updateCounter =
                function () {


                    current += increment;


                    if (current < target) {


                        counter.textContent =
                            Math.floor(current) + "+";


                        requestAnimationFrame(
                            updateCounter
                        );


                    } else {


                        counter.textContent =
                            target + "+";


                    }

                };


            updateCounter();


            jaCompanyCounterObserver.unobserve(
                counter
            );


        });


    });


jaCompanyCounters.forEach(function (counter) {


    jaCompanyCounterObserver.observe(counter);


});


/* =====================================================
   SUBSCRIBE FORM
===================================================== */

const jaCompaniesSubscribeForm =
    document.getElementById(
        "jaCompaniesSubscribeForm"
    );


if (jaCompaniesSubscribeForm) {


    jaCompaniesSubscribeForm.addEventListener(
        "submit",
        function (event) {


            event.preventDefault();


            const email =
                jaCompaniesSubscribeForm
                .querySelector("input")
                .value;


            if (!email) {

                return;

            }


            alert(
                "Thank you for subscribing!"
            );


            jaCompaniesSubscribeForm.reset();


        }
    );

}


/* =====================================================
   CONTACT FORM
===================================================== */

const jaCompaniesContactForm =
    document.getElementById(
        "jaCompaniesContactForm"
    );


if (jaCompaniesContactForm) {


    jaCompaniesContactForm.addEventListener(
        "submit",
        function (event) {


            event.preventDefault();


            const formData =
                new FormData(
                    jaCompaniesContactForm
                );


            const name =
                formData.get("name");


            const email =
                formData.get("email");


            const subject =
                formData.get("subject");


            const message =
                formData.get("message");


            const whatsappMessage =

                `Hello Jainal Abedin,

Name: ${name}

Email: ${email}

Subject: ${subject}

Message:
${message}`;


            const whatsappURL =

                "https://wa.me/8801581703822?text=" +

                encodeURIComponent(
                    whatsappMessage
                );


            window.open(
                whatsappURL,
                "_blank"
            );


            jaCompaniesContactForm.reset();


        }
    );

}


/* =====================================================
   SCROLL REVEAL
===================================================== */

const jaCompanyCards =
    document.querySelectorAll(
        ".ja-company-card"
    );


const jaCompanyRevealObserver =
    new IntersectionObserver(
        function (entries) {


            entries.forEach(
                function (entry) {


                    if (
                        entry.isIntersecting
                    ) {


                        entry.target.classList.add(
                            "ja-company-visible"
                        );


                        jaCompanyRevealObserver
                            .unobserve(
                                entry.target
                            );


                    }


                }
            );


        },
        {

            threshold: 0.1

        }
    );


jaCompanyCards.forEach(
    function (card) {


        jaCompanyRevealObserver.observe(
            card
        );


    }
);