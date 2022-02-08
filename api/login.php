<?php
$dataJSON = file_get_contents("php://input");

$dataObject = json_decode($dataJSON);

file_put_contents("log.txt",json_encode($dataObject));

if($dataObject->username==="rajeev" && $dataObject->password==="admin123"){
    file_put_contents("./loginStatus","true");
}else{
    file_put_contents("./loginStatus.txt","false");
}


$sendToClient = array("status"=>'true');

// file_put_contents("log.txt",json_encode($sendToClient));

header("content-type:application/json");

echo json_encode($sendToClient);
?>