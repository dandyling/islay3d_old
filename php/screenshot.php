<?php
// Code to output screenshot for previewer

if(isset($_POST["data"]) && !empty($_POST["data"])){
	// Get the data
	$imageData=$_POST['data'];
	
	// Remove the headers (data:,) part.
	// A real application should use them according to needs such as to check image type
	$filteredData=substr($imageData, strpos($imageData, ",")+1);
	
	// Need to decode before saving since the data we received is already base64 encoded
	$unencodedData=base64_decode($filteredData);
	
	//echo "unencodedData".$unencodedData;
	
	// Save file. This example uses a hard coded filename for testing,
	// but a real application can specify filename in POST variable
	mkdir($_POST["dest"], 0775, true);
	$fp = fopen( $_POST['dest'].$_POST['name'], 'wb' );
	fwrite( $fp, $unencodedData);
	fclose( $fp );
}

?>