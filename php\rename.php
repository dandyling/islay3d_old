<?php
if(isset($_POST["oldName"]) && !empty($_POST["oldName"])){
	rename($_POST["oldName"], $_POST["newName"]);
}
?>
