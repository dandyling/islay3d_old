var toggleCharactersPanel = function(charPanel) {
	var rectSelected = stage.get('#rectMainPanelSelected')[0];
	rectSelected.setOpacity(1);
	rectSelected.setStroke('gray');
	rectSelected.draw();

	if (stage.drawingToolbar == undefined) {
		stage.drawingToolbar = drawDrawingToolbar();
	} else {
		stage.drawingToolbar.getParent().moveToTop();
	}

	for (var i = 0; i < characterPanels.length; i++) {
		if (characterPanels[i].getId() == charPanel.getId()) {
			charPanel.buttonDown = true;
			charPanel.rect.setFill('#00FFFF');
			charPanel.line.setStroke('#00FFFF');
			charPanel.toolbar.getChildren().each(function(shape, n) {
				shape.show();
			});
			charPanel.getParent().getParent().draw();
			charPanel.selectedDiagram.show();
			charPanel.selectedDiagram.draw();
			$("#tabDiv-" + charPanel.count).show("fade", {}, 10);
			stage.selectedPanel = charPanel;
			var tabs = $(stage.selectedPanel.tabDiv).tabs();
			var index = tabs.tabs("option", "active", 0);
			tabs.tabs("refresh");
			if (charPanel.groupXML == undefined) {
				player.showCharacter(charPanel);
			}
		} else {
			characterPanels[i].buttonDown = false;
			characterPanels[i].rect.setFill('white');
			characterPanels[i].line.setStroke('black');
			characterPanels[i].toolbar.getChildren().each(function(shape, n) {
				shape.hide();
			});
			characterPanels[i].getParent().getParent().draw();
			characterPanels[i].selectedDiagram.hide();
			characterPanels[i].selectedDiagram.draw();
			$("#tabDiv-" + characterPanels[i].count).hide("fade", {}, 10);
			dialogBoxes.close();
		}
	}

	for (var id in radio) {
		if (radio[id].buttonDown) {
			if (id == 'buttonArrow') {
				stage.selectedPanel.selectedDiagram.setStatesDraggable(false);
			} else {
				stage.selectedPanel.selectedDiagram.setStatesDraggable(true);
				stage.selectedPanel.selectedDiagram.off('mousedown');
			}
		}
	}

};

var addCharacterPanel = function(config) {
	var m = 15;
	var m1 = 8;
	var mText = 8;
	var panelBar = stage.get('#groupPanelBar')[0];
	var rectFunctionBar = stage.get('#rectFunctionBar')[0];
	var rectMainPanel = stage.get('#rectMainPanel')[0];

	var charPanel = new Kinetic.Group({
		id : config.name,
		x : rectFunctionBar.getX() + rectFunctionBar.getWidth() + m,
		y : rectFunctionBar.getY() + 20 + (60 + m1 * 2 + mText) * characterPanels.length
	});
	charPanel.path = config.pathImage;
	charPanel.modelPath = config.pathModel;

	charPanel.diagrams = {};
	charPanel.array = new Array();
	if (config.noTab == undefined) {
		var diagramId = "tabs-1";
		charPanel.diagrams[diagramId] = new DiagramLayer(diagramId);
		charPanel.diagrams[diagramId].label = "図1";
		charPanel.array.push(charPanel.diagrams[diagramId]);
		charPanel.selectedDiagram = charPanel.diagrams[diagramId];
	}
	charPanel.count = characterPanels.count++;
	charPanel.tabDiv = drawTabBar(charPanel.count, config.noTab);
	charPanel.diagLabels = new Hashtable();

	stage.setObject(config.name, charPanel.modelPath);

	var rect = new Kinetic.Rect({
		width : 80 + m1 + 20,
		height : 60 + m1 * 2 + mText,
		stroke : 'black',
		fill : 'white',
		strokeWidth : 1,
	});
	charPanel.rect = rect;
	charPanel.add(rect);
	panelBar.add(charPanel);

	var preview = new Image();
	preview.onload = function() {
		var image = new Kinetic.Image({
			image : preview
		});
		var rectPanel = new Kinetic.Rect({
			id : 'rectPanel',
			x : m1,
			y : m1,
			width : 80,
			height : 60,
			fillPatternImage : preview,
			fillPatternScale : 80 / 200,
			stroke : 'black',
			strokeWidth : 1
		});
		charPanel.add(rectPanel);
		charPanel.rectPanel = rectPanel;

		if (config.noTab == undefined) {
			toggleCharactersPanel(charPanel);
		}
		rectPanel.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		rectPanel.on('mouseout', function() {
			document.body.style.cursor = cursor;
		});
		// Toggle on click
		rectPanel.on('click', function() {
			toggleCharactersPanel(this.getParent());
		});
	};
	preview.src = charPanel.path;

	var addCharacterPanelBar = function() {
		var toolbar = new Kinetic.Group();
		toolbar.count = 0;
		toolbar.onLoad = function() {
			toolbar.count++;
			if (toolbar.count >= 3) {
				toolbar.getParent().getParent().getParent().getParent().draw();
			}
		};
		addIcon({
			x : m1 + 80,
			y : m1 + 20 * 0,
			source : 'img/mainPanel/edit1.png',
			layer : toolbar,
			id : 'characterRenameButton',
			iconSize : 20,
			onClick : function() {
				var dialog = new DialogRenameCharacter(charPanel);
			},
			onLoad : toolbar.onLoad
		});
		addIcon({
			x : m1 + 80,
			y : m1 + 20,
			source : 'img/mainPanel/copy1.png',
			layer : toolbar,
			id : 'characterDuplicateButton',
			iconSize : 20,
			onClick : function() {
				var index = charPanel.getIndex();
				var charName = (charPanel.oriName == undefined) ? charPanel.getId() : charPanel.oriName;
				addCharacterPanel({
					name : charName,
					pathImage : charPanel.path,
					pathModel : charPanel.modelPath
				});
				var newCharPanel = characterPanels.pop();
				characterPanels.splice(index + 1, 0, newCharPanel);
				stage.get("#groupPanelBar")[0].refresh();

				/*var index = charPanel.getIndex();
				 var characterXML = charPanel.getXML();
				 console.log(characterXML);
				 var data = new Hash(stage.getObjectXML().getElementsByTagName("data"), "name");
				 var charName = (charPanel.oriName == undefined) ? charPanel.getId() : charPanel.oriName;
				 characterXML.attributes["name"].value = charName;
				 loadCharacter(characterXML, data);

				 var newCharPanel = characterPanels.pop();
				 characterPanels.splice(index + 1, 0, newCharPanel);
				 stage.get("#groupPanelBar")[0].refresh();*/
			},
			onLoad : toolbar.onLoad
		});
		addIcon({
			x : m1 + 80,
			y : m1 + 20 * 2,
			source : 'img/mainPanel/delete1.png',
			layer : toolbar,
			id : 'characterDeleteButton',
			iconSize : 20,
			onClick : function() {
				if (confirm('本当に\"' + stage.selectedPanel.getId() + "\"を削除する？")) {
					stage.selectedPanel.removeSelf();
					stage.get("#groupPanelBar")[0].refresh();
					toggleCharactersPanel(characterPanels[0]);
				}
			},
			onLoad : toolbar.onLoad
		});
		charPanel.add(toolbar);
		charPanel.toolbar = toolbar;
	};
	addCharacterPanelBar();

	characterPanels.add(charPanel);

	var simpleText = new Kinetic.Text({
		x : m1,
		y : 60 + m1,
		width : 80,
		text : charPanel.getId(),
		fontSize : 9,
		fontFamily : 'sans-serif',
		fill : 'black',
		align : 'center',
		shadowOpacity : 0.5,
		shadowOffset : 1,
	});
	charPanel.add(simpleText);
	charPanel.simpleText = simpleText;

	// This line erases the right border of rect
	var line = new Kinetic.Line({
		points : [rect.getWidth(), rect.getY(), rect.getWidth(), rect.getHeight()],
		stroke : 'black',
	});
	charPanel.add(line);
	charPanel.line = line;

	charPanel.getIndex = function() {
		for (var i = 0; i < characterPanels.length; i++) {
			if (characterPanels[i].getId() == charPanel.getId()) {
				return i;
			}
		}
	};

	charPanel.removeSelf = function() {
		delete player.sceneCharacters[charPanel.getId()];

		for (var i = 0; i < characterPanels.length; i++) {
			if (characterPanels[i].getId() == charPanel.getId()) {
				characterPanels.splice(i, 1);
				for (var a in charPanel.diagrams) {
					charPanel.diagrams[a].clear();
					charPanel.diagrams[a].destroy();
				}
				charPanel.destroy();

				document.body.removeChild(charPanel.tabDiv);
				break;
			}
		}
	};

	charPanel.getXML = function() {
		var character = document.createElement("character");
		$(character).attr({
			name : charPanel.getId(),
			parts : config.name,
			rotation : "1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000"
		});

		for (var a in charPanel.diagrams) {
			var statediagram = charPanel.diagrams[a].getXML();
			//console.log(a, charPanel.diagrams[a].getXML);
			character.appendChild(statediagram);
		}

		return character;
	};

	return charPanel;
};

var addGroupPanel = function(config) {
	var m = 15;
	var m1 = 8;
	var mText = 8;
	var m3 = 5;

	var panelBar = stage.get('#groupPanelBar')[0];
	var rectFunctionBar = stage.get('#rectFunctionBar')[0];
	var rectMainPanel = stage.get('#rectMainPanel')[0];

	var posX = rectFunctionBar.getX() + rectFunctionBar.getWidth() + m;
	var posY = rectFunctionBar.getY() + 20 + (60 + m1 * 2 + mText) * characterPanels.length;
	var groupPanel = new Kinetic.Group({
		id : config.name,
		x : posX,
		y : posY,
	});

	groupPanel.diagrams = {};
	groupPanel.array = new Array();
	if (config.noTab == undefined) {
		var diagramId = "tabs-1";
		groupPanel.diagrams[diagramId] = new DiagramLayer(diagramId);
		groupPanel.diagrams[diagramId].get('#rectDiagramEditor')[0].off('mousedown');
		groupPanel.diagrams[diagramId].label = "図1";
		groupPanel.array.push(groupPanel.diagrams[diagramId]);
		groupPanel.selectedDiagram = groupPanel.diagrams[diagramId];
	}
	groupPanel.count = characterPanels.count++;
	groupPanel.tabDiv = drawTabBar(groupPanel.count, config.noTab);
	groupPanel.diagLabels = new Hashtable();

	var rect = new Kinetic.Rect({
		width : 80 + m1 + 20,
		height : 60 + m1 * 2 + mText,
		stroke : 'black',
		fill : 'white',
		strokeWidth : 1,
	});
	groupPanel.rect = rect;
	groupPanel.add(rect);
	panelBar.add(groupPanel);

	var rectPanel = new Kinetic.Rect({
		id : 'rectPanel',
		x : m1,
		y : m1,
		width : 80,
		height : 60,
		fill : '#C33745',
		stroke : 'black',
		strokeWidth : 1
	});
	groupPanel.add(rectPanel);
	groupPanel.rectPanel = rectPanel;

	var groupXML = document.createElement("group");
	$(groupXML).attr({
		name : config.name
	});
	groupPanel.groupXML = groupXML;
	
	for (var i = 0; i < config.characters.length; i++) {
		var characterImage = new Kinetic.Image({
			x : m1 + m3 + (80 - m3 * 2 - 200 * 0.2) / (config.characters.length - 1) * (i),
			y : m1 + 150 * 0.2 / 2,
			image : config.characters[i].img,
			scale : 0.2,
		});
		groupPanel.add(characterImage);

		/** append xml */
		var forkXML = document.createElement("fork");
		var characterName = config.characters[i].name;
		$(forkXML).attr({
			character : characterName,
			img : config.characters[i].img.src
		});
		$(groupPanel.groupXML).append(forkXML);
	}

	var rectInvi = new Kinetic.Rect({
		x : m1,
		y : m1,
		width : 80,
		height : 60,
		stroke : 'black',
		fill : 'white',
		strokeWidth : 1,
		opacity : 0
	});
	groupPanel.add(rectInvi);
	rectInvi.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	rectInvi.on('mouseout', function() {
		document.body.style.cursor = cursor;
	});
	// Toggle on click
	rectInvi.on('click', function() {
		toggleCharactersPanel(this.getParent());
		dialogBoxes.close();
		var copiedResource = {};
		$.extend(copiedResource, dialogBoxResources['group-create']);
		copiedResource.title = 'グループ編集';
		copiedResource.buttons[0].text = "ほぞん";
		copiedResource.buttons[0].onClick = function() {
			var characterImages = rectInvi.getParent().get('Image');
			for (var i = 0; i < characterImages.length; i++) {
				characterImages[i].remove();
			}

			var groupName = this.getParent().textField.value;
			if (stage.groups.isExistName(groupName)) {
				alert(groupName + "が存在します。新名を入力してください。");
				return;
			}

			var groupCharacters = new Array();
			var panels = this.getParent().panels.getChildren();
			for (var i = 0; i < panels.length; i++) {
				groupCharacters.push({
					name : panels[i].config.name,
					img : panels[i].getChildren()[1].getFillPatternImage()
				});
			}

			var groupXML = document.createElement("group");
			$(groupXML).attr({
				name : groupName
			});
			groupPanel.groupXML = groupXML;

			for (var i = 0; i < groupCharacters.length; i++) {
				var characterImage = new Kinetic.Image({
					x : m1 + m3 + (80 - m3 * 2 - 200 * 0.2) / (groupCharacters.length - 1) * (i),
					y : m1 + 150 * 0.2 / 2,
					image : groupCharacters[i].img,
					scale : 0.2,
				});
				groupPanel.add(characterImage);

				/** append xml */
				var forkXML = document.createElement("fork");
				var characterName = groupCharacters[i].name;
				$(forkXML).attr({
					character : characterName,
					img : groupCharacters[i].img.src
				});
				$(groupPanel.groupXML).append(forkXML);
			}
			rectInvi.moveToTop();
			groupPanel.draw();
			dialogBoxes.close();
		};
		copiedResource.callback = function() {
			var layer = stage.get('#group-create')[0].getParent();
			layer.tooltips = new Array();
		};
		var dialogBox1 = new DialogBoxWithAddThumbnails(copiedResource);

		for (var i = 0; i < groupPanel.groupXML.children.length; i++) {
			var fork = groupPanel.groupXML.children[i];
			dialogBox1.addPanel({
				name : fork.attributes["character"].value,
				path : fork.attributes["img"].value,
				scale : 0.5,
			});
		}
		dialogBoxes.push(dialogBox1);
	});

	var addGroupPanelBar = function() {
		var toolbar = new Kinetic.Group();
		toolbar.count = 0;
		toolbar.onLoad = function() {
			toolbar.count++;
			if (toolbar.count >= 3) {
				toolbar.getParent().getParent().getParent().getParent().draw();
			}
		};
		/*addIcon({
		x : m1 + 80,
		y : m1 + 20 * 0,
		source : 'img/mainPanel/edit1.png',
		layer : toolbar,
		id : 'characterRenameButton',
		iconSize : 20,
		onClick : function() {
		var dialog = new DialogRenameCharacter(charPanel);
		},
		onLoad : toolbar.onLoad
		});*/
		/** to do */
		addIcon({
			x : m1 + 80,
			y : m1 + 20 * 0,
			source : 'img/mainPanel/copy1.png',
			layer : toolbar,
			id : 'characterDuplicateButton',
			iconSize : 20,
			onClick : function() {
				/*var index = charPanel.getIndex();
				 var charName = (charPanel.oriName == undefined) ? charPanel.getId() : charPanel.oriName;
				 addCharacterPanel({
				 name : charName,
				 pathImage : charPanel.path,
				 pathModel : charPanel.modelPath
				 });
				 var newCharPanel = characterPanels.pop();
				 characterPanels.splice(index + 1, 0, newCharPanel);
				 stage.get("#groupPanelBar")[0].refresh();*/

				/*var index = charPanel.getIndex();
				 var characterXML = charPanel.getXML();
				 console.log(characterXML);
				 var data = new Hash(stage.getObjectXML().getElementsByTagName("data"), "name");
				 var charName = (charPanel.oriName == undefined) ? charPanel.getId() : charPanel.oriName;
				 characterXML.attributes["name"].value = charName;
				 loadCharacter(characterXML, data);

				 var newCharPanel = characterPanels.pop();
				 characterPanels.splice(index + 1, 0, newCharPanel);
				 stage.get("#groupPanelBar")[0].refresh();*/
			},
			onLoad : toolbar.onLoad
		});
		addIcon({
			x : m1 + 80,
			y : m1 + 20 * 2,
			source : 'img/mainPanel/delete1.png',
			layer : toolbar,
			id : 'characterDeleteButton',
			iconSize : 20,
			onClick : function() {
				if (confirm('本当に\"' + stage.selectedPanel.getId() + "\"を削除する？")) {
					stage.selectedPanel.removeSelf();
					stage.get("#groupPanelBar")[0].refresh();
					toggleCharactersPanel(characterPanels[0]);
				}
			},
			onLoad : toolbar.onLoad
		});
		groupPanel.add(toolbar);
		groupPanel.toolbar = toolbar;
	};
	addGroupPanelBar();

	characterPanels.add(groupPanel);

	var simpleText = new Kinetic.Text({
		x : m1,
		y : 60 + m1,
		width : 80,
		text : groupPanel.getId(),
		fontSize : 9,
		fontFamily : 'sans-serif',
		fill : 'black',
		align : 'center',
		shadowOpacity : 0.5,
		shadowOffset : 1,
	});
	groupPanel.add(simpleText);
	groupPanel.simpleText = simpleText;

	// This line erases the right border of rect
	var line = new Kinetic.Line({
		points : [rect.getWidth(), rect.getY(), rect.getWidth(), rect.getHeight()],
		stroke : 'black',
	});
	groupPanel.add(line);
	groupPanel.line = line;

	groupPanel.getIndex = function() {
		for (var i = 0; i < characterPanels.length; i++) {
			if (characterPanels[i].getId() == groupPanel.getId()) {
				return i;
			}
		}
	};

	groupPanel.removeSelf = function() {
		delete player.sceneCharacters[groupPanel.getId()];

		for (var i = 0; i < characterPanels.length; i++) {
			if (characterPanels[i].getId() == groupPanel.getId()) {
				characterPanels.splice(i, 1);
				for (var a in groupPanel.diagrams) {
					groupPanel.diagrams[a].clear();
					groupPanel.diagrams[a].destroy();
				}
				stage.groups.remove(groupPanel.getId());
				groupPanel.destroy();

				document.body.removeChild(groupPanel.tabDiv);
				break;
			}
		}
	};

	groupPanel.getXML = function() {
		return groupPanel.groupXML;
	};
	toggleCharactersPanel(groupPanel);

	return groupPanel;
};

stage.objectlist = {};
stage.setObject = function(name, path) {
	if (stage.objectlist[name] == undefined) {
		stage.objectlist[name] = path;
	}
};

stage.getObjectXML = function() {
	var objectlist = document.createElement("objectlist");
	for (var name in stage.objectlist) {
		var data = document.createElement("data");
		$(data).attr({
			name : name,
			path : stage.objectlist[name]
		});
		objectlist.appendChild(data);
	}
	return objectlist;
};

stage.getXML = function() {
	var islay3d = document.createElement("islay3d");
	$(islay3d).attr("ver", "1.1");

	var objectlist = stage.getObjectXML();
	islay3d.appendChild(objectlist);

	var characterlist = document.createElement("characterlist");
	for (var i = 0; i < characterPanels.length; i++) {
		var character = characterPanels[i].getXML();
		characterlist.appendChild(character);
	}
	islay3d.appendChild(characterlist);

	var grouplist = document.createElement("grouplist");
	var groupMain = document.createElement("group");
	$(groupMain).attr("name", "main");
	grouplist.appendChild(groupMain);
	for (var i = 0; i < characterPanels.length; i++) {
		if (characterPanels[i].groupXML == undefined) {
			var fork = document.createElement("fork");
			$(fork).attr({
				character : characterPanels[i].getId(),
				x : "0.000000",
				y : "0.000000",
				z : "0.000000",
			});
			groupMain.appendChild(fork);
		} else {
			var groupNew = document.createElement("group");
			$(groupNew).attr("name", characterPanels[i].groupXML.attributes["name"].value);
			for (var j = 0; j < characterPanels[i].groupXML.children.length; j++) {
				var fork = document.createElement("fork");
				$(fork).attr({
					character : characterPanels[i].groupXML.children[j].attributes["character"].value,
					x : "0.000000",
					y : "0.000000",
					z : "0.000000",
				});
				groupNew.appendChild(fork);
			}
			grouplist.appendChild(groupNew);
		}
	}
	islay3d.appendChild(grouplist);

	var option = document.createElement("option");
	var interval = document.createElement("interval");
	$(interval).attr("value", "100");
	option.appendChild(interval);
	var room = document.createElement("room");
	$(room).attr({
		type : "space",
		width : "100.000000",
		height : "100.000000",
		depth : "100.000000"
	});
	option.appendChild(room);
	var color = document.createElement("color");
	$(color).attr({
		roof : "255,255,255",
		floor : "255,255,255",
		wall : "255,255,255",
		background : "255,255,255",
	});
	option.appendChild(color);
	islay3d.appendChild(option);

	return islay3d;
};
