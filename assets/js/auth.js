/* =====================================================
   AUTHENTICATION JAVASCRIPT
===================================================== */


/* ================= LOGIN ELEMENTS ================= */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const passwordToggle =
    document.getElementById("passwordToggle");

const loginBtn =
    document.getElementById("loginBtn");

const loginMessage =
    document.getElementById("loginMessage");

const emailError =
    document.getElementById("emailError");

const passwordError =
    document.getElementById("passwordError");

const forgotPassword =
    document.getElementById("forgotPassword");


/* ================= DEMO ADMIN LOGIN ================= */


/*
    Temporary Login Credentials

    Email:
    jainal.dcitbd@gmail.com

    Password:
    Jainal@2000

    Later we will connect this with
    a real database/backend system.
*/


const ADMIN_EMAIL =
    "jainal.dcitbd@gmail.com";


const ADMIN_PASSWORD =
    "Jainal@2000";


/* ================= PASSWORD TOGGLE ================= */

if (passwordToggle) {

    passwordToggle.addEventListener(
        "click",
        function () {

            const icon =
                this.querySelector("i");


            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";


                icon.classList.remove(
                    "fa-eye"
                );


                icon.classList.add(
                    "fa-eye-slash"
                );


                this.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            }

            else {

                passwordInput.type =
                    "password";


                icon.classList.remove(
                    "fa-eye-slash"
                );


                icon.classList.add(
                    "fa-eye"
                );


                this.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }

    );

}


/* ================= MESSAGE ================= */

function showMessage(
    message,
    type
) {

    loginMessage.textContent =
        message;


    loginMessage.className =
        "login-message show " +
        type;

}


function clearMessage() {

    loginMessage.textContent =
        "";


    loginMessage.className =
        "login-message";

}


/* ================= ERROR CLEAR ================= */

function clearErrors() {

    emailError.textContent =
        "";


    passwordError.textContent =
        "";


    emailInput
        .closest(".input-wrapper")
        .classList.remove(
            "error"
        );


    passwordInput
        .closest(".input-wrapper")
        .classList.remove(
            "error"
        );

}


/* ================= VALIDATION ================= */

function validateLogin() {

    let valid =
        true;


    clearErrors();


    const email =
        emailInput.value.trim();


    const password =
        passwordInput.value;


    if (email === "") {

        emailError.textContent =
            "Please enter your email address.";


        emailInput
            .closest(".input-wrapper")
            .classList.add(
                "error"
            );


        valid =
            false;

    }


    else if (
        !email.includes("@") ||
        !email.includes(".")
    ) {

        emailError.textContent =
            "Please enter a valid email address.";


        emailInput
            .closest(".input-wrapper")
            .classList.add(
                "error"
            );


        valid =
            false;

    }


    if (password === "") {

        passwordError.textContent =
            "Please enter your password.";


        passwordInput
            .closest(".input-wrapper")
            .classList.add(
                "error"
            );


        valid =
            false;

    }


    return valid;

}


/* ================= LOGIN ================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearMessage();


            if (
                !validateLogin()
            ) {

                return;

            }


            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            loginBtn.classList.add(
                "loading"
            );


            loginBtn.disabled =
                true;


            /*
                Simulated Login Request
            */

            setTimeout(
                function () {


                    if (

                        email ===
                        ADMIN_EMAIL

                        &&

                        password ===
                        ADMIN_PASSWORD

                    ) {


                        const rememberMe =
                            document.getElementById(
                                "rememberMe"
                            ).checked;


                        if (
                            rememberMe
                        ) {

                            localStorage.setItem(

                                "adminLoggedIn",

                                "true"

                            );

                        }

                        else {

                            sessionStorage.setItem(

                                "adminLoggedIn",

                                "true"

                            );

                        }


                        showMessage(

                            "Login successful. Redirecting...",

                            "success"

                        );


                        setTimeout(

                            function () {

                                window.location.href =
                                    "dashboard.html";

                            },

                            700

                        );

                    }


                    else {


                        showMessage(

                            "Invalid email or password. Please try again.",

                            "error"

                        );


                        loginBtn.classList.remove(
                            "loading"
                        );


                        loginBtn.disabled =
                            false;

                    }

                },

                900

            );

        }

    );

}


/* ================= FORGOT PASSWORD ================= */

if (forgotPassword) {

    forgotPassword.addEventListener(

        "click",

        function (event) {

            event.preventDefault();


            showMessage(

                "Password recovery will be available after connecting the database.",

                "error"

            );

        }

    );

}


/* ================= CLEAR ERRORS ON INPUT ================= */

if (emailInput) {

    emailInput.addEventListener(

        "input",

        function () {

            emailError.textContent =
                "";


            this
                .closest(".input-wrapper")
                .classList.remove(
                    "error"
                );

        }

    );

}


if (passwordInput) {

    passwordInput.addEventListener(

        "input",

        function () {

            passwordError.textContent =
                "";


            this
                .closest(".input-wrapper")
                .classList.remove(
                    "error"
                );

        }

    );

}