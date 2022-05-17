<?php
$email = $_GET["email"];

// Create (connect to) SQLite database in file
$db = new PDO('sqlite:/var/www/data/roary.db');

// Set errormode to exceptions
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


$stm = $db->prepare("SELECT title, message, time FROM messages WHERE title = :email ORDER BY time DESC;");   
$stm->execute([':email' => $email]);
$result = $stm->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($result);
?>