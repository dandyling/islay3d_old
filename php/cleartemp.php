<?php
session_start();

$files = glob('../users/'.$_SESSION['pid'].'/player.png'); // get all file names
foreach($files as $file){ // iterate files
  if(is_file($file))
    unlink($file); // delete file
}
?>