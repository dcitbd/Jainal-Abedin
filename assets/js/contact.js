/* =====================================================
   CONTACT PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


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
       THEME TOGGLE
    ===================================================== */

    const jaContactTheme =
        document.getElementById("jaContactTheme");


    const jaContactThemeIcon =
        jaContactTheme
            ? jaContactTheme.querySelector("i")
            : null;


    const jaContactSavedTheme =
        localStorage.getItem("jaContactTheme");


    if (jaContactSavedTheme === "light") {


        document.body.classList.add(

            "ja-contact-light"

        );


        if (jaContactThemeIcon) {

            jaContactThemeIcon.className =
                "fa-solid fa-sun";

        }

    }


    if (jaContactTheme) {


        jaContactTheme.addEventListener(

            "click",

            function () {


                document.body.classList.toggle(

                    "ja-contact-light"

                );


                const jaContactIsLight =

                    document.body.classList.contains(

                        "ja-contact-light"

                    );


                localStorage.setItem(

                    "jaContactTheme",

                    jaContactIsLight
                        ? "light"
                        : "dark"

                );


                if (jaContactThemeIcon) {


                    jaContactThemeIcon.className =

                        jaContactIsLight

                            ? "fa-solid fa-sun"

                            : "fa-solid fa-moon";

                }


            }

        );

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const jaContactMenu =
        document.getElementById("jaContactMenu");


    const jaContactMobileNav =
        document.getElementById(
            "jaContactMobileNav"
        );


    if (

        jaContactMenu &&

        jaContactMobileNav

    ) {


        jaContactMenu.addEventListener(

            "click",

            function () {


                jaContactMobileNav.classList.toggle(

                    "ja-contact-mobile-open"

                );


            }

        );


        const jaContactMobileLinks =

            jaContactMobileNav.querySelectorAll(

                "a"

            );


        jaContactMobileLinks.forEach(

            function (jaContactLink) {


                jaContactLink.addEventListener(

                    "click",

                    function () {


                        jaContactMobileNav.classList.remove(

                            "ja-contact-mobile-open"

                        );


                    }

                );


            }

        );

    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const jaContactForm =
        document.getElementById(
            "jaContactForm"
        );


    const jaContactFormMessage =
        document.getElementById(
            "jaContactFormMessage"
        );


    if (jaContactForm) {


        jaContactForm.addEventListener(

            "submit",

            function (jaContactEvent) {


                jaContactEvent.preventDefault();


                const jaContactNameInput =

                    jaContactForm.querySelector(

                        '[name="name"]'

                    );


                const jaContactName =

                    jaContactNameInput

                        ? jaContactNameInput.value.trim()

                        : "there";


                if (jaContactFormMessage) {


                    jaContactFormMessage.textContent =

                        "Thank you, " +

                        jaContactName +

                        "! Your project inquiry has been received. I will contact you soon.";

                }


                jaContactForm.reset();


            }

        );

    }


    /* =====================================================
       AI CHAT
    ===================================================== */

    const jaContactAiForm =
        document.getElementById(
            "jaContactAiForm"
        );


    const jaContactAiInput =
        document.getElementById(
            "jaContactAiInput"
        );


    const jaContactAiMessages =
        document.getElementById(
            "jaContactAiMessages"
        );


    const jaContactAiSuggestions =

        document.querySelectorAll(

            ".ja-contact-ai-suggestions button"

        );


    function jaContactAddMessage(

        jaContactMessageText,

        jaContactMessageType

    ) {


        if (!jaContactAiMessages) {

            return;

        }


        const jaContactMessage =

            document.createElement("div");


        if (

            jaContactMessageType === "user"

        ) {


            jaContactMessage.className =

                "ja-contact-ai-message " +

                "ja-contact-ai-user";


            const jaContactUserParagraph =

                document.createElement("p");


            jaContactUserParagraph.textContent =

                jaContactMessageText;


            jaContactMessage.appendChild(

                jaContactUserParagraph

            );


        }


        else {


            jaContactMessage.className =

                "ja-contact-ai-message " +

                "ja-contact-ai-bot";


            const jaContactBotAvatar =

                document.createElement("div");


            jaContactBotAvatar.className =

                "ja-contact-ai-message-avatar";


            jaContactBotAvatar.innerHTML =

                '<i class="fa-solid fa-robot"></i>';


            const jaContactBotParagraph =

                document.createElement("p");


            jaContactBotParagraph.textContent =

                jaContactMessageText;


            jaContactMessage.appendChild(

                jaContactBotAvatar

            );


            jaContactMessage.appendChild(

                jaContactBotParagraph

            );

        }


        jaContactAiMessages.appendChild(

            jaContactMessage

        );


        jaContactAiMessages.scrollTop =

            jaContactAiMessages.scrollHeight;


    }


    function jaContactAiReply(

        jaContactQuestion

    ) {


        const jaContactQuestionText =

            jaContactQuestion.toLowerCase();


        let jaContactReply =

            "I can help you connect with Jainal Abedin. You can use the contact form, email, phone or WhatsApp to start a conversation.";


        if (

            jaContactQuestionText.includes(

                "service"

            )

            ||

            jaContactQuestionText.includes(

                "offer"

            )

        ) {


            jaContactReply =

                "Jainal offers Web Design, Graphic Design, Digital Marketing, SEO, E-commerce Management, WordPress Development, UI/UX Design and many other digital services.";

        }


        else if (

            jaContactQuestionText.includes(

                "contact"

            )

            ||

            jaContactQuestionText.includes(

                "reach"

            )

            ||

            jaContactQuestionText.includes(

                "phone"

            )

            ||

            jaContactQuestionText.includes(

                "email"

            )

        ) {


            jaContactReply =

                "You can contact Jainal by phone at +880 1581-703822, email at jainal.dcitbd@gmail.com or WhatsApp.";

        }


        else if (

            jaContactQuestionText.includes(

                "available"

            )

            ||

            jaContactQuestionText.includes(

                "project"

            )

        ) {


            jaContactReply =

                "Yes! Jainal is available for selected digital projects. Send your project details through the inquiry form.";

        }


        else if (

            jaContactQuestionText.includes(

                "location"

            )

            ||

            jaContactQuestionText.includes(

                "where"

            )

        ) {


            jaContactReply =

                "Jainal is based in Cumilla, Bangladesh and works with clients remotely worldwide.";

        }


        setTimeout(

            function () {


                jaContactAddMessage(

                    jaContactReply,

                    "bot"

                );


            },

            600

        );

    }


    if (

        jaContactAiForm &&

        jaContactAiInput

    ) {


        jaContactAiForm.addEventListener(

            "submit",

            function (jaContactEvent) {


                jaContactEvent.preventDefault();


                const jaContactQuestion =

                    jaContactAiInput.value.trim();


                if (

                    !jaContactQuestion

                ) {

                    return;

                }


                jaContactAddMessage(

                    jaContactQuestion,

                    "user"

                );


                jaContactAiInput.value = "";


                jaContactAiReply(

                    jaContactQuestion

                );


            }

        );

    }


    jaContactAiSuggestions.forEach(

        function (jaContactButton) {


            jaContactButton.addEventListener(

                "click",

                function () {


                    const jaContactQuestion =

                        jaContactButton.dataset.question;


                    if (

                        !jaContactQuestion

                    ) {

                        return;

                    }


                    jaContactAddMessage(

                        jaContactQuestion,

                        "user"

                    );


                    jaContactAiReply(

                        jaContactQuestion

                    );


                }

            );

        }

    );


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const jaContactRevealElements =

        document.querySelectorAll(

            ".ja-contact-info-card, " +

            ".ja-contact-form-wrapper, " +

            ".ja-contact-why-card, " +

            ".ja-contact-location-details, " +

            ".ja-contact-map, " +

            ".ja-contact-ai-chat"

        );


    if (

        "IntersectionObserver" in window

    ) {


        const jaContactRevealObserver =

            new IntersectionObserver(

                function (

                    jaContactEntries

                ) {


                    jaContactEntries.forEach(

                        function (

                            jaContactEntry

                        ) {


                            if (

                                jaContactEntry.isIntersecting

                            ) {


                                jaContactEntry.target.style.opacity =

                                    "1";


                                jaContactEntry.target.style.transform =

                                    "translateY(0)";


                                jaContactRevealObserver.unobserve(

                                    jaContactEntry.target

                                );

                            }


                        }

                    );


                },

                {

                    threshold: 0.12

                }

            );


        jaContactRevealElements.forEach(

            function (

                jaContactElement

            ) {


                jaContactElement.style.opacity =

                    "0";


                jaContactElement.style.transform =

                    "translateY(25px)";


                jaContactElement.style.transition =

                    "opacity .7s ease, transform .7s ease";


                jaContactRevealObserver.observe(

                    jaContactElement

                );


            }

        );

    }


});