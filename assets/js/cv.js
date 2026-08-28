/* =====================================================
   CV PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =================================================
       LOADER
    ================================================= */

    const loader =
        document.getElementById("jaCvLoader");


    const loaderText =
        document.getElementById("jaCvLoaderText");


    const loaderPercent =
        document.getElementById("jaCvLoaderPercent");


    const progressBar =
        document.querySelector(
            ".ja-cv-loader-progress-bar"
        );


    const messages = [

        "Preparing professional CV...",

        "Loading professional profile...",

        "Organizing experience and skills...",

        "Preparing digital portfolio...",

        "CV ready."

    ];


    let progress = 0;

    let messageIndex = 0;


    const progressInterval =
        setInterval(function () {


            progress += 2;


            if (progress > 100) {

                progress = 100;

            }


            if (progressBar) {

                progressBar.style.width =
                    progress + "%";

            }


            if (loaderPercent) {

                loaderPercent.textContent =
                    progress + "%";

            }


            if (

                progress % 20 === 0 &&

                messageIndex < messages.length

            ) {

                if (loaderText) {

                    loaderText.textContent =
                        messages[messageIndex];

                }


                messageIndex++;

            }


            if (progress >= 100) {

                clearInterval(progressInterval);


                setTimeout(function () {


                    if (loader) {

                        loader.classList.add(
                            "ja-cv-loader-hidden"
                        );

                    }


                    setTimeout(function () {

                        if (loader) {

                            loader.remove();

                        }

                    }, 800);


                }, 300);

            }


        }, 25);


    /* =================================================
       THEME TOGGLE
    ================================================= */

    const themeButton =
        document.getElementById(
            "jaCvThemeToggle"
        );


    const themeIcon =
        themeButton ?
        themeButton.querySelector("i") :
        null;


    const savedTheme =
        localStorage.getItem(
            "jaCvTheme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "ja-cv-light"
        );


        if (themeIcon) {

            themeIcon.className =
                "fa-solid fa-sun";

        }

    }


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            function () {


                document.body.classList.toggle(
                    "ja-cv-light"
                );


                const isLight =
                    document.body.classList.contains(
                        "ja-cv-light"
                    );


                localStorage.setItem(

                    "jaCvTheme",

                    isLight ?
                    "light" :
                    "dark"

                );


                if (themeIcon) {

                    themeIcon.className =

                        isLight ?

                        "fa-solid fa-sun" :

                        "fa-solid fa-moon";

                }


            }

        );

    }


    /* =================================================
       PRINT
    ================================================= */

    const printButton =
        document.getElementById(
            "jaCvPrintButton"
        );


    const heroPrintButton =
        document.getElementById(
            "jaCvHeroPrint"
        );


    function printCV() {

        window.print();

    }


    if (printButton) {

        printButton.addEventListener(
            "click",
            printCV
        );

    }


    if (heroPrintButton) {

        heroPrintButton.addEventListener(
            "click",
            printCV
        );

    }


    /* =================================================
       MOBILE MENU
    ================================================= */

    const mobileButton =
        document.getElementById(
            "jaCvMobileButton"
        );


    const mobileNav =
        document.getElementById(
            "jaCvMobileNav"
        );


    if (mobileButton && mobileNav) {


        mobileButton.addEventListener(
            "click",
            function () {


                mobileNav.classList.toggle(
                    "ja-cv-mobile-open"
                );


            }
        );


        const mobileLinks =
            mobileNav.querySelectorAll("a");


        mobileLinks.forEach(
            function (link) {


                link.addEventListener(
                    "click",
                    function () {


                        mobileNav.classList.remove(
                            "ja-cv-mobile-open"
                        );


                    }
                );


            }
        );

    }


});