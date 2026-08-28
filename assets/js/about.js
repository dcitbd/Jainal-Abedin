/* =====================================================
   ABOUT PAGE LOADER
===================================================== */

window.addEventListener("load", function () {

    const loader =
        document.getElementById("jaAboutLoader");

    if (loader) {

        setTimeout(function () {

            loader.classList.add(
                "ja-about-loader-hidden"
            );

        }, 700);

    }

});


/* =====================================================
   THEME TOGGLE
===================================================== */

const themeButton =
    document.getElementById("jaAboutTheme");

const themeIcon =
    themeButton ?
    themeButton.querySelector("i") :
    null;


if (themeButton) {

    themeButton.addEventListener("click", function () {

        document.body.classList.toggle(
            "ja-about-light"
        );


        const isLight =
            document.body.classList.contains(
                "ja-about-light"
            );


        if (isLight) {

            themeIcon.className =
                "fa-solid fa-sun";

            localStorage.setItem(
                "jaAboutTheme",
                "light"
            );

        } else {

            themeIcon.className =
                "fa-solid fa-moon";

            localStorage.setItem(
                "jaAboutTheme",
                "dark"
            );

        }

    });

}


/* =====================================================
   LOAD SAVED THEME
===================================================== */

const savedTheme =
    localStorage.getItem(
        "jaAboutTheme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "ja-about-light"
    );


    if (themeIcon) {

        themeIcon.className =
            "fa-solid fa-sun";

    }

}


/* =====================================================
   MOBILE MENU
===================================================== */

const menuButton =
    document.getElementById("jaAboutMenu");

const mobileNav =
    document.getElementById(
        "jaAboutMobileNav"
    );


if (menuButton && mobileNav) {

    menuButton.addEventListener(
        "click",
        function () {

            mobileNav.classList.toggle(
                "ja-about-mobile-open"
            );

        }
    );


    const mobileLinks =
        mobileNav.querySelectorAll("a");


    mobileLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                mobileNav.classList.remove(
                    "ja-about-mobile-open"
                );

            }
        );

    });

}


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealItems =
    document.querySelectorAll(
        ".ja-about-section, .ja-about-philosophy, .ja-about-cta"
    );


const revealObserver =
    new IntersectionObserver(

        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },

        {

            threshold: 0.12

        }

    );


revealItems.forEach(function (item) {

    item.style.opacity = "0";

    item.style.transform =
        "translateY(30px)";

    item.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    revealObserver.observe(item);

});
