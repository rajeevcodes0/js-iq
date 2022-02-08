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

//grabbing all the elements that we need to change at some point of time

//container of question and everything related
let container = document.getElementsByClassName("container")[0];

let remainingQuestionCounter = document.getElementsByClassName("remaining-questions-counter")[0];

let getRandomButton = document.getElementsByClassName("get-random-button")[0];

let questionStatement = document.getElementsByClassName("question-statement")[0];

let codeContainer = document.getElementsByClassName("code-container")[0];

let code = document.getElementsByTagName("code")[0];

//heading that gives context of the quiz
//i.e,showing all questions, showing questions from a topic, showing questions from a link

let contextHeading = document.getElementsByClassName("context-heading")[0];
//---------------------------------------------------------------------
//URL Related
let urlContainer = document.getElementsByClassName("url-container")[0];

let urlValue = document.getElementsByClassName("url-value")[0];

let urlCopyButton = document.getElementsByClassName("url-copy-button")[0];
//-------------------------------------------------------------------------

//Topic Related
let topicsContainer = document.getElementsByClassName("topics-container")[0];

let topicList = document.getElementsByClassName("topic-list")[0];

//----------------------------------------------------------------------------


//hint related
let hintsContainer = document.getElementsByClassName("hints-container")[0];
let hintValue = document.getElementsByClassName("hint-value")[0];

//---------------------------------------------------------------------------


//the > button that toggles the isDetailShown variable
let toggleButton = document.getElementsByClassName("toggle-button")[0];

//the details container div
let details= document.getElementsByClassName("details")[0];


//-----------------------------------------------------------------------------
//Global Variables

//a boolean variable that stores if the detail is being shown
//it is responsible for showing details and rotating toggle button

let isDetailShown = false;

let allQuestions = null;

let questionNumber = 0;


//adding an event listener to show/hide details section
toggleButton.addEventListener("click",()=>{
    if(isDetailShown){
        toggleButton.className="toggle-button";
        isDetailShown=false;
        details.style="display:none";
    }else{
        toggleButton.className="toggle-button-rotated";
        isDetailShown=true;
        details.style="display:block";
    }
    
})

//adding event listener to getRandom button, to show next question

getRandomButton.addEventListener("click",()=>{
    showNextQuestion();
})

//a function to shuffle the array
const shuffle = (array)=>{
    for(let i=0;i<array.length;i++){
        let randomIndex = Math.floor(Math.random()*array.length);
       
        let temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
}

const showNextQuestion = ()=>{

    //incase we have revised all the questions, the questions set is shuffled again 
    //and value question number is set to zero
    //it starts again
    if(questionNumber===allQuestions.length){
        shuffle(allQuestions);
        questionNumber=0;

    }

    remainingQuestionCounter.innerText = `Remaining:${allQuestions.length-questionNumber-1}`

    console.log("about to show questions");
    if(allQuestions[questionNumber].questionStatement!==null){
        console.log("question block");
        questionStatement.style = "display:block";
        console.log(allQuestions[questionNumber]);
        questionStatement.innerText = allQuestions[questionNumber].questionStatement;
    }else{
        console.log("question none");
        questionStatement.style = "display:none";
    }

    if(allQuestions[questionNumber].code!==null){
        codeContainer.style = "display:block";
        code.innerText = allQuestions[questionNumber].code;
    }else{
        codeContainer.style = "display:none";
    }

    if(allQuestions[questionNumber].url!==null){
        urlContainer.style = "display:block";
        urlValue.innerText = allQuestions[questionNumber].url;
    }else{
        urlContainer.style = "display:none";
    }

    if(allQuestions[questionNumber].topics!==null){
        topicsContainer.style = "display:block";
        
        //reset the ul element so we can insert new topic li elements
        topicList.innerHTML="";
        //then insert new li elements as topics
        for(let i=0;i<allQuestions[questionNumber].topics.length;i++){
            let newLi = document.createElement("li");
            newLi.innerText = allQuestions[questionNumber].topics[i];
            topicList.appendChild(newLi);
        }
        
    }else{
        topicsContainer.style = "display:none";
    }

    if(allQuestions[questionNumber].hints!==null){
        hintsContainer.style = "display:block";
        hintValue.innerText = allQuestions[questionNumber].hints;
    }else{
        hintsContainer.style = "display:none";
    }


    //increment the question number to show next question
    questionNumber++;
}

//async function to get all questions from the server

async function getAllQuestions(){
    let response = await fetch("http://rajeevpandey.tech/jsiq/api/getAllQuestions.php");
    let responseJSON = await response.json();

    //once you get the data, assign it to allQuestions variable
    allQuestions = responseJSON;
    //shuffle the array to get random order of questions

    //now we have to check if there is no instruction in localStorage to
    //show questions of a particular type

    let linkToPractice="";
    console.log("Hi");
    if(localStorage.getItem("linkToPractice")){
        linkToPractice=localStorage.getItem("linkToPractice");

        allQuestions = allQuestions.filter((question)=>{
            return question.url===linkToPractice;
        })
    }

    let topicToPractice="";
    if(localStorage.getItem("topicToPractice")){
        //get the topic name to practice
        topicToPractice=localStorage.getItem("topicToPractice");
        console.log(topicToPractice);
        //filter out the questions that contain this topic
        allQuestions = allQuestions.filter((question)=>{
            //we must first check if question.topics is not null
            //only then we can use includes
            return question.topics && question.topics.includes(topicToPractice);
        })

    }

    //show the heading, what type of questions are being shown
    if(linkToPractice){
        contextHeading.innerHTML="Showing Questions For A Link";
    }else if(topicToPractice){
        contextHeading.innerHTML=`Showing Questions For ${topicToPractice}`;
    }

    console.log(allQuestions);
    
    shuffle(allQuestions);
    
    showNextQuestion();
    console.log("this is line 194");
}

getAllQuestions();