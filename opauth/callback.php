<?php
/**
 * Callback for Opauth
 *
 * This file (callback.php) provides an example on how to properly receive auth response of Opauth.
 *
 * Basic steps:
 * 1. Fetch auth response based on callback transport parameter in config.
 * 2. Validate auth response
 * 3. Once auth response is validated, your PHP app should then work on the auth response
 *    (eg. registers or logs user in to your site, save auth data onto database, etc.)
 *
 */

require_once ('PhpConsole.php');
PhpConsole::start();

/**
 * Define paths
 */
define('CONF_FILE', dirname(__FILE__) . '/' . 'opauth.conf.php');
define('OPAUTH_LIB_DIR', dirname(__FILE__) . '/lib/Opauth/');

/**
 * Load config
 */
if (!file_exists(CONF_FILE)) {
	trigger_error('Config file missing at ' . CONF_FILE, E_USER_ERROR);
	exit();
}
require CONF_FILE;

/**
 * Instantiate Opauth with the loaded config but not run automatically
 */
require OPAUTH_LIB_DIR . 'Opauth.php';
$Opauth = new Opauth($config, false);

/**
 * Fetch auth response, based on transport configuration for callback
 */
$response = null;

switch($Opauth->env['callback_transport']) {
	case 'session' :
		session_start();
		$response = $_SESSION['opauth'];
		unset($_SESSION['opauth']);
		break;
	case 'post' :
		$response = unserialize(base64_decode($_POST['opauth']));
		break;
	case 'get' :
		$response = unserialize(base64_decode($_GET['opauth']));
		break;
	default :
		echo '<strong style="color: red;">Error: </strong>Unsupported callback_transport.' . "<br>\n";
		break;
}

/**
 * Check if it's an error callback
 */
if (array_key_exists('error', $response)) {
	echo "<pre>";
	print_r($response);
	echo "</pre>";
	echo '<strong style="color: red;">Authentication error: </strong> Opauth returns error auth response.' . "<br>\n";

}

/**
 * Auth response validation
 *
 * To validate that the auth response received is unaltered, especially auth response that
 * is sent through GET or POST.
 */
else {
	if (empty($response['auth']) || empty($response['timestamp']) || empty($response['signature']) || empty($response['auth']['provider']) || empty($response['auth']['uid'])) {
		echo '<strong style="color: red;">Invalid auth response: </strong>Missing key auth response components.' . "<br>\n";
	} elseif (!$Opauth -> validate(sha1(print_r($response['auth'], true)), $response['timestamp'], $response['signature'], $reason)) {
		echo '<strong style="color: red;">Invalid auth response: </strong>' . $reason . ".<br>\n";
	} else {
		echo '<strong style="color: green;">OK: </strong>Auth response is validated.  Returning back to main window' . "<br>\n";

		/**
		 * It's all good. Go ahead with your application-specific authentication logic
		 */
		echo '<script>', 'var data = ',  json_encode($response), ';', 'console.log(data);', 'localStorage.setItem(\'data\', JSON.stringify(data));', 'setTimeout(window.close, 2000);', '</script>';

		/**
		 * Auth response dump
		 */
		$provider = $response['auth']['provider'];
		$uid = $response['auth']['uid'];
		$pid = $provider . $uid;
		$name = $response['auth']['info']['name'];
		$timestamp = $response['timestamp'];
		$raw = serialize($response);

		echo "<pre>";
		echo $pid . "<br>";
		echo $name . "<br>";
		echo "</pre>";
		$con = mysqli_connect("localhost", "islay3d", "islay3dPW", "islay3d");
		if (mysqli_connect_errno($con)) {
			echo "Failed to connect to database.  " . mysqli_connect_error() . ".   Contact the admin for details";
		}

		mysqli_query($con, "INSERT INTO USERS
		(
		PID,
		PROVIDER,
		UID,
		NAME,
		ARRAY,
		TIMESTAMP
		)
		VALUES
		(
		'$pid',
		'$provider',
		'$uid',
		'$name',
		'$raw',
		'$timestamp'
		)
		ON DUPLICATE KEY UPDATE
		NAME = '$name',
		ARRAY = '$raw',
		TIMESTAMP = '$timestamp';");

		mysqli_close($con);
	}
}
?>