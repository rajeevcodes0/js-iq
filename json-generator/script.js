let questionStatementInput = document.getElementsByClassName("question-statement-input")[0];

let urlInput = document.getElementsByClassName("url-input")[0];

let codeInput = document.getElementsByClassName("code-input")[0];

//---------------------------------------------------------------------------------
let selectedTopicsList = document.getElementsByClassName("selected-topics-list")[0];

let topicsInput = document.getElementsByClassName("topics-input")[0];

let topicsSuggestion = document.getElementsByClassName("topic-suggestions")[0];
//----------------------------------------------------------------------------------


let urlTitleInput = document.getElementsByClassName("url-title-input")[0];

let hintsInput = document.getElementsByClassName("hints-input")[0];

let textArea = document.getElementsByClassName("json-value")[0];


let generateJSONButton = document.getElementsByClassName("generate-json-button")[0];

let resetButton = document.getElementsByClassName("reset-button")[0];


let lockButtons = document.getElementsByClassName("lock-button");

let copyButton = document.getElementsByClassName("copy-button")[0];

let addToFileButton = document.getElementsByClassName("add-to-file-button")[0];

//-----------------------------------------------------------------------------
//Global Variables

//this variable contains the new question as an object, it must be global
//so that it can be sent to the server when 'add to file' button is clicked
let newQuestionObject = null;

//this array contains all the question objects
let allQuestions=[];



//This array contains the list of arrays
let topicListArray = [];

//the following function generates the list of topic present in the database
let generateTopicListArray = ()=>{
    //since we need unique values, we use set
    let topicSet = new Set();

    //we loop through all the objects and all the topics
    //and insert them into the set
    for(let i=0;i<allQuestions.length;i++){
        for(let j=0;j<allQuestions[i].topics.length;j++){
            topicSet.add(allQuestions[i].topics[j]);
        }
    }
    //then we assign the set into the topicListArray
    topicListArray = [...topicSet];

    console.log(topicListArray);
};

let getAllQuestions = async()=>{
    let response = await fetch("http://rajeevpandey.tech/jsiq/api/getAllQuestions.php");
    let responseJSON = await response.json();

    //assign the data received to the allQuestions array
    allQuestions = responseJSON;
    //once we get the data, we can now generate our topics list array
    generateTopicListArray();
}

let selectedTopicLiOnClickHandler = (e)=>{
    //we simply remove the element,
    //for that we need its parent element
    let parentOfTarget = e.target.parentNode;
    parentOfTarget.removeChild(e.target);

    //now we focus back on our input, so that we can write more topics
    topicsInput.focus();
}



//adding event listers to lockButtons
for(let i=0;i<lockButtons.length;i++){
    lockButtons[i].addEventListener("click",(e)=>{


        let targetInput = e.target.parentNode.parentNode.getElementsByClassName("input")[0];
        
        console.log(targetInput);
        console.log(targetInput.getAttribute('disabled'))
        if(targetInput.getAttribute('disabled')===""){
            console.log("this")
            targetInput.disabled = false;
            e.target.innerText = "🔓";
        }else{
            console.log("That");
            targetInput.disabled = true;
            e.target.innerText = "🔒";
        }
    })
}


//adding suggestion to hintsInput, when the user hits , the value is added to ul element
topicsInput.addEventListener("input",(e)=>{
    let currentValue = e.target.value;
    let lastCharacter = e.target.value[currentValue.length-1];

    //first we clear the suggestion
    topicsSuggestion.innerText="";
    //then
    //we suggest existing topics that match with our current value
    for(let i=0;i<topicListArray.length;i++){
        //if our query string is matched with any we sit the value
        //then we break from out loop
        //if have added the && condition so that we don't suggest if there is no string
        if(topicListArray[i].includes(currentValue) && currentValue!==""){
            topicsSuggestion.innerText=topicListArray[i];
            break;
        }
    }

    //if the last character is ',' then the user is selecting it.
    if(lastCharacter===','){
        //first we remove the comma, since it is not to be present in topic name
        //since it is a string and not an array, we use slice and not pop
        //remember that the endIndex is not included
        currentValue = currentValue.slice(0,currentValue.length-1);
        //now we should check if the entered value is empty, if it is
        //then we return
        currentValue = currentValue.trim();

        //if the currentValue is empty then we don't have to do anything, we should return
        //if it is not empty, then we inter the value into the topic list ul

        if(currentValue!==""){


            //since we don't want values to be repeated, we first insert all the previous values
            //in the set, then we insert the current value in the same set

            let allSelectedTopicsLi = document.querySelectorAll(".selected-topics-list li");


            let selectedTopicsSet = new Set();


            //first we insert old values
            for(let i=0;i<allSelectedTopicsLi.length;i++){
                selectedTopicsSet.add(allSelectedTopicsLi[i].innerText);
            }

            console.log("after taking values",selectedTopicsSet);

            //then we insert the current value
            selectedTopicsSet.add(currentValue);

            console.log("after adding current",selectedTopicsSet);



            //before inserting into the ul, we must first clear it
            selectedTopicsList.innerHTML="";
            //now we insert all the unique(set values) values into the ul
            selectedTopicsSet.forEach((setItem)=>{
                let newLi = document.createElement("li");
                newLi.innerText = setItem;
                newLi.addEventListener("click",selectedTopicLiOnClickHandler);
                selectedTopicsList.appendChild(newLi);
            })

            //then clear the value into the input field
            topicsInput.value="";

        }
        
        

    }
    console.log("last char", lastCharacter);
})

addToFileButton.addEventListener("click",async ()=>{

    console.log("clicked!!!!!!!!1");
    //if the newQuestionObject is null return, since there is nothing to post
    if (!newQuestionObject) {
      return;
    }
    
    //send object to the server
    let response = await fetch("http://rajeevpandey.tech/jsiq/api/addQuestion.php",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(newQuestionObject)
    })

    console.log("this line has been executed");

    console.log(response);

    // let responseData = await response.json();

    // console.log(responseData);

    // if(responseData.status){
    //     //show notification that its added
    // }else{
    //     //show that operation failed
    // }
    addToFileButton.disabled=true;
})

copyButton.addEventListener("click",()=>{
    console.log("clicked");
    if(!navigator.clipboard){
        
        return;
    }
    const valueToCopy = textArea.value;

    try{
        navigator.clipboard.writeText(valueToCopy);
        textArea.value="Copied To Clipboard";
    }catch{
        console.error("Failed To Copy",err);
    }

    //disable the copy button once the item has been copied
    copyButton.disabled = true;
})

generateJSONButton.addEventListener('click',(e)=>{

    //before we move further we need to convert our selected topics to string
    //and assign it to the input value
    //so that it can be sent to the server
    //we convert it to array so we can use Map(), it is nodeList as of now
    let allSelectedTopicsLi = [...document.querySelectorAll(".selected-topics-list li")];
    let allSelectedTopicsLiStringArray = allSelectedTopicsLi.map((li)=>{
        return li.innerText;
    })

    let allSelectedTopicsLiStringJoined = allSelectedTopicsLiStringArray.join(",");
    console.log(allSelectedTopicsLiStringJoined);
    //assign null if nothing is present in the input field, if something is present better to trim the values
    let questionStatement = questionStatementInput.value?questionStatementInput.value.trim():null;
    let url = urlInput.value?urlInput.value.trim():null;
    let code = codeInput.value?codeInput.value:null;
    let topics = allSelectedTopicsLiStringJoined? allSelectedTopicsLiStringJoined.split(","):null;
    let urlTitle = urlTitleInput.value?urlTitleInput.value.trim():null;
    let hints = hintsInput.value? hintsInput.value.trim():null;


    //trimming all the values that are in array
    //of course, we can access map if the arrays are not null
    if(topics){
        topics = topics.map((topic)=>{
            return topic.trim();
        })
    }
    /*---------------------------------------------*/

    //creating a new object from the values
    newQuestionObject = {
        questionStatement,
        url,
        code,
        topics,
        urlTitle,
        hints
    }

    //pretty print the values in the textbox
    textArea.value = JSON.stringify(newQuestionObject,null,'\t');

    //enable the copy button once the JSON has been added to the textbox
    copyButton.disabled = false;
    addToFileButton.disabled = false;
})


//reset all the fields that are not locked
resetButton.addEventListener("click",()=>{

    //since we have extra features in the topics input section
    //we need to add extra code
    
    //to check if we have to clear topics section or not,
    //we need to first check if we have 'disabled' on topicsInput or not
    //if it is disabled, we won't clear the selected list, else we will

    //if disabled is present, we get the "" value, otherwise null
    if(topicsInput.getAttribute("disabled")===null){
        //we want to clear the list if disabled is not present,
        //and in this case it is present
        selectedTopicsList.innerHTML="";
    }


    //get all the input fields
    let inputFields = document.getElementsByTagName("input");
    // console.log(inputFields);

    for(let i=0;i<inputFields.length;i++){
        console.log(inputFields[i].getAttribute("disabled"))
        if(!(inputFields[i].getAttribute("disabled")==="")){
            console.log(inputFields[i]);
            inputFields[i].value="";
        }
    }
})

getAllQuestions();