<?php
$host = "localhost";
$user = "root"; // default for XAMPP
$pass = "";
$dbname = "enrollment_db"; // change this to your actual DB name

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
