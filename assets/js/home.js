/* =====================================================
       CONTACT PAGE LOADER
    ===================================================== */

    const jaContactLoader =
        document.getElementById("jaContactLoader");

    const jaContactLoaderText =
        document.getElementById("jaContactLoaderText");


    if (jaContactLoader) {


        const jaContactMessages = [

            "Establishing secure connection...",

            "Synchronizing digital profile...",

            "Loading communication channels...",

            "Preparing contact interface...",

            "Connection ready."

        ];


        let jaContactMessageIndex = 0;


        const jaContactMessageInterval = setInterval(function () {


            if (

                jaContactLoaderText &&

                jaContactMessageIndex <
                jaContactMessages.length

            ) {


                jaContactLoaderText.textContent =

                    jaContactMessages[
                        jaContactMessageIndex
                    ];


                jaContactMessageIndex++;

            }


        }, 400);


        /*
           LOADER WILL ALWAYS DISAPPEAR
           AFTER 2.5 SECONDS
        */

        setTimeout(function () {


            clearInterval(
                jaContactMessageInterval
            );


            if (jaContactLoaderText) {

                jaContactLoaderText.textContent =
                    "Digital connection established.";

            }


            jaContactLoader.classList.add(

                "ja-contact-loader-hidden"

            );


            setTimeout(function () {


                if (jaContactLoader) {

                    jaContactLoader.remove();

                }


            }, 900);


        }, 2500);

    }


/* =====================================================
   MOBILE MENU
===================================================== */

const mobileButton =
    document.getElementById(
        "jaHomeMobileButton"
    );


const mobileNavigation =
    document.getElementById(
        "jaHomeMobileNav"
    );


if (
    mobileButton &&
    mobileNavigation
) {

    mobileButton.addEventListener(
        "click",
        function () {

            mobileNavigation.classList.toggle(
                "ja-home-mobile-nav-active"
            );

        }
    );


    const mobileLinks =
        mobileNavigation.querySelectorAll(
            "a"
        );


    mobileLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mobileNavigation.classList.remove(
                        "ja-home-mobile-nav-active"
                    );

                }
            );

        }
    );

}


/* =====================================================
   DARK / LIGHT MODE
===================================================== */

const themeButton =
    document.getElementById(
        "jaHomeThemeButton"
    );


const themeIcon =
    document.getElementById(
        "jaHomeThemeIcon"
    );


const savedTheme =
    localStorage.getItem(
        "jaHomeTheme"
    );


if (
    savedTheme === "light"
) {

    document.body.classList.add(
        "ja-home-light-mode"
    );

    themeIcon.className =
        "fa-solid fa-sun";

}


if (
    themeButton
) {

    themeButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "ja-home-light-mode"
            );


            const isLight =
                document.body.classList.contains(
                    "ja-home-light-mode"
                );


            if (
                isLight
            ) {

                localStorage.setItem(
                    "jaHomeTheme",
                    "light"
                );

                themeIcon.className =
                    "fa-solid fa-sun";

            } else {

                localStorage.setItem(
                    "jaHomeTheme",
                    "dark"
                );

                themeIcon.className =
                    "fa-solid fa-moon";

            }

        }
    );

}


/* =====================================================
   COUNTER ANIMATION
===================================================== */

const counterElements =
    document.querySelectorAll(
        "[data-count]"
    );


const counterObserver =
    new IntersectionObserver(
        function (
            entries,
            observer
        ) {

            entries.forEach(
                function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        const counter =
                            entry.target;

                        const target =
                            Number(
                                counter.dataset.count
                            );

                        let current =
                            0;


                        const increment =
                            Math.max(
                                1,
                                Math.ceil(
                                    target / 40
                                )
                            );


                        const timer =
                            setInterval(
                                function () {

                                    current +=
                                        increment;


                                    if (
                                        current >=
                                        target
                                    ) {

                                        current =
                                            target;

                                        clearInterval(
                                            timer
                                        );

                                    }


                                    counter.textContent =
                                        current + "+";

                                },
                                35
                            );


                        observer.unobserve(
                            counter
                        );

                    }

                }
            );

        },
        {
            threshold: 0.6
        }
    );


counterElements.forEach(
    function (counter) {

        counterObserver.observe(
            counter
        );

    }
);


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".ja-home-service-card, " +
        ".ja-home-company-card, " +
        ".ja-home-project-card, " +
        ".ja-home-post-card, " +
        ".ja-home-client-card, " +
        ".ja-home-social-card, " +
        ".ja-home-timeline-item"
    );


const revealObserver =
    new IntersectionObserver(
        function (
            entries,
            observer
        ) {

            entries.forEach(
                function (entry) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "ja-home-revealed"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(
    function (element) {

        element.style.opacity =
            "0";

        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";


        revealObserver.observe(
            element
        );

    }
);


const revealStyle =
    document.createElement(
        "style"
    );


revealStyle.innerHTML = `

    .ja-home-revealed {

        opacity: 1 !important;

        transform: translateY(0) !important;

    }

`;


document.head.appendChild(
    revealStyle
);