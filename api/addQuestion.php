<?php

//receiving the question object

$sendToClient=[];

$questionObjectJSON = file_get_contents("php://input");


$loginStatus = file_get_contents("./loginStatus.txt");

if($loginStatus==="true"){

    $questionObject = json_decode($questionObjectJSON);

    if(strpos($questionObject->url,"http")===false){
        $questionObject->url = "http://".$questionObject->url;
    }

    if(strpos($questionObject->url,"youtu")!==false){
        $questionObject->type="video";
    }else{
        $questionObject->type="article";
    }


    $fileContents = json_decode(file_get_contents("../json-generator/questions.json"));


    $fileContents[] = $questionObject;

    file_put_contents("../json-generator/questions.json",json_encode($fileContents));

    $sendToClient['status']=true;
    
    }else{

        $sendToClient['status']=false;

    }
    echo json_encode($sendToClient);

?>