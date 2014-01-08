enchant.ENV.PREVENT_DEFAULT_KEY_CODES = [];
enchant();

Player();

drawBackground();	// will be obsolete 
drawMenuBar();		// will be obsolete
drawFunctionBar();	// will be obsolete
drawMainPanel();	// will be obsolete

var clearTempFiles = function() {
	delete localStorage.playerScreenshot;
	delete localStorage.playerXML;
};
clearTempFiles();

setTimeout(function(){
	stage.get('#buttonMenuHelp')[0].fire('click');
}, 1000);


				