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

//--------------------------------------------------------------------------//

//------------------------------DOM ELEMENTS----------------------------//

let topicInput = document.getElementsByClassName("topic-input")[0];

let topicLabel = document.getElementsByClassName("topic-label")[0];

let resetButton =document.getElementsByClassName("reset-button")[0];

//ul that contains the result of the search
let itemContainer = document.getElementsByClassName("suggested-topics")[0];

//a ul that contains list of links
let suggestedLinksContainer = document.getElementsByClassName("suggested-links")[0];


//----------------------------------------GLOBALS---------------------------//

//an array that holds all the unique topics
//it will be calculated once we get all the questions from the server
let topicListArray = [];

//----------------------------------------FUNCTIONS---------------------------//
//function to shuffle an array
const shuffle = (array)=>{
    for(let i=0;i<array.length;i++){
        let randomIndex = Math.floor(Math.random()*array.length);
       
        let temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
}

//the following function generates the list of topic present in the database
let generateTopicListArray = (allQuestions)=>{
    //since we need unique values, we use set
    let topicSet = new Set();


    //we loop through all the objects and all the topics
    //and insert them into the set
    for(let i=0;i<allQuestions.length;i++){
        //if the topics sections is null skip it
        //since it will cause errors
        if(allQuestions[i].topics){
            for(let j=0;j<allQuestions[i].topics.length;j++){
                topicSet.add(allQuestions[i].topics[j]);
            }
        }
    }
    //then we assign the set into the topicListArray(global variable)
    topicListArray = [...topicSet];

};


//a function that adds links to the suggestLinks UL
const addLinksToList = (topicName)=>{
    //array to hold selected links
    selectedLinks = [];

    //loop though all the questions
    //if the target topic is present, push it into selectedLinks array
    for(let i=0;i<allQuestions.length;i++){
        
        if(allQuestions[i].topics){
            if(allQuestions[i].topics.includes(topicName)){
                let linkObject = {
                    url:allQuestions[i].url,
                    type:allQuestions[i].type
                }
                selectedLinks.push(linkObject);
            }
        }
        
    }

    //now we will render all of these links into suggestedLinksContainer UL

    for(let i=0;i<selectedLinks.length;i++){
        let newLi = document.createElement("li");

        let linkNumber = document.createElement("p");
        linkNumber.innerText=String(i+1);
        linkNumber.className="link-number";

        let linkTypeIcon = "";
        if(selectedLinks[i].type==="video"){
            linkTypeIcon = document.createElement('i');
            linkTypeIcon.className="fab fa-youtube";
        }else{
            linkTypeIcon = document.createElement('i');
            linkTypeIcon.className="far fa-file-alt";
            
        }

        let linkValue = document.createElement("a");
        linkValue.className="link-value"
        linkValue.innerText=`${selectedLinks[i].url.substr(0,40)}...`;
        linkValue.setAttribute("href",`${selectedLinks[i].url}`);
        linkValue.setAttribute("target","__blank")

        let practiceButton = document.createElement("button");
        practiceButton.className="practice-button";
        practiceButton.innerText="Practice";
        
        //add an event listener
        practiceButton.addEventListener('click',addLinkToLocalStorage);

        //now append all of these to the newLi

        newLi.appendChild(linkNumber);
        newLi.appendChild(linkTypeIcon);
        newLi.appendChild(linkValue);
        newLi.append(practiceButton);


        //now append the newLi to suggestLinksContainer
        suggestedLinksContainer.appendChild(newLi);

    }
    
}

//a function to add links to localStorage, for it to be accessed
//by the quiz page
const addLinkToLocalStorage = (e)=>{

    //the event is fired by the button, and we need the links inside the a tag
    let url = e.target.parentNode.querySelector(".link-value").getAttribute("href");
    console.log(url);

    //we also need to clear the localStorage, so that the quiz page doesn't
    //see conflicting values (i,e. if we inserted to practiceByTopic as well)
    localStorage.clear();

    //now add the link/url

    localStorage.setItem("linkToPractice",String(url));

    //once the link has been set, move to the quiz-page to see questions
    window.location="../quiz-page/index.html";
}

//event handler if find button is clicked
const showLinks = (e)=>{

    //clear the list, so we don't accidently append to the existing html
    suggestedLinksContainer.innerHTML="";
    //get the value that 
    let selectedTopic = e.target.parentNode.getElementsByClassName("item-name")[0].innerText;

    //then convert it to lower case, since it is the format in which we are storing data
    selectedTopic = selectedTopic.toLowerCase();

    //find the links and insert them into suggestedLinksContainer
    addLinksToList(selectedTopic);
    //hide the div that contains list of topics
    itemContainer.style="display:none";


    //insert those links into the suggestedLinksContainer
    
    //show the links for selected topics
    suggestedLinksContainer.className="suggested-links-shown";

}

//a function to call the api and get all questions
//it also
/* 
1.Shuffles the array
2.Generates a list of unique topics
*/

async function getAllQuestions(){
    let response = await fetch("http://rajeevpandey.tech/jsiq/api/getAllQuestions.php");
    let responseJSON = await response.json();

    //once you get the data, assign it to allQuestions variable
    allQuestions = responseJSON;
    console.log("allQuestions",allQuestions);
    //shuffle the array to get random order of questions
    shuffle(allQuestions);    
    generateTopicListArray(allQuestions);
    console.log("topicsListArray",topicListArray);
}



//--------------------------------------CALLING THE API----------------//


getAllQuestions();


//-------------------------RELATED TO THE INPUT BOX ANIMATION-----------//

//the label would be on top
//When the input is empty

//we can check if the input is empty or not
//when the input is being focused or blurred
//one additional case would be when we clear the input using reset
//then we have manually assign the label-bottom property


topicInput.addEventListener("focus",(e)=>{
    if(topicInput.value===""){
        topicLabel.className="topic-label label-top"
    }
})

topicInput.addEventListener("blur",(e)=>{
    if(topicInput.value===""){
        topicLabel.className="topic-label label-bottom"
    }
})

resetButton.addEventListener("click",()=>{
    
    topicInput.value="";
    topicLabel.className="topic-label label-bottom";

    //-----------------------------------------------------------------------

    
    //hide the suggestLinksContainer
    suggestedLinksContainer.className="suggested-links-hidden";
    //show the ul that contains topic list
    itemContainer.style="display:block";

    //------------------------------------------------------------------------


})

//----------------------------------------------------------------------//

topicInput.addEventListener("input",(e)=>{
    console.log("input event fired");
    console.log(e);

    //if the user is changing the input while links are still being shown
    //then that means he wants to search other topics
    //for that
    //if input is changed that means we have to show topic list
    //(if it got hidden because of previous actions)
    itemContainer.style="display:block";
    // and hide the link list
    //(if it is being shown because of previous actions)
    suggestedLinksContainer.className="suggested-links-hidden";

    let targetValue = e.target.value.toLowerCase();

    targetValue = targetValue.trim();

    if(targetValue===""){
        console.log("target empty");
        itemContainer.innerHTML="";
    }else{
        console.log("target not empty", targetValue);
        let matchedValues = topicListArray.filter((topic)=>{
            return topic.includes(targetValue);
        })

        renderList(matchedValues);
    }
})

//-------------------------------------------------------------------------//




//----------------------------------------------------------------------------//


//---------------------RENDERING SEARCH RESULTS-------------------------------//



//this function will render topics to the UI
//we have to provide an array to it
let renderList = (list)=>{

    //clear the previous list before rendering new
    itemContainer.innerHTML="";

    //a variable that will be used to indicate item number
    let counter=0;

    for(let i=0;i<list.length;i++){

        //first increment the counter
        counter++;

        let newLi = document.createElement("li");
        newLi.className="list-item";

        let itemNumber = document.createElement("p");
        itemNumber.className="item-number";
        itemNumber.innerText = String(counter);

        let itemName = document.createElement("p");
        itemName.className="item-name";
        itemName.innerText =list[i];

        let findResourcesButton = document.createElement("button");
        findResourcesButton.className="item-practice-button";
        findResourcesButton.innerText ="Find";
        findResourcesButton.addEventListener("click",showLinks);


        newLi.appendChild(itemNumber);
        newLi.appendChild(itemName);
        newLi.appendChild(findResourcesButton)

        itemContainer.appendChild(newLi);
    }
}