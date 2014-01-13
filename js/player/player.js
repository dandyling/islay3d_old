var Player = function() {

	player = new Game(640, 480);

	player.XML3DI
	player.data
	player.characters
	player.complexList
	player.groups
	player.sceneCharacters = {};

	var scene3d = new Scene3D();
	scene3d.backgroundColor = [1, 1, 1, 0];
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
	camera.y = -500;
	camera.z = 500;
	camera.centerX = 0;
	camera.centerY = 0;
	camera.centerZ = 0;
	scene3d.setCamera(camera);
	player.scene3d.camera = camera;

	player.setInput = function() {
		bindKeyboardKey(player);
	};
	player.setInput();

	player.loadFile = function(filename) {
		player.XML3DI = $.parseXML(filename);
		
		player.data = new Hash(player.XML3DI.getElementsByTagName("data"), "name");
		setCharacters();
		setGroups();
		collisionTimeout = true;
		setTimeout(function() {
			player.animate = function() {
				animation(player.scene3d.childNodes);
			};
			player.start();
		}, 2000);
		setTimeout(function() {
			collisionTimeout = false;
			try {
				var imgData = $('#canvasEnchant')[0].toDataURL();
				localStorage.playerScreenshot = imgData;
			} catch(e) {
				console.log("Browser does not support taking screenshot of 3d context");
				return;
			}
		}, 4000);
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
			character.bounding.radius = 12;		// custom bounding radius for collision detection
			player.scene3d.addChild(character);
			character.isComplex = false;
			console.log("Model: " + character.XML.attributes["parts"].value);

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
		console.log(player.groups);
		//player.createGroup(Hash.first(player.groups));
		player.createGroup(player.groups['グループ1']);
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
		player.setInput();
	};

	/*var e = document.getElementById("enchant-stage");
	 e.onclick = function() {
	 //glcvs.style.left = "600px";
	 if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
	 RunPrefixMethod(document, "CancelFullScreen");
	 }
	 else {
	 RunPrefixMethod(e, "RequestFullScreen");
	 //var s = window.innerWidth/480;
	 var s = 2;
	 glcvs.style.top = "-480px"
	 glcvs.style[enchant.ENV.VENDOR_PREFIX + 'Transform'] = 'scale(' + s + ')';

	 }

	 }

	 var pfx = ["webkit", "moz", "ms", "o", ""];
	 function RunPrefixMethod(obj, method) {

	 var p = 0, m, t;
	 while (p < pfx.length && !obj[m]) {
	 m = method;
	 if (pfx[p] == "") {
	 m = m.substr(0,1).toLowerCase() + m.substr(1);
	 }
	 m = pfx[p] + m;
	 t = typeof obj[m];
	 if (t != "undefined") {
	 pfx = [pfx[p]];
	 return (t == "function" ? obj[m]() : obj[m]);
	 }
	 p++;
	 }

	 }*/

	return player;
};
enchant();
Player();
player.loadFile(localStorage.playerXML);