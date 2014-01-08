var collisionTimeout;
var detectcollision = function(character, a, to, characters, object) {
	for (var i = 0; i < characters.length; i++) {
		if (characters[i].XML == undefined) {
			return;
		}
		if (character.XML.attributes["name"].value != characters[i].XML.attributes["name"].value) {
			if (object == null || characters[i].XML.attributes["name"].value == object) {
				//console.log(character, characters[i]);
				if (character.intersect(characters[i]) === true) {
					character.XML.STATEDIAGRAMS[a].current = character.XML.STATEDIAGRAMS[a].STATES[to];
					console.log("gotcha", character.XML.attributes["name"].value, characters[i].XML.attributes["name"].value);
					collisionTimeout = true;
					setTimeout(function(){
						collisionTimeout = false;
					}, 1000);
				}
			}
		}
		detectcollision(character, a, to, characters[i].childNodes, object); 	// this one might be obsolete as complex character feature is in jeopardy
	}
};

transition = function(player, character) {
	for (var a in character.XML.STATEDIAGRAMS) {

		if (hashLength(character.XML.STATEDIAGRAMS[a].STATES) == 0) {
			continue;
		}

		// Initialize every state diagrams if not already initialized
		if (!character.XML.STATEDIAGRAMS[a].init) {
			character.XML.STATEDIAGRAMS[a].current = Hash.first(character.XML.STATEDIAGRAMS[a].STATES);
			character.XML.STATEDIAGRAMS[a].init = true;
		}

		character.executeActionType1(character.XML.STATEDIAGRAMS[a].current);
		character.executeActionType2(player, character.XML.STATEDIAGRAMS[a].current);

		for (var x = 0; x < character.XML.STATEDIAGRAMS[a].current.trans.length; x++) {
			var tran = character.XML.STATEDIAGRAMS[a].current.trans[x];
			var guard = tran.attributes["guard"].value;
			var to = tran.attributes["to"].value;

			switch(guard) {
				case 'key' :
					break;
				
				case 'prob':
					var prob = tran.attributes["prob"].value;
					if (Math.random() < parseFloat(prob) / 100) {
						character.XML.STATEDIAGRAMS[a].current = character.XML.STATEDIAGRAMS[a].STATES[to];
					}
					break;

				case 'timeout':
					var count = tran.attributes["count"].value;
					if (tran.counter == undefined) {
						tran.counter = 0;
					}
					if (tran.counter == count - 1) {
						tran.counter = 0;
						character.XML.STATEDIAGRAMS[a].current = character.XML.STATEDIAGRAMS[a].STATES[to];
					} else {
						tran.counter++;
					}
					break;

				case 'bump':
					if(collisionTimeout == true){
						break;
					}
					var object = tran.attributes["bump"].value;
					switch(object) {
						case '@anywall':
							break;

						case '@eastwall':
							break;

						case '@westwall':
							break;

						case '@southwall':
							break;

						case '@northwall':
							break;

						case '@roofwall':
							break;

						case '@floorwall':
							break;

						case '@any':
							break;

						case '@anychara':
							var sceneCharacters = player.scene3d.childNodes;
							detectcollision(character, a, to, sceneCharacters);
							break;

						default:
							if (player.characters[object] != undefined) {
								var sceneCharacters = player.scene3d.childNodes;
								detectcollision(character, a, to, sceneCharacters, object);
							}
							break;
					}
					break;

				case 'click':
					if (character.touched) {
						character.XML.STATEDIAGRAMS[a].current = character.XML.STATEDIAGRAMS[a].STATES[to];
						character.touched = false;
					}
					break;

				case 'event':
					type = tran.attributes["type"].value;
					if (character.message == type) {
						character.XML.STATEDIAGRAMS[a].current = character.XML.STATEDIAGRAMS[a].STATES[to];
						character.message = "";
					}
					break;

				default:
					character.XML.STATEDIAGRAMS[a].current = character.XML.STATEDIAGRAMS[a].STATES[to];
					break;
			}
		}
	}
}; 