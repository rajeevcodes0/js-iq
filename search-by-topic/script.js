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


//------------------------------DOM ELEMENTS----------------------------//

let topicInput = document.getElementsByClassName("topic-input")[0];

let topicLabel = document.getElementsByClassName("topic-label")[0];

let resetButton =document.getElementsByClassName("reset-button")[0];

//ul that contains the result of the search
let itemContainer = document.getElementsByClassName("suggested-topics")[0];

console.log(itemContainer);



//----------------------------------------GLOBALS---------------------------//

//an array that holds all the unique topics
//it will be calculated once we get all the questions from the server
let topicListArray = [];

//EXTRA
let allQuestions = [];

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

const addTopicToLocalStorage = (e)=>{
    //clear the localStorage before inserting new value,
    //since old values from other pages might cause issues
    localStorage.clear();
    
    let parentNode = e.target.parentNode;


    let itemNameNode = parentNode.querySelector(".item-name");

    let value = itemNameNode.innerText.toLowerCase();
    console.log(value);

    //store it to localStorage
    localStorage.setItem("topicToPractice",value);

    //once the topic has been added, go to quiz page
    window.location="../quiz-page/index.html";

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

})

//----------------------------------------------------------------------//

topicInput.addEventListener("input",(e)=>{
    console.log("input event fired");
    console.log(e);
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

        let itemPracticeButton = document.createElement("button");
        itemPracticeButton.className="item-practice-button";
        itemPracticeButton.innerText ="Practice";
        itemPracticeButton.addEventListener("click",addTopicToLocalStorage);


        newLi.appendChild(itemNumber);
        newLi.appendChild(itemName);
        newLi.appendChild(itemPracticeButton)

        itemContainer.appendChild(newLi);
    }
}