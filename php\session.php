<?php
session_start();

if(isset($_POST['key']) && !empty($_POST['key'])){
	$_SESSION[$_POST['key']] = $_POST['value'];
}
?>
