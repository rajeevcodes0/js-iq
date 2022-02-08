//-------------------------------HAMBURGER MENU----------------------------//

let overlay = document.getElementsByClassName("overlay")[0];

let sideDrawer = document.getElementsByClassName("side-drawer")[0];

let hamburgerMenuOpenButton = document.getElementsByClassName("hamburger-menu-open-button")[0];

let hamburgerMenuCloseButton = document.getElementsByClassName("hamburger-menu-close-button")[0];


overlay.addEventListener("click",()=>{
    overlay.style="display:none";
})

sideDrawer.addEventListener("click",(e)=>{
    e.stopPropagation();
})

hamburgerMenuOpenButton.addEventListener("click",()=>{
    overlay.style = "display:flex";
})

hamburgerMenuCloseButton.addEventListener("click",(e)=>{
    e.stopPropagation();
    overlay.style = "display:none";
})