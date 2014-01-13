<?php
/**
 * Opauth basic configuration file to quickly get you started
 * ==========================================================
 * To use: rename to opauth.conf.php and tweak as you like
 * If you require advanced configuration options, refer to opauth.conf.php.advanced
 */

require_once('PhpConsole.php');
PhpConsole::start(true, true, dirname(__FILE__));

$config = array(
/**
 * Path where Opauth is accessed.
 *  - Begins and ends with /
 *  - eg. if Opauth is reached via http://example.org/auth/, path is '/auth/'
 *  - if Opauth is reached via http://auth.example.org/, path is '/'
 * 
 * Only this path needs to be changed of the entire application.
 */
	'path' => '/opauth/',
	
	'debug' => true,
	'callback_transport' => 'post',

/**
 * Callback URL: redirected to after authentication, successful or otherwise
 */
	'callback_url' => '{path}callback.php',
	
/**
 * A random string used for signing of $auth response.
 * 
 * NOTE: PLEASE CHANGE THIS INTO SOME OTHER RANDOM STRING
 */
	'security_salt' => 'LDFmiilYf8Fyw5sdd3478adfagagahKDx8agaha28R1C4m',
		
/**
 * Strategy
 * Refer to individual strategy's documentation on configuration requirements.
 * 
 * eg.
 * 'Strategy' => array(
 * 
 *   'Facebook' => array(
 *      'app_id' => 'APP ID',
 *      'app_secret' => 'APP_SECRET'
 *    ),
 * 
 * )
 *
 */
	'Strategy' => array(
		// Define strategies and their respective configs here
		
		'Facebook' => array(
			'app_id' => '655011061198284',
			'app_secret' => 'bed3865aad3fa0dd5ea35b12f2b60722'
		),
		
		'Google' => array(
			//'client_id' => '318555581155-cpvnse6uhtsolvd1jbvoeq08i8jkflee.apps.googleusercontent.com',
			//'client_secret' => 'FKgIqj_VdIv8DPJmOpulQPQ8'
			'client_id' => '318555581155-mth9rru2267a99fb4jieiri5ldcr79fi.apps.googleusercontent.com',
			'client_secret' => 'pShRD8iceBIjp2r2_96IrEEn'
		),
		
		'Twitter' => array(
			'key' => 'kqMAgjFgoYfeYh4rjczOw',
			'secret' => 'WB2cac9MvVMdqd1nkD25WL78PaYxYTUTAdoZ6um0yM',
		),
				
	),
);
