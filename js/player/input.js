var inputKeyboard;

KEYS = {
	ALPHA : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
	NONALPHA : [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	NONALPHA_MAP : ['space', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
};

var bindKeyboardKey = function(player) {
	for (var i = 0; i < KEYS.ALPHA.length; i++) {
		player.keybind(KEYS.ALPHA[i].toUpperCase().charCodeAt(0), KEYS.ALPHA[i]);
	}
	for (var i = 0; i < KEYS.NONALPHA.length; i++) {
		player.keybind(KEYS.NONALPHA[i].charCodeAt(0), KEYS.NONALPHA_MAP[i]);
	}
};