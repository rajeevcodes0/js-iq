<?php
file_put_contents("./loginStatus","false");

$sendToClient = array("status"=>true);

header("content-type:application/json");

echo json_encode($sendToClient);
?>