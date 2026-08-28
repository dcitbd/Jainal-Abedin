/* =====================================================
   SERVICES PAGE JAVASCRIPT
===================================================== */


/* =====================================================
   PAGE LOADER
===================================================== */

window.addEventListener("load", function () {

    const jaServicesLoader =
        document.getElementById("jaServicesLoader");

    setTimeout(function () {

        if (jaServicesLoader) {

            jaServicesLoader.classList.add(
                "ja-services-loader-hidden"
            );

        }

    }, 700);

});


/* =====================================================
   DARK MODE
===================================================== */

const jaServicesThemeButton =
    document.getElementById("jaServicesThemeButton");

const jaServicesThemeIcon =
    jaServicesThemeButton?.querySelector("i");


if (localStorage.getItem("jaServicesTheme") === "light") {

    document.body.classList.add(
        "ja-services-light-mode"
    );

}


if (jaServicesThemeButton) {

    jaServicesThemeButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "ja-services-light-mode"
            );


            const jaServicesIsLight =
                document.body.classList.contains(
                    "ja-services-light-mode"
                );


            localStorage.setItem(

                "jaServicesTheme",

                jaServicesIsLight
                    ? "light"
                    : "dark"

            );


            if (jaServicesThemeIcon) {

                jaServicesThemeIcon.className =
                    jaServicesIsLight

                        ? "fa-solid fa-sun"

                        : "fa-solid fa-moon";

            }

        }

    );

}


/* =====================================================
   MOBILE MENU
===================================================== */

const jaServicesMobileButton =
    document.getElementById(
        "jaServicesMobileButton"
    );


const jaServicesMobileNavigation =
    document.getElementById(
        "jaServicesMobileNavigation"
    );


if (jaServicesMobileButton) {

    jaServicesMobileButton.addEventListener(

        "click",

        function () {

            jaServicesMobileNavigation.classList.toggle(

                "ja-services-mobile-open"

            );

        }

    );

}


/* =====================================================
   COUNTER ANIMATION
===================================================== */

const jaServicesCounters =
    document.querySelectorAll(
        "[data-ja-counter]"
    );


const jaServicesCounterObserver =
    new IntersectionObserver(

        function (entries, observer) {

            entries.forEach(function (entry) {

                if (!entry.isIntersecting) {

                    return;

                }


                const jaServicesCounter =
                    entry.target;


                const jaServicesTarget =
                    Number(

                        jaServicesCounter.dataset
                            .jaCounter

                    );


                let jaServicesCurrent = 0;


                const jaServicesIncrement =
                    Math.max(

                        1,

                        Math.ceil(

                            jaServicesTarget / 60

                        )

                    );


                const jaServicesTimer =
                    setInterval(function () {


                        jaServicesCurrent +=
                            jaServicesIncrement;


                        if (

                            jaServicesCurrent
                            >=
                            jaServicesTarget

                        ) {

                            jaServicesCurrent =
                                jaServicesTarget;


                            clearInterval(
                                jaServicesTimer
                            );

                        }


                        jaServicesCounter.textContent =
                            jaServicesCurrent + "+";


                    }, 25);


                observer.unobserve(
                    jaServicesCounter
                );

            });

        },

        {

            threshold: 0.5

        }

    );


jaServicesCounters.forEach(function (counter) {

    jaServicesCounterObserver.observe(counter);

});


/* =====================================================
   SUBSCRIBE FORM
===================================================== */

const jaServicesSubscribeForm =
    document.getElementById(
        "jaServicesSubscribeForm"
    );


if (jaServicesSubscribeForm) {

    jaServicesSubscribeForm.addEventListener(

        "submit",

        function (event) {

            event.preventDefault();


            const jaServicesEmail =
                jaServicesSubscribeForm
                    .querySelector("input")
                    .value;


            if (!jaServicesEmail) {

                return;

            }


            alert(

                "Thank you for subscribing! " +

                jaServicesEmail +

                " has been added successfully."

            );


            jaServicesSubscribeForm.reset();

        }

    );

}


/* =====================================================
   SCROLL REVEAL
===================================================== */

const jaServicesRevealItems =
    document.querySelectorAll(

        ".ja-service-card, " +

        ".ja-services-stat-card, " +

        ".ja-services-rating-content"

    );


const jaServicesRevealObserver =
    new IntersectionObserver(

        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(

                        "ja-services-revealed"

                    );

                }

            });

        },

        {

            threshold: 0.12

        }

    );


jaServicesRevealItems.forEach(function (item) {

    item.classList.add(

        "ja-services-reveal-item"

    );


    jaServicesRevealObserver.observe(item);

});