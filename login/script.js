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


//--------------------------------------------------------------------------------//
//--------------------GRABBING IMPORTANT ELEMENTS FOR WORKING WITH LOGIN FORM----//

let usernameInput = document.getElementsByClassName("username")[0];
let passwordInput = document.getElementsByClassName("password")[0];
let submitButton = document.getElementsByClassName("submit")[0];

submitButton.addEventListener('click',()=>{
    let usernameValue = usernameInput.value.trim();
    let passwordValue = passwordInput.value.trim();

    fetch("http://rajeevpandey.tech/jsiq/api/login.php", {
      method: "POST",
      headers: {"content-type":"application/json"},
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue,
      }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status) {
          window.location = "http://rajeevpandey.tech/jsiq/admin-pages/index.html";
        }
      });
})