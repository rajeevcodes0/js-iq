<?php
$allQuestions = file_get_contents("../json-generator/questions.json");


header('content-type:application/json');
echo $allQuestions;
?>