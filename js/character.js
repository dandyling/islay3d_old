var INPUTBUTTONS = {
	'UP' : 'up',
	'DOWN' : 'down',
	'LEFT' : 'left',
	'RIGHT' : 'right',
	'SPACE' : 'space',
	'0' : 'zero',
	'1' : 'one',
	'2' : 'two',
	'3' : 'three',
	'4' : 'four',
	'5' : 'five',
	'6' : 'six',
	'7' : 'seven',
	'8' : 'eight',
	'9' : 'nine',
	'a' : 'a',
	'b' : 'b',
	'c' : 'c',
	'd' : 'd',
	'e' : 'e',
	'f' : 'f',
	'g' : 'g',
	'h' : 'h',
	'i' : 'i',
	'j' : 'j',
	'k' : 'k',
	'l' : 'l',
	'm' : 'm',
	'n' : 'n',
	'o' : 'o',
	'p' : 'p',
	'q' : 'q',
	'r' : 'r',
	's' : 's',
	't' : 't',
	'u' : 'u',
	'v' : 'v',
	'w' : 'w',
	'x' : 'x',
	'y' : 'y',
	'z' : 'z',
};

var Character = function(xmlData) {
	var character = new Sprite3D();

	character.XML;
	character.rotation;
	character.message;
	character.touched;

	character.createStateDiagrams = function() {
		console.log(character.XML);
		character.XML.STATEDIAGRAMS = new Hash(character.XML.getElementsByTagName("statediagram"), "name");
		var stateDiagrams = character.XML.STATEDIAGRAMS;
		for (var a in stateDiagrams) {
			stateDiagrams[a].STATES = new Hash(stateDiagrams[a].getElementsByTagName("state"), "name");
			if (character.XML.STATEDIAGRAMS[a].init == undefined) {
				character.XML.STATEDIAGRAMS[a].current = Hash.first(character.XML.STATEDIAGRAMS[a].STATES);
				character.XML.STATEDIAGRAMS[a].init = true;
			}
			stateDiagrams[a].TRANS = stateDiagrams[a].getElementsByTagName("trans");
			
			// Attach the transitions to the corresponding states
			for (var b in stateDiagrams[a].STATES) {
				character.attachTransition(stateDiagrams[a].STATES[b], stateDiagrams[a].TRANS);
			}
		};
	};

	character.attachTransition = function(state, transitions) {
		state.trans = new Array();
		for (var i = 0; i < transitions.length; i++) {
			if (transitions[i].attributes["guard"].value == "key" && 
					state.attributes["name"].value == transitions[i].attributes["to"].value) {
				
				var button = INPUTBUTTONS[transitions[i].attributes["key"].value];
				player.on(button+'buttondown', function(e){
					character.executeActionType1(state);
				});
			}
			if (state.attributes["name"].value == transitions[i].attributes["from"].value) {
				state.trans.push(transitions[i]);
			}
		}
	};

	character.sendParentMessage = function(chara, msg) {
		if (chara.parentNode != null) {
			chara.parentNode.message = msg;
			character.sendParentMessage(chara.parentNode, msg);
		}
	};

	character.sendChildMessage = function(chara, msg) {
		if (chara.childNodes != null) {
			for (var i = 0; i < chara.childNodes.length; i++) {
				chara.childNodes[i].message = msg;
				character.sendChildMessage(chara.childNodes[i], msg);
			}
		}
	};

	character.ontouchstart = function(e) {
		character.touched = true;
	};

	character.executeActionType1 = function(state) {
		executeActionType1(character, state);
	};

	character.executeActionType2 = function(player, state) {
		executeActionType2(player, character, state);
	};

	character.resetMovement = function() {
		var state = document.createElement("state");
		$(state).attr({
			name : "resetState",
			action : "reset",
			tra : "true",
			rot : "true"
		});
		character.executeActionType1(state);
	};

	character.__construct = function() {
		character.XML = xmlData;
		character.message = "";
		character.touched = false;
		//console.log(character.XML.attributes["rotation"].value);

		character.createStateDiagrams();

	}();

	return character;
}; 