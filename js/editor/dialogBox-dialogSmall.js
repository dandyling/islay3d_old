var DialogSmall = function(config) {
	var rect = new Kinetic.Rect({
		width : config.width,
		height : config.height,
		stroke : '#C33745',
		strokeWidth : 6,
		cornerRadius : 2,
		//fillLinearGradientColorStops: [0, '#C33745', 0.5, 'red', 1, '#C33745'],
		fillLinearGradientColorStops : [0, '#E0E0E0', 0.5, '#F0F0F0', 1, '#E0E0E0'],
		fillLinearGradientStartPoint : [config.width, 0],
	});

	var dialog = new Kinetic.Group({
		x : config.x,
		y : config.y,
		draggable : false
	});
	dialog.add(rect);
	dialog.rect = rect;

	var inputDivParent = document.createElement("div");
	document.body.appendChild(inputDivParent);
	$(inputDivParent).css({
		width : rect.getWidth() - 10,
		height : rect.getHeight() - 34,
		//background: "green"
	});
	$(inputDivParent).offset({
		left : rect.getAbsolutePosition().x + 5,
		top : rect.getAbsolutePosition().y + 5,
	});
	dialog.inputDivParent = inputDivParent;

	dialog.InputPosition = function(axis, left, top, value, onSpinStop) {
		var inputDiv = document.createElement("div");
		inputDivParent.appendChild(inputDiv);
		$(inputDiv).css({
			width : "60px",
			//background: "red",
		});
		inputDiv.style.position = "absolute";
		inputDiv.style.top = top + "px";
		inputDiv.style.left = left + "px";
		var input = document.createElement("input");
		input.axis = axis;
		inputDiv.appendChild(input);
		$(input).spinner();
		$(input).attr("size", "3");
		$(input).spinner("value", value);
		$(input).spinner("option", "max", 100);
		$(input).spinner("option", "min", -100);
		$(input).on("spinstop", onSpinStop);
		return input;
	};

	dialog.CheckBox = function(name, left, top, value, onChange) {
		var check = document.createElement("input");
		check.setAttribute("type", "checkbox");
		check.setAttribute("id", name);
		check.setAttribute("value", "0");
		check.style.position = "absolute";
		check.style.top = top + "px";
		check.style.left = left + "px";
		inputDivParent.appendChild(check);
		if (value != undefined) {
			check.checked = (value == "true") ? true : false;
		}
		check.onchange = onChange;
		return check;
	};

	dialog.SelectBox = function(config) {
		divParent = (config.divParent == undefined) ? inputDivParent : config.divParent;
		var select = document.createElement("select");
		select.setAttribute("type", "selectbox");
		select.style.position = "absolute";
		select.style.top = config.top + "px";
		select.style.left = config.left + "px";
		select.name = config.name;
		select.onchange = function() {
		};
		divParent.appendChild(select);
		for (var o in config.optionList) {
			var option = document.createElement("option");
			option.setAttribute("value", config.optionList[o]);
			option.innerHTML = config.optionList[o];
			select.appendChild(option);
		}
		select.value = (config.value != undefined) ? config.value : "";
		return select;
	};

	dialog.Table = function(config) {
		var SelectBox = dialog.SelectBox;
		var head = document.createElement("div");
		head.setAttribute("class", "head");
		inputDivParent.appendChild(head);
		head.style.position = "absolute";
		head.style.left = config.left + "px";
		head.style.top = config.top + "px";
		var table = document.createElement("table");
		table.setAttribute("border", "1");
		head.appendChild(table);
		var thead = document.createElement("thead");
		table.appendChild(thead);
		var tr = document.createElement("tr"); down:
		"down arrow", thead.appendChild(tr);
		for (var j = 0; j < config.header.length; j++) {
			var th = document.createElement("th");
			th.setAttribute("class", "grow");
			th.innerHTML = config.header[j];
			tr.appendChild(th);
		}

		var body = document.createElement("div");
		body.setAttribute("class", "body");
		body.style.position = "absolute";
		top2 = config.top + 22;
		body.style.left = config.left + "px";
		body.style.top = top2 + "px";
		inputDivParent.appendChild(body);
		var table = document.createElement("table");
		table.setAttribute("border", "1");
		body.appendChild(table);
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		var rowNum = 0;
		for (var diagram in config.data) {
			var tr = document.createElement("tr");
			tbody.appendChild(tr);
			var td = document.createElement("td");
			tr.appendChild(td);
			td.innerHTML = diagram;

			var td2 = document.createElement("td");
			tr.appendChild(td2);
			var divParent = document.createElement("div");
			td2.appendChild(divParent);
			var selectBox = new SelectBox({
				name : 'selectbox',
				left : 160,
				top : td2.offsetHeight * rowNum++,
				optionList : config.data[diagram],
				divParent : divParent
			});
		}

		return table;
	};

	dialog.ButtonRadio = function(name, left, top, buttons, value) {
		var inputDiv = document.createElement("div");
		inputDivParent.appendChild(inputDiv);
		for (var i = 0; i < buttons.length; i++) {
			var input = document.createElement("input");
			$(input).attr({
				id : "actionToolbar" + buttons[i] + "button",
				type : "radio",
				name : "radio",
				labelText : buttons[i],
			});
			var label = document.createElement("label");
			$(label).attr({
				type : "label",
				for : "actionToolbar" + buttons[i] + "button"
			});
			label.innerHTML = input.attributes["labelText"].value;

			if (input.attributes["labelText"].value == value) {
				input.checked = true;
			}

			inputDiv.appendChild(input);
			inputDiv.appendChild(label);
		}
		$(inputDiv).position({
			my : "center",
			at : "center",
			of : inputDivParent
		});
		$(inputDivParent).buttonset();
		return inputDivParent;
	};

	dialog.TextField = function(name, placeholder, left, top) {
		var textField = document.createElement("input");
		textField.setAttribute("placeholder", placeholder);
		textField.setAttribute("id", name);
		textField.style.position = "absolute";
		textField.style.top = top + "px";
		textField.style.left = left + "px";
		inputDivParent.appendChild(textField);
		return textField;
	};

	dialog.adjustPosition = function(posX, posY) {
		dialog.setPosition(posX, posY);
		$(inputDivParent).offset({
			left : rect.getAbsolutePosition().x + 5,
			top : rect.getAbsolutePosition().y + 5,
		});
	};

	dialog.close = function() {
		var selectedChar = player.sceneCharacters[stage.selectedPanel.getId()];
		selectedChar.resetMovement();
		player.animate = function() {
		};

		dialog.destroy();
		document.body.removeChild(inputDivParent);
		config.layer.draw();
	};

	dialog.button1 = addButton({
		id : 'buttonOK',
		x : rect.getX() + rect.getWidth() / 2 - 80,
		y : rect.getY() + rect.getHeight() - 25,
		width : 60,
		height : 20,
		layer : dialog,
		text : 'OK',
		isMain : true,
		onClick : function() {
			if (dialog.update != undefined) {
				dialog.update();
			} else {
				console.log("dialog.update() is not defined");
			}
			dialogBoxes.closeSmallDialogs();
		}
	});
	dialog.button2 = addButton({
		id : 'buttonCancel',
		x : rect.getX() + rect.getWidth() / 2 + 20,
		y : rect.getY() + rect.getHeight() - 25,
		width : 60,
		height : 20,
		layer : dialog,
		text : 'キャンセル',
		onClick : function() {
			dialogBoxes.closeSmallDialogs();
		}
	});

	config.layer.add(dialog);
	config.layer.draw();
	return dialog;
};
var DialogSmallToolbar = function(config) {
	var dialog = new DialogSmall({
		x : config.x,
		y : config.y,
		width : config.width,
		height : config.height,
		layer : config.layer,
	});

	dialog.preview = function() {
		player.previewStart(dialog.getStateXML());
	};

	dialog.update = function() {
		config.toolbar.state.xml = dialog.getStateXML();
		console.log(config.toolbar.state.getId());
		console.log(config.toolbar.state.xml);
		console.log(config.toolbar.state.xml2);
	};

	dialog.getAttributeValue = function(action, attr) {
		var value = 0;
		if (config.toolbar.state.xml.attributes["action"].value == action) {
			value = parseInt(config.toolbar.state.xml.attributes[attr].value);
		}
		return value;
	};

	dialog.getAttributeString = function(option, attr, def) {
		var value = def;
		if (config.toolbar.state.xml2.attributes["option"].value == option) {
			value = config.toolbar.state.xml2.attributes[attr].value;
		}
		return value;
	};

	dialog.getAttributeBoolean = function(action, attr) {
		var value = "true";
		if (config.toolbar.state.xml.attributes["action"].value == action) {
			value = config.toolbar.state.xml.attributes[attr].value;
		}
		return value;
	};

	return dialog;
};
var DialogSmallToolbar2 = function(config) {
	var dialog = new DialogSmall({
		x : config.x,
		y : config.y,
		width : config.width,
		height : config.height,
		layer : config.layer,
	});

	dialog.preview = function() {
		player.previewStart(dialog.getStateXML());
	};

	dialog.update = function() {
		config.toolbar.state.xml2 = dialog.getStateXML();
		console.log(config.toolbar.state.getId());
		console.log(config.toolbar.state.xml);
		console.log(config.toolbar.state.xml2);
	};

	dialog.getAttributeValue = function(option, attr) {
		var value = 0;
		if (config.toolbar.state.xml2.attributes["option"].value == option) {
			value = parseInt(config.toolbar.state.xml2.attributes[attr].value);
		}
		return value;
	};

	dialog.getAttributeString = function(option, attr) {
		var value = "";
		if (config.toolbar.state.xml2.attributes["option"].value == option) {
			value = config.toolbar.state.xml2.attributes[attr].value;
		}
		return value;
	};

	dialog.getAttributeBoolean = function(option, attr) {
		var value = "true";
		if (config.toolbar.state.xml2.attributes["option"].value == option) {
			value = config.toolbar.state.xml2.attributes[attr].value;
		}
		return value;
	};

	return dialog;
};
var DialogSmallToolbarArrow = function(config) {
	var dialog = new DialogSmall({
		x : config.x,
		y : config.y,
		width : config.width,
		height : config.height,
		layer : config.layer,
	});

	dialog.update = function() {
		var arrow = config.toolbar.arrow;
		var vertex = arrow.get('.arrowSpline')[0].getPoints()[1];
		arrow.xml = dialog.getArrowXML();
		if (arrow.label != undefined) {
			arrow.label.destroy();
		}
		arrow.drawLabel(vertex.x, vertex.y);
		console.log(arrow.xml);
	};

	dialog.getAttributeValue = function(guard, attr) {
		var value = 0;
		if (config.toolbar.arrow.xml.attributes["guard"].value == guard) {
			value = parseInt(config.toolbar.arrow.xml.attributes[attr].value);
		}
		return value;
	};

	dialog.getAttributeString = function(guard, attr, def) {
		var value = def;
		if (config.toolbar.arrow.xml.attributes["guard"].value == guard) {
			value = config.toolbar.arrow.xml.attributes[attr].value;
		}
		return value;
	};

	dialog.getAttributeBoolean = function(guard, attr) {
		var value = "true";
		if (config.toolbar.arrow.xml.attributes["guard"].value == guard) {
			value = config.toolbar.arrow.xml.attributes[attr].value;
		}
		return value;
	};

	return dialog;
};
var DialogRenameState = function(state) {
	dialogBoxes.close();

	var layer = state.getParent().getParent();
	var layerActionAndArrowToolbar = stage.get('#layerActionAndArrowToolbar')[0];
	var simpleText = state.simpleText;
	var dialog = new DialogSmall({
		x : state.getX() - 200 / 2,
		y : state.getY() - 70 / 2,
		width : 200,
		height : 70,
		layer : layerActionAndArrowToolbar
	});
	dialog.setDraggable(false);
	dialogBoxes.stateRenameDialog = dialog;
	var TextField = dialog.TextField;
	var textField = new TextField("inputTextNewStateName", simpleText.getText(), 5, 5);
	textField.focus();

	dialog.renameState = function(newName) {
		var oldName = simpleText.getText();
		layer.states[newName] = state;
		delete layer.states[oldName];
		simpleText.setText(newName);
		simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2));
		state.setId(newName);
		$(state.xml).attr("name", newName);
		for (var s2_id in state.outArrows) {
			var s2 = layer.states[s2_id];
			var arrow = state.outArrows[s2_id];
			delete s2.inArrows[oldName];
			s2.inArrows[newName] = arrow;
			arrow.refreshStateName();
			//arrow.resetXML();
		}
		for (var s2_id in state.inArrows) {
			var s2 = layer.states[s2_id];
			var arrow = state.inArrows[s2_id];
			delete s2.outArrows[oldName];
			s2.outArrows[newName] = arrow;
			arrow.refreshStateName();
			//arrow.resetXML();
		}
		simpleText.getParent().getParent().getParent().draw();
		dialogBoxes.close();
	};

	dialog.button1.off('click');
	dialog.button1.on('click', function() {
		var newName = textField.value;
		if (newName == "") {
			alert("Please enter a new name");
		} else if (layer.states[newName] != undefined) {
			alert("There is already an existing state with the same name!");
		} else {
			dialog.renameState(newName);
		}
	});

	return dialog;
};
var DialogRenameCharacter = function(charPanel) {
	dialogBoxes.close();
	if (stage.get("#layerCharRenameDialog")[0] == undefined) {
		var layer = new Kinetic.Layer({
			id : "layerCharRenameDialog"
		});
		stage.add(layer);
		stage.arrangeLayer();
	} else {
		var layer = stage.get("#layerCharRenameDialog")[0];
		layer.moveToTop();
		stage.draw();
	}

	var simpleText = charPanel.simpleText;

	var width = 200;
	var height = 180;
	var x = window.innerWidth / 2;
	var y = window.innerHeight / 2 - height / 2;

	var dialog = new DialogSmall({
		x : x,
		y : y,
		width : width,
		height : height,
		layer : layer
	});
	dialog.setDraggable(false);
	dialogBoxes.charPanelRenameDialog = dialog;

	var inputDivParent = dialog.inputDivParent;
	var TextField = dialog.TextField;
	$(inputDivParent).css({
		height : 30,
		//background: "green"
	});
	$(inputDivParent).offset({
		left : x + 5,
		top : y + 5 + 110,
	});
	var textField = new TextField("inputTextNewCharPanelName", simpleText.getText(), 5, 5);
	$(textField).offset({
		left : $(inputDivParent).offset().left + $(inputDivParent).width() / 2 - $(textField).width() / 2
	});
	textField.focus();

	dialog.renameCharPanel = function(newName) {
		var oldName = simpleText.getText();
		simpleText.setText(newName);
		charPanel.setId(newName);
		charPanel.getParent().draw();

		player.sceneCharacters[newName] = player.sceneCharacters[oldName];
		delete player.sceneCharacters[oldName];
		characterPanels.names.remove(oldName);

		dialogBoxes.close();
	};
	charPanel.renameCharPanel = dialog.renameCharPanel;

	dialog.rectPanel = charPanel.rectPanel.clone();
	dialog.rectPanel.setWidth(dialog.rectPanel.getWidth() * 1.5);
	dialog.rectPanel.setHeight(dialog.rectPanel.getHeight() * 1.5);
	dialog.rectPanel.setX(200 / 2 - dialog.rectPanel.getWidth() / 2);
	dialog.rectPanel.setY(20);
	dialog.rectPanel.setFillPatternScale(0.6);
	dialog.rectPanel.off('click');
	dialog.add(dialog.rectPanel);

	dialog.rectPanel.on('mouseup', function() {
		dialogBoxes.close();
		var dialogBox1 = new DialogBoxWithThumbnails(dialogBoxResources['character-create-changePanel']);
		dialogBoxes.push(dialogBox1);
	});

	//dialog.button1.off('click');
	dialog.button1.on('click', function() {
		var newName = textField.value;
		if (newName == "") {
			alert("Please enter a new name");
		} else if (characterPanels.names.containsKey(newName)) {
			alert("There is already an existing character with the same name!");
		} else {
			dialog.renameCharPanel(newName);
		}
	});

	dialog.superClose = dialog.close;
	dialog.close = function() {
		dialog.superClose();
		layer.destroy();
	};

	dialog.draw();
	return dialog;
};
var DialogLogin = function() {
	//dialogBoxes.close();
	dialogBoxes.closeSmallDialogs();
	var layer = new Kinetic.Layer({
		id : 'layerLogin'
	});
	stage.add(layer);
	stage.arrangeLayer();

	config = {
		x : window.innerWidth / 2,
		y : window.innerHeight / 2 - 180 / 2,
		width : 220,
		height : 260,
	};

	var dialog = new Kinetic.Group({
		x : config.x,
		y : config.y,
		draggable : false
	});
	layer.add(dialog);
	dialogBoxes.loginDialog = dialog;

	var rect = new Kinetic.Rect({
		width : config.width,
		height : config.height,
		stroke : '#C33745',
		strokeWidth : 6,
		cornerRadius : 10,
		fillLinearGradientColorStops : [0, '#E0E0E0', 0.5, '#F0F0F0', 1, '#E0E0E0'],
		fillLinearGradientStartPoint : [config.width, 0],
	});
	dialog.add(rect);

	var text = new Kinetic.Text({
		x : config.width / 2,
		y : 20,
		text : "ログインしてください",
		fontStyle : 'bold',
		fontSize : 20,
		fontFamily : 'calibri',
		fill : '#C33745',
	});
	text.setOffsetX(text.getWidth() / 2);
	dialog.add(text);

	var imageObj = new Image();
	imageObj.onload = function() {
		var image = new Kinetic.Image({
			id : "buttonLoginFacebook",
			x : config.width / 2 - 150 / 2,
			y : 50,
			width : 150,
			height : 50,
			image : imageObj
		});
		image.on('click', function() {
			window.open('./opauth/facebook', null, 'width=' + 1024 + ', ' + 'height=' + 768);
			dialog.close();
		});
		image.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		image.on('mouseout', function() {
			document.body.style.cursor = cursor;
		});
		dialog.add(image);
		image.draw();
	};
	imageObj.src = 'img/menuBar/facebook.png';

	var imageObj2 = new Image();
	imageObj2.onload = function() {
		var image2 = new Kinetic.Image({
			id : "buttonLoginGoogle",
			x : config.width / 2 - 150 / 2,
			y : 120,
			width : 150,
			height : 50,
			image : imageObj2
		});
		image2.on('click', function() {
			window.open('./opauth/google', null, 'width=' + 1024 + ', ' + 'height=' + 768);
			dialog.close();
		});
		image2.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		image2.on('mouseout', function() {
			document.body.style.cursor = cursor;
		});
		dialog.add(image2);
		image2.draw();
	};
	imageObj2.src = 'img/menuBar/google.png';

	var imageObj3 = new Image();
	imageObj3.onload = function() {
		var image3 = new Kinetic.Image({
			id : "buttonLoginTwitter",
			x : config.width / 2 - 150 / 2,
			y : 190,
			width : 150,
			height : 50,
			image : imageObj3
		});
		image3.on('click', function() {
			window.open('./opauth/twitter', null, 'width=' + 1024 + ', ' + 'height=' + 768);
			dialog.close();
		});
		image3.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		image3.on('mouseout', function() {
			document.body.style.cursor = cursor;
		});
		dialog.add(image3);
		image3.draw();
	};
	imageObj3.src = 'img/menuBar/twitter.png';

	var buttonX;
	var imageObjX = new Image();
	imageObjX.onload = function() {
		buttonX = new Kinetic.Image({
			id : 'buttonLoginClose',
			x : rect.getX() + rect.getWidth() - 12 - 8,
			y : rect.getY() + 8,
			width : 12,
			height : 12,
			image : imageObjX,
		});
		dialog.add(buttonX);
		dialog.draw();
		buttonX.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		buttonX.on('mouseout', function() {
			document.body.style.cursor = cursor;
		});
		buttonX.on('click', function() {
			dialogBoxes.close();
		});
	};
	imageObjX.src = 'img/dialogBox/cross2.png';

	dialog.close = function() {
		layer.destroy();
	};

	dialog.draw();
	return dialog;
};
var DialogRenameDiagram = function(index) {
	dialogBoxes.close();
	var layer = new Kinetic.Layer({
		id : "layerDiagRemoveDialog"
	});
	stage.add(layer);
	stage.arrangeLayer();

	var width = 200;
	var height = 90;
	var x = window.innerWidth / 2;
	var y = window.innerHeight / 2 - height / 2;

	var dialog = new DialogSmall({
		x : x,
		y : y,
		width : width,
		height : height,
		layer : layer
	});
	dialog.setDraggable(false);
	dialogBoxes.diagRenameDialog = dialog;

	var inputDivParent = dialog.inputDivParent;
	var TextField = dialog.TextField;
	$(inputDivParent).css({
		height : 55,
	});
	$(inputDivParent).offset({
		left : x + 5,
		top : y + 5,
	});
	var textField = new TextField("inputTextNewDialogName", stage.selectedPanel.selectedDiagram.label, 5, 25);
	$(textField).offset({
		left : $(inputDivParent).offset().left + $(inputDivParent).width() / 2 - $(textField).width() / 2
	});
	textField.focus();

	var simpleText = new Kinetic.Text({
		x : 10,
		y : 10,
		text : "新しい図名を入力してください:",
		fontStyle : 'normal',
		fontSize : 12,
		fontFamily : 'sans-serif',
		fill : 'black'
	});
	simpleText.setX(Math.round(dialog.rect.getWidth() / 2 - simpleText.getWidth() / 2));
	dialog.add(simpleText);

	dialog.renameDiagram = function(newLabel) {
		var id = stage.selectedPanel.array[index].getId();
		var oldLabel = stage.selectedPanel.array[index].label;
		var tabs = $(stage.selectedPanel.tabDiv).tabs();
		var ul = tabs.find(".ui-tabs-nav");
		ul[0].innerHTML = ul[0].innerHTML.replace(oldLabel, newLabel);
		stage.selectedPanel.array[index].label = newLabel;
		tabs.tabs("refresh");
		tabs.tabs("option", "active", index);
		tabs.tabs("refresh");
		dialogBoxes.close();
	};
	var diagramNameExist = function(name) {
		var array = stage.selectedPanel.array;
		for (var i = 0; i < array.length; i++) {
			if (array[i].label == name) {
				return true;
			}
		}
	};
	//dialog.button1.off('click');
	dialog.button1.on('click', function() {
		var newName = textField.value;
		if (newName == "") {
			alert("Please enter a new name");
		} else if (diagramNameExist(newName)) {
			alert("There is already an existing diagram with the same name!");
		} else {
			dialog.renameDiagram(newName);
		}
	});

	dialog.superClose = dialog.close;
	dialog.close = function() {
		dialog.superClose();
		layer.destroy();
	};

	dialog.draw();
	return dialog;
};
var DialogDuplicateCharacter = function(tabs) {
	dialogBoxes.close();
	var layer = new Kinetic.Layer({
		id : "layerDiagDuplicateChar"
	});
	stage.add(layer);
	stage.arrangeLayer();

	var width = 320;
	var height = 90;
	var x = window.innerWidth / 2 - 60;
	var y = window.innerHeight / 2 - height / 2;

	var dialog = new DialogSmall({
		x : x,
		y : y,
		width : width,
		height : height,
		layer : layer
	});
	dialog.setDraggable(false);
	dialogBoxes.diagDuplicateChar = dialog;

	var inputDivParent = dialog.inputDivParent;
	var TextField = dialog.TextField;
	$(inputDivParent).css({
		height : 55,
	});
	$(inputDivParent).offset({
		left : x + 5,
		top : y + 5,
	});
	var textField = new TextField("inputTextNewDialogName", stage.selectedPanel.selectedDiagram.label, 5, 25);
	$(textField).offset({
		left : $(inputDivParent).offset().left + $(inputDivParent).width() / 2 - $(textField).width() / 2
	});
	textField.focus();

	var simpleText = new Kinetic.Text({
		x : 10,
		y : 10,
		text : "複製された図の新しい名前を入力してください：",
		fontStyle : 'normal',
		fontSize : 12,
		fontFamily : 'sans-serif',
		fill : 'black'
	});
	simpleText.setX(Math.round(dialog.rect.getWidth() / 2 - simpleText.getWidth() / 2));
	dialog.add(simpleText);

	dialog.renameDiagram = function(label) {
		var tabs = $(stage.selectedPanel.tabDiv).tabs();
		var tabTemplate = "<li><a href='#{href}'>#{label}</a></li>";
		var currIndex = tabs.tabs("option", "active");
		var counter = stage.selectedPanel.tabDiv.counter;
		var id = "tabs-" + counter;

		var panelId = tabs.find(".ui-tabs-active")[0].childNodes[0].hash.replace("#", "");
		var diagram = stage.selectedPanel.diagrams[panelId];

		var li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));
		li.insertAfter(tabs.find(".ui-tabs-active"));
		tabs.append("<div id='" + id + "'></div>");
		tabs.tabs("refresh");
		stage.selectedPanel.tabDiv.counter++;

		var clonedDiagram = new DiagramLayer(id);
		clonedDiagram.drawDiagram(diagram.getXML());

		var charPanel = stage.selectedPanel;
		charPanel.diagrams[id] = clonedDiagram;
		charPanel.diagrams[id].label = label;
		charPanel.array.splice(currIndex + 1, 0, clonedDiagram);
		charPanel.array[currIndex + 1].label = label;
		tabs.tabs("option", "active", currIndex + 1);
		dialogBoxes.close();
	};
	var diagramNameExist = function(name) {
		var array = stage.selectedPanel.array;
		for (var i = 0; i < array.length; i++) {
			if (array[i].label == name) {
				return true;
			}
		}
	};

	dialog.button1.off('click');
	dialog.button1.on('click', function() {
		var newName = textField.value;
		if (newName == "") {
			alert("Please enter a new name");
		} else if (diagramNameExist(newName)) {
			alert("There is already an existing diagram with the same name!");
		} else {
			dialog.renameDiagram(newName);
		}
	});

	dialog.superClose = dialog.close;
	dialog.close = function() {
		dialog.superClose();
		layer.destroy();
	};

	dialog.draw();
	return dialog;
}; 