let getStartedButton = document.getElementsByClassName("get-started-button")[0];

let logo = document.getElementsByClassName("logo")[0];

let logoContainer = document.getElementsByClassName("logo-container")[0];


//clear the localStorage whenever someone visits the homepage
localStorage.clear();

getStartedButton.addEventListener("click",()=>{


    //this class containes animation to cover the whole screen
    logo.className="logo-cover";


    //remove flex properties from parent, flex properties were hindering the animation
    logoContainer.style.flex="unset"
    logoContainer.style.alignItems="unset"
    logoContainer.style.justifyContent="unset"
    console.log(logoContainer);

    setTimeout(()=>{
        window.location="./quiz-page/index.html";
    },2000);
})