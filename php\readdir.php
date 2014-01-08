<?php
// Open directory is from location of current script
	$dir = opendir($_POST["path"]);
	
	//List files in images directory
	while (($file = readdir($dir)) !== false) {
	  	echo $file.",";
	}
	closedir($dir);
?>

