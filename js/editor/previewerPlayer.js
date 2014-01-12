var Player = function() {

	player = new Game(200, 150);

	player.XML3DI;
	player.data;
	player.characters;
	player.complexList;
	player.groups;
	player.sceneCharacters = {};

	var scene3d = new Scene3D();
	scene3d.backgroundColor = [0, 0, 0, 0];
	player.scene3d = scene3d;

	var light = new DirectionalLight();
	light.directionX = 1;
	light.directionY = 1;
	light.directionZ = 1;
	light.color = [1.0, 1.0, 1.0];
	scene3d.setDirectionalLight(light);
	player.scene3d.light = light;

	var camera = new Camera3D();
	camera.x = 0;
	camera.y = -80;
	camera.z = 100;
	camera.centerX = 0;
	camera.centerY = 0;
	camera.centerZ = 0;
	scene3d.setCamera(camera);
	player.scene3d.camera = camera;

	player.setInput = function() {
		//bindKeyboardKey(player);
	};
	player.setInput();

	// this function is an artifact of player.js, and is not relevant to previewerPlayer.js
	player.loadFile = function(filename) {
		
	};

	var isComplex = function(character) {
		for (var a in player.complexList) {
			if (character.XML.attributes["parts"].value == player.complexList[a].attributes["name"].value) {
				return true;
			}
		}
		return false;
	};

	var setPrimitive = function(character) {
		var parts = character.XML.attributes["parts"].value;
		var path = player.data[parts].attributes["path"].value;

		player.load(path, parts, function() {

			character.set(this);
			player.scene3d.addChild(character);
			character.isComplex = false;
			console.log("Model: " + character.XML.attributes["parts"].value);
			player.start();
		}, function() {
			console.log("player load model error!!");
		});

	};

	var setComplex = function(character) {
		var parts = character.XML.attributes["parts"].value;

		character.XML.MEMBERS = new Hash(player.complexList[parts].getElementsByTagName("member"), "character");
		for (var name in character.XML.MEMBERS) {
			var XMLData = player.characters[name];
			var newCharacter = new Character(XMLData);
			var mat = mat4.create();
			mat4.set((character.XML.attributes["rotation"].value).split(","), mat);
			if (!isComplex(newCharacter)) {
				setPrimitive(newCharacter);
			} else {
				setComplex(newCharacter);
			}
			newCharacter.x = character.XML.MEMBERS[name].attributes["x"].value;
			newCharacter.y = character.XML.MEMBERS[name].attributes["y"].value;
			newCharacter.z = character.XML.MEMBERS[name].attributes["z"].value;
			// is this z value opposite of in islay3d?
			//newCharacter.rotation = mat;
			character.addChild(newCharacter);
		}
		character.isComplex = true;
	};

	var setCharacters = function() {
		player.complexList = new Hash(player.XML3DI.getElementsByTagName("complex"), "name");
		player.characters = new Hash(player.XML3DI.getElementsByTagName("character"), "name");
	};

	player.createGroup = function(group) {
		var forks = group.getElementsByTagName("fork");
		for (var i = 0; i < forks.length; i++) {
			var name = forks[i].attributes["character"].value;
			var XMLData = player.characters[name];
			var newCharacter = new Character(XMLData);

			if (!isComplex(newCharacter)) {
				setPrimitive(newCharacter);
			} else {
				setComplex(newCharacter);
			}
		}
	};

	var setGroups = function() {
		player.groups = new Hash(player.XML3DI.getElementsByTagName("group"), "name");
		player.createGroup(Hash.first(player.groups));
	};

	var animation = function(characters) {
		for (var i = 0; i < characters.length; i++) {
			if (characters[i].XML == undefined) {
				return;
			}
			player.transition(characters[i]);
			animation(characters[i].childNodes);
			// Recurse child characters
		}
	};

	player.animate = function() {
		animation(player.scene3d.childNodes);
	};

	player.transition = function(character) {
		transition(player, character);
	};

	player.rootScene.onenterframe = function() {
		player.animate();
	};

	player.__construct = function() {
		//player.setInput();
	};

	player.showCharacter = function(charPanel) {
		var characterXML = document.createElement("character");
		$(characterXML).attr({
			name : charPanel.getId(),
			parts : charPanel.getId(),
			rotation : "1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000"
		});
		
		var scene3d = player.scene3d;
		for (var i=0; i<scene3d.childNodes.length; i++){
			scene3d.removeChild(scene3d.childNodes[i]);
		}

		if (player.sceneCharacters[charPanel.getId()] == undefined) {
			player.load(charPanel.modelPath, charPanel.getId(), function() {
				var newchar = new Character(characterXML);
				newchar.set(this);
				scene3d.addChild(newchar);
				player.sceneCharacters[charPanel.getId()] = newchar;
				if (player.takeScreenshot == true) {
					setTimeout(function() {
						$(document).trigger('previewerScreenshot');
					}, 1000);
					player.takeScreenshot = false;
				}
			}, function() {
				console.log("player load model error!!");
			});
			player.start();
		} else {
			scene3d.addChild(player.sceneCharacters[charPanel.getId()]);
		}
	};
	

	player.previewStart = function(xmlState) {
		var selectedChar = player.sceneCharacters[stage.selectedPanel.getId()];
		if (xmlState.attributes["action"].value == "move") {
			player.animate = function() {
				selectedChar.executeActionType1(xmlState);
				if (player.frame % 30 == 0) {
					selectedChar.resetMovement();
				}
			};
		} else if (xmlState.attributes["action"].value == "jump" || xmlState.attributes["action"].value == "jump-rand") {
			player.animate = function() {
				if (player.frame % 90 == 0) {
					selectedChar.executeActionType1(xmlState);
				}
				if (player.frame % 90 == 45) {
					selectedChar.resetMovement();
				}
			};
		}
	};

	player.previewStop = function() {
		selectedChar = player.sceneCharacters[stage.selectedPanel.getId()];
		selectedChar.resetMovement();
		player.animate = function() {
		};
	};

	var enchantstage = document.getElementById('enchant-stage');
	enchantstage.style.right = '38px';
	enchantstage.style.top = '125px';
	enchantstage.style.border = "2px solid black";

	return player;
};
