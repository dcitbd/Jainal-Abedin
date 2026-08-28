/* =====================================================
   REVIEWS PAGE JAVASCRIPT
   PART 1
===================================================== */


/* =====================================================
   DOM
===================================================== */

const jaReviewGrid =
document.getElementById(
"jaReviewGrid"
);

const jaReviewSearch =
document.getElementById(
"jaReviewSearch"
);

const jaReviewCountry =
document.getElementById(
"jaReviewCountry"
);

const jaReviewSkill =
document.getElementById(
"jaReviewSkill"
);

const jaReviewRating =
document.getElementById(
"jaReviewRating"
);

const jaReviewType =
document.getElementById(
"jaReviewType"
);

const jaReviewPagination =
document.getElementById(
"jaReviewPagination"
);

const jaReviewLoader =
document.getElementById(
"jaReviewLoader"
);

const jaReviewTop =
document.getElementById(
"jaReviewTop"
);

const jaReviewMenu =
document.getElementById(
"jaReviewMenu"
);

const jaReviewMobileNav =
document.getElementById(
"jaReviewMobileNav"
);

const jaReviewTheme =
document.getElementById(
"jaReviewTheme"
);





/* =====================================================
   LOADER
===================================================== */

window.addEventListener(

"load",

function(){

setTimeout(function(){

if(jaReviewLoader){

jaReviewLoader.classList.add(
"ja-review-loader-hidden"
);

}

},600);

});





/* =====================================================
   MOBILE MENU
===================================================== */

if(
jaReviewMenu &&
jaReviewMobileNav
){

jaReviewMenu.addEventListener(

"click",

function(){

jaReviewMobileNav.classList.toggle(
"ja-review-mobile-open"
);

}

);

}





/* =====================================================
   DARK MODE
===================================================== */

if(jaReviewTheme){

const savedTheme =
localStorage.getItem(
"theme"
);

if(savedTheme==="dark"){

document.body.classList.add(
"dark-mode"
);

}

jaReviewTheme.addEventListener(

"click",

function(){

document.body.classList.toggle(
"dark-mode"
);

localStorage.setItem(

"theme",

document.body.classList.contains(
"dark-mode"
)
?
"dark"
:
"light"

);

}

);

}





/* =====================================================
   HEADER SHADOW
===================================================== */

window.addEventListener(

"scroll",

function(){

const header =
document.querySelector(
".ja-review-header"
);

if(!header){

return;

}

if(window.scrollY>40){

header.style.boxShadow =
"0 12px 40px rgba(0,0,0,.08)";

}

else{

header.style.boxShadow =
"none";

}

}

);





/* =====================================================
   BACK TO TOP
===================================================== */

if(jaReviewTop){

jaReviewTop.addEventListener(

"click",

function(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}

);

}





/* =====================================================
   REVIEW DATA
===================================================== */

let reviews = [

{

name:"Michael Johnson",

country:"Russia",

type:"International",

rating:5,

skill:"Web Design",

company:"Techno World",

source:"Upwork",

date:"2026",

review:"Outstanding work. The website exceeded all expectations with modern UI, responsive design and excellent communication."

},

{

name:"Olivia Smith",

country:"Russia",

type:"International",

rating:5,

skill:"Graphic Design",

company:"Creative Studio",

source:"Fiverr",

date:"2026",

review:"Amazing branding work. Fast delivery and premium quality graphics."

},

{

name:"Daniel Brown",

country:"Russia",

type:"International",

rating:5,

skill:"WordPress",

company:"Business Group",

source:"Freelancer",

date:"2025",

review:"Professional WordPress development with clean code and excellent support."

},

{

name:"Alexander Ivanov",

country:"Russia",

type:"International",

rating:5,

skill:"SEO",

company:"Digital Agency",

source:"Local",

date:"2026",

review:"SEO results were impressive. Rankings improved within weeks."

},

{

name:"Ahmed Al Mansoori",

country:"Dubai",

type:"International",

rating:5,

skill:"UI UX",

company:"Future Tech",

source:"LinkedIn",

date:"2026",

review:"Creative interface, beautiful user experience and excellent workflow."

},

{

name:"Fatima Al Zahra",

country:"Dubai",

type:"International",

rating:5,

skill:"Digital Marketing",

company:"Media Group",

source:"Fiverr",

date:"2026",

review:"Professional digital marketing strategy with measurable business growth."

},

{

name:"Rahim Ahmed",

country:"Bangladesh",

type:"Local",

rating:5,

skill:"E-commerce",

company:"Dream Cart BD",

source:"Local",

date:"2026",

review:"Excellent ecommerce solution. Highly recommended for online businesses."

}

];






/* =====================================================
   PAGINATION SETTINGS
===================================================== */

let filteredReviews = [...reviews];

let currentPage = 1;

const reviewsPerPage = 9;





/* =====================================================
   RENDER REVIEWS
===================================================== */

function renderReviews() {

    if (!jaReviewGrid) {

        return;

    }

    jaReviewGrid.innerHTML = "";

    const start =

        (currentPage - 1) *

        reviewsPerPage;

    const end =

        start +

        reviewsPerPage;

    const currentReviews =

        filteredReviews.slice(

            start,

            end

        );

    if (currentReviews.length === 0) {

        jaReviewGrid.innerHTML = `

            <div class="ja-review-empty">

                <i class="fa-solid fa-comments"></i>

                <h3>

                    No Reviews Found

                </h3>

                <p>

                    Try another search or filter.

                </p>

            </div>

        `;

        return;

    }

    currentReviews.forEach(function(review){

        let stars = "";

        for(

            let i = 1;

            i <= 5;

            i++

        ){

            stars +=

            `<i class="fa-solid fa-star"></i>`;

        }

        jaReviewGrid.insertAdjacentHTML(

            "beforeend",

            `

<article class="ja-review-card">

<div class="ja-review-card-top">

<div class="ja-review-client">

<div class="ja-review-avatar">

<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=2563eb&color=ffffff">

</div>

<div class="ja-review-client-info">

<h3>${review.name}</h3>

<p>${review.company}</p>

<div class="ja-review-country">

${review.country}

</div>

</div>

</div>

<div class="ja-review-verified">

<i class="fa-solid fa-circle-check"></i>

Verified

</div>

</div>

<div class="ja-review-rating">

${stars}

<span>${review.rating}.0</span>

</div>

<p class="ja-review-text">

${review.review}

</p>

<div class="ja-review-tags">

<span class="ja-review-tag">

${review.skill}

</span>

</div>

<div class="ja-review-footer">

<div class="ja-review-type ${review.type.toLowerCase()}">

${review.type}

</div>

<div class="ja-review-date">

${review.date}

</div>

</div>

</article>

`

        );

    });

    renderPagination();

}





/* =====================================================
   SEARCH
===================================================== */

if (jaReviewSearch) {

    jaReviewSearch.addEventListener(

        "input",

        filterReviews

    );

}





/* =====================================================
   FILTER
===================================================== */

if (jaReviewCountry) {

    jaReviewCountry.addEventListener(

        "change",

        filterReviews

    );

}

if (jaReviewSkill) {

    jaReviewSkill.addEventListener(

        "change",

        filterReviews

    );

}

if (jaReviewRating) {

    jaReviewRating.addEventListener(

        "change",

        filterReviews

    );

}

if (jaReviewType) {

    jaReviewType.addEventListener(

        "change",

        filterReviews

    );

}





/* =====================================================
   APPLY FILTER
===================================================== */

function filterReviews(){

    const keyword =

        jaReviewSearch

        ?

        jaReviewSearch.value

        .toLowerCase()

        :

        "";

    const country =

        jaReviewCountry

        ?

        jaReviewCountry.value

        :

        "";

    const skill =

        jaReviewSkill

        ?

        jaReviewSkill.value

        :

        "";

    const rating =

        jaReviewRating

        ?

        jaReviewRating.value

        :

        "";

    const type =

        jaReviewType

        ?

        jaReviewType.value

        :

        "";

    filteredReviews =

        reviews.filter(

            function(review){

                return (

                    (

                        keyword === ""

                        ||

                        review.name

                        .toLowerCase()

                        .includes(keyword)

                        ||

                        review.review

                        .toLowerCase()

                        .includes(keyword)

                    )

                    &&

                    (

                        country === ""

                        ||

                        review.country === country

                    )

                    &&

                    (

                        skill === ""

                        ||

                        review.skill === skill

                    )

                    &&

                    (

                        rating === ""

                        ||

                        review.rating == rating

                    )

                    &&

                    (

                        type === ""

                        ||

                        review.type === type

                    )

                );

            }

        );

    currentPage = 1;

    renderReviews();

}





/* =====================================================
   PAGINATION
===================================================== */

function renderPagination() {

    if (!jaReviewPagination) {

        return;

    }

    jaReviewPagination.innerHTML = "";

    const totalPages =

        Math.ceil(

            filteredReviews.length /

            reviewsPerPage

        );

    if (totalPages <= 1) {

        return;

    }



    /* Previous */

    jaReviewPagination.insertAdjacentHTML(

        "beforeend",

        `

<button
class="ja-review-page-nav"
${currentPage===1?"disabled":""}
onclick="changePage(${currentPage-1})">

<i class="fa-solid fa-angle-left"></i>

Previous

</button>

`

    );



    /* Numbers */

    for (

        let i = 1;

        i <= totalPages;

        i++

    ) {

        jaReviewPagination.insertAdjacentHTML(

            "beforeend",

            `

<button

class="ja-review-page-btn

${

i===currentPage

?

"active"

:

""

}"

onclick="changePage(${i})">

${i}

</button>

`

        );

    }



    /* Next */

    jaReviewPagination.insertAdjacentHTML(

        "beforeend",

        `

<button

class="ja-review-page-nav"

${

currentPage===totalPages

?

"disabled"

:

""

}

onclick="changePage(${currentPage+1})">

Next

<i class="fa-solid fa-angle-right"></i>

</button>

`

    );

}





/* =====================================================
   CHANGE PAGE
===================================================== */

function changePage(page){

    const totalPages =

        Math.ceil(

            filteredReviews.length /

            reviewsPerPage

        );

    if(

        page<1 ||

        page>totalPages

    ){

        return;

    }

    currentPage=page;

    renderReviews();

    window.scrollTo({

        top:420,

        behavior:"smooth"

    });

}





/* =====================================================
   COUNTER
===================================================== */

function animateCounter(

    id,

    end

){

    const element=

        document.getElementById(id);

    if(!element){

        return;

    }

    let value=0;

    const speed=

        Math.max(

            1,

            Math.floor(end/60)

        );

    const timer=

        setInterval(function(){

            value+=speed;

            if(value>=end){

                value=end;

                clearInterval(timer);

            }

            element.innerText=value;

        },20);

}





/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(

"DOMContentLoaded",

function(){

    renderReviews();

    animateCounter(

        "jaTotalReviews",

        reviews.length

    );

    animateCounter(

        "jaHappyClients",

        50

    );

    animateCounter(

        "jaCountries",

        3

    );

    animateCounter(

        "jaAverageRating",

        5

    );

});





/* =====================================================
   AUTO GENERATE MORE REVIEWS
===================================================== */

reviews.push(

{
name:"Alexander Ivanov",
country:"Russia",
type:"International",
rating:5,
skill:"Web Design",
company:"Techno World",
source:"Upwork",
date:"2026",
review:"Outstanding website design with excellent communication and professional support throughout the project."
},

{
name:"Dmitry Petrov",
country:"Russia",
type:"International",
rating:5,
skill:"WordPress",
company:"Creative Vision",
source:"Fiverr",
date:"2026",
review:"Very satisfied with the WordPress development. Fast delivery and high quality work."
},

{
name:"Sergey Volkov",
country:"Russia",
type:"International",
rating:5,
skill:"Graphic Design",
company:"Brand Studio",
source:"Freelancer",
date:"2026",
review:"Creative logo and branding package exceeded our expectations. Highly recommended."
},

{
name:"Ivan Smirnov",
country:"Russia",
type:"International",
rating:5,
skill:"SEO",
company:"Digital Agency",
source:"Upwork",
date:"2026",
review:"SEO optimization significantly improved our search rankings within a short period."
},

{
name:"Mikhail Orlov",
country:"Russia",
type:"International",
rating:5,
skill:"UI UX Design",
company:"Future Apps",
source:"LinkedIn",
date:"2025",
review:"Modern UI/UX design with excellent attention to detail and user experience."
},

{
name:"Nikolai Sokolov",
country:"Russia",
type:"International",
rating:5,
skill:"Digital Marketing",
company:"Media House",
source:"Fiverr",
date:"2026",
review:"Professional marketing strategy that helped us increase online engagement."
},

{
name:"Andrey Kuznetsov",
country:"Russia",
type:"International",
rating:5,
skill:"E-commerce",
company:"Market Pro",
source:"Upwork",
date:"2026",
review:"Excellent ecommerce setup with smooth payment integration and responsive design."
},

{
name:"Pavel Morozov",
country:"Russia",
type:"International",
rating:5,
skill:"Website Maintenance",
company:"IT Solutions",
source:"Local",
date:"2026",
review:"Reliable maintenance service with quick issue resolution and regular updates."
},

{
name:"Kirill Lebedev",
country:"Russia",
type:"International",
rating:5,
skill:"Landing Page",
company:"Startup Hub",
source:"Freelancer",
date:"2025",
review:"Our landing page conversion improved noticeably after the redesign."
},

{
name:"Victor Romanov",
country:"Russia",
type:"International",
rating:5,
skill:"Business Website",
company:"Romanov Group",
source:"Upwork",
date:"2026",
review:"Professional business website delivered on time with excellent communication."
}

);




reviews.push(

{
name:"Ahmed Al Mansoori",
country:"Dubai",
type:"International",
rating:5,
skill:"Web Design",
company:"Future Tech LLC",
source:"LinkedIn",
date:"2026",
review:"Outstanding website design with premium quality. Communication was smooth and delivery was on time."
},

{
name:"Fatima Al Zahra",
country:"Dubai",
type:"International",
rating:5,
skill:"Graphic Design",
company:"Creative Media",
source:"Fiverr",
date:"2026",
review:"Exceptional branding and graphic design. Every detail reflected professionalism."
},

{
name:"Omar Khalid",
country:"Dubai",
type:"International",
rating:5,
skill:"Digital Marketing",
company:"Smart Ads UAE",
source:"Upwork",
date:"2026",
review:"Digital marketing campaign produced excellent engagement and measurable business growth."
},

{
name:"Mohammed Rashid",
country:"Dubai",
type:"International",
rating:5,
skill:"SEO",
company:"Dubai Online",
source:"Freelancer",
date:"2026",
review:"Our website rankings improved significantly after the SEO optimization."
},

{
name:"Sarah Abdullah",
country:"Dubai",
type:"International",
rating:5,
skill:"WordPress",
company:"Elite Business",
source:"LinkedIn",
date:"2025",
review:"Professional WordPress development with clean code and a modern responsive layout."
},

{
name:"Ali Hassan",
country:"Dubai",
type:"International",
rating:5,
skill:"UI UX Design",
company:"Vision Studio",
source:"Upwork",
date:"2026",
review:"The UI and UX exceeded expectations. The interface feels modern, intuitive and user friendly."
},

{
name:"Yousef Ibrahim",
country:"Dubai",
type:"International",
rating:5,
skill:"E-commerce",
company:"Dubai Store",
source:"Fiverr",
date:"2026",
review:"Excellent ecommerce solution with smooth checkout, payment integration and premium design."
},

{
name:"Aisha Noor",
country:"Dubai",
type:"International",
rating:5,
skill:"Business Website",
company:"Noor Holdings",
source:"LinkedIn",
date:"2026",
review:"Professional business website delivered exactly as requested. Highly recommended."
},

{
name:"Khalid Saeed",
country:"Dubai",
type:"International",
rating:5,
skill:"Website Maintenance",
company:"Global Tech",
source:"Local",
date:"2026",
review:"Fast maintenance support with excellent communication and reliable service."
},

{
name:"Maryam Ahmed",
country:"Dubai",
type:"International",
rating:5,
skill:"Landing Page",
company:"Launch UAE",
source:"Upwork",
date:"2026",
review:"Beautiful landing page that increased our conversion rate. Outstanding work from start to finish."
}

);



reviews.push(

{
name:"Md. Rahim Uddin",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Web Design",
company:"Dream Cart BD",
source:"Local Client",
date:"2026",
review:"Excellent website design with a modern layout and responsive performance. Highly recommended."
},

{
name:"Jannatul Ferdous",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Graphic Design",
company:"Creative Zone",
source:"Facebook",
date:"2026",
review:"Beautiful logo and branding design. The work was delivered on time with outstanding quality."
},

{
name:"Hasan Mahmud",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Digital Marketing",
company:"Online Shop BD",
source:"Facebook",
date:"2026",
review:"Professional marketing strategy that significantly increased our online sales."
},

{
name:"Sabbir Hossain",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"SEO",
company:"BD Tech",
source:"Website",
date:"2026",
review:"SEO optimization helped our website rank much higher in search results."
},

{
name:"Nusrat Jahan",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"WordPress",
company:"Education Point",
source:"Referral",
date:"2026",
review:"Professional WordPress website with fast loading speed and excellent design."
},

{
name:"Tanvir Ahmed",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"UI UX Design",
company:"Next Solution",
source:"Facebook",
date:"2026",
review:"Outstanding UI/UX design that greatly improved our user experience."
},

{
name:"Mehedi Hasan",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"E-commerce",
company:"Tech Shop BD",
source:"Messenger",
date:"2026",
review:"Complete ecommerce solution with premium design and secure payment integration."
},

{
name:"Sharmin Akter",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Business Website",
company:"Sharmin Fashion",
source:"Facebook",
date:"2026",
review:"The business website looks premium and works perfectly on all devices."
},

{
name:"Rakibul Islam",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Landing Page",
company:"Launch BD",
source:"WhatsApp",
date:"2026",
review:"High-converting landing page with a clean and modern appearance."
},

{
name:"Farzana Yasmin",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Website Maintenance",
company:"Digital Care",
source:"Local Client",
date:"2026",
review:"Reliable maintenance service with quick updates and excellent technical support."
}

);


reviews.push(

{
name:"Arif Hossain",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Frontend Development",
company:"Code Studio BD",
source:"Facebook",
date:"2026",
review:"Excellent frontend development with clean code, responsive layouts and smooth user interactions."
},

{
name:"Nabila Islam",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Portfolio Website",
company:"Personal Brand",
source:"Messenger",
date:"2026",
review:"The portfolio website looks modern, professional and perfectly represents my personal brand."
},

{
name:"Shakil Ahmed",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Website Redesign",
company:"Digital House",
source:"Referral",
date:"2026",
review:"Our outdated website was transformed into a modern and professional platform."
},

{
name:"Mim Akter",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Landing Page",
company:"Online Academy",
source:"Facebook",
date:"2026",
review:"Beautiful landing page with fast loading speed and significantly improved conversion rate."
},

{
name:"Rashed Karim",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Website Optimization",
company:"Tech Planet",
source:"Website",
date:"2026",
review:"Website performance improved dramatically after optimization. Everything feels much faster."
},

{
name:"Nayeem Hasan",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Responsive Design",
company:"Creative IT",
source:"WhatsApp",
date:"2026",
review:"The website works perfectly on desktop, tablet and mobile devices."
},

{
name:"Samia Rahman",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Brand Identity",
company:"Samia Boutique",
source:"Facebook",
date:"2026",
review:"Professional branding package with a unique logo, colors and marketing materials."
},

{
name:"Abdullah Al Noman",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Social Media Design",
company:"Media Hub",
source:"Messenger",
date:"2026",
review:"Creative social media graphics that greatly increased engagement across all platforms."
},

{
name:"Rifat Chowdhury",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Google Business Profile",
company:"Local Business",
source:"Local Client",
date:"2026",
review:"Google Business Profile was professionally optimized and now attracts many more customers."
},

{
name:"Tasnia Noor",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"E-commerce Management",
company:"Fashion World BD",
source:"Facebook",
date:"2026",
review:"Professional ecommerce management with excellent product organization and customer support."
}

);



reviews.push(

{
name:"Mahmudul Hasan",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"HTML & CSS",
company:"Creative Web BD",
source:"Website",
date:"2026",
review:"Excellent HTML and CSS development with pixel-perfect responsive design and clean structure."
},

{
name:"Sadia Afrin",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"JavaScript",
company:"Tech Academy",
source:"Facebook",
date:"2026",
review:"Interactive JavaScript features were implemented professionally and improved user experience."
},

{
name:"Imran Hossain",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Admin Dashboard",
company:"Business ERP",
source:"Referral",
date:"2026",
review:"The admin dashboard is modern, easy to use and perfectly organized for daily management."
},

{
name:"Mst. Rima Akter",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Portfolio Design",
company:"Personal Brand",
source:"Messenger",
date:"2026",
review:"A premium portfolio website that beautifully showcases my work and professional experience."
},

{
name:"Saiful Islam",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Website Speed Optimization",
company:"Online Service BD",
source:"Local Client",
date:"2026",
review:"Website speed improved dramatically after optimization, resulting in a much better user experience."
},

{
name:"Tanjina Sultana",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"On-Page SEO",
company:"Business Solution",
source:"Facebook",
date:"2026",
review:"Professional on-page SEO optimization that significantly improved our Google visibility."
},

{
name:"Ashraful Alam",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Google Ads",
company:"Digital Growth",
source:"WhatsApp",
date:"2026",
review:"Google Ads campaigns delivered excellent ROI with targeted traffic and quality leads."
},

{
name:"Sanjida Islam",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Facebook Marketing",
company:"Fashion Store",
source:"Messenger",
date:"2026",
review:"Facebook marketing strategy increased page engagement, followers and product sales."
},

{
name:"Jahidul Karim",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Technical Support",
company:"IT Support Center",
source:"Website",
date:"2026",
review:"Excellent technical support with quick responses, problem solving and reliable communication."
},

{
name:"Nafisa Rahman",
country:"Bangladesh",
type:"Local",
rating:5,
skill:"Complete Digital Solution",
company:"Dream Career IT",
source:"Direct Client",
date:"2026",
review:"Jainal Abedin delivered a complete digital solution including website, branding, SEO and marketing. Professional, reliable and highly recommended for any business."
}

);




