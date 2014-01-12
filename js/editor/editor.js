var m = 15;
var m2 = 8;
var menuBarHeight = 40;
var tabBarHeight = 35;
var iconSize = 32;
var radio = {};
var customMessages = {};
var OVALRADIUS = 32;
var cursor = 'default';
var measurementRectFunctionBar = {
	x : m,
	y : menuBarHeight + m + m,
	height : (iconSize + 20) * 3 + 13 * 4 + 20,
	width : iconSize + 23 * 2
};
var measurementRectDiagramEditor = {
	x : measurementRectFunctionBar.x + measurementRectFunctionBar.width + m + 80 + 20 + m2 * 2,
	y : m + menuBarHeight + m + m2,
	width : window.innerWidth - (measurementRectFunctionBar.x + measurementRectFunctionBar.width + m + 80 + 20 + m2 * 2) - m - m2,
	height : window.innerHeight - m * 2 - menuBarHeight - m * 2 - m2 * 2,
};

var characterPanels = new Array();
characterPanels.names = new Hashtable();
characterPanels.add = function(charPanel) {
	if (characterPanels.names.containsKey(charPanel.getId()) == false) {
		characterPanels.names.put(charPanel.getId(), 0);
	} else {
		var count = characterPanels.names.get(charPanel.getId());
		characterPanels.names.put(charPanel.getId(), ++count);
		var newName = charPanel.getId() + " (" + count + ")";
		charPanel.oriName = charPanel.getId();
		charPanel.setId(newName);
	}
	characterPanels.push(charPanel);
};

characterPanels.count = 0;

var stage = new Kinetic.Stage({
	x : 0,
	y : 0,
	container : 'canvas',
	width : window.innerWidth,
	height : window.innerHeight
});
stage.showHitCanvas = function(layer) {
	var hitCanvas = layer.hitCanvas.getElement();
	if (document.getElementById("hitCanvas") == undefined) {
		hitCanvas.style.position = "absolute";
		hitCanvas.style.top = window.innerHeight + "px";
		hitCanvas.setAttribute("id", "hitCanvas");
		document.body.appendChild(hitCanvas);
	};
};

stage.groups = new Hashtable();
stage.groups.isExistName = function(name){
	var exist = false;
	stage.groups.each(function(key, value){
		if(name == key){
			exist = true;
		}
	});
	return exist;
};
stage.groups.getAutoName = function(prefix){
	var count = 0;
	var name = prefix;
	while(stage.groups.isExistName(name) == true){
		count++;
		name = prefix + "" + count;
	}
	return name;	
};

var addIcon = function(config) {
	config.iconSize = (config.iconSize == undefined) ? 32 : config.iconSize;
	config.fontSize = (config.fontSize == undefined) ? 9 : config.fontSize;
	config.onClick = (config.onClick == undefined) ? function() {} : config.onClick;
	
	var button = new Kinetic.Group({
		id : config.id,
	});

	if (config.name != undefined) {
		button.setName(config.name);
	}

	button.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
		button.getChildren().each(function(shape) {
			shape.setShadowOffset(-1);
			shape.setShadowColor('black');
		});
		config.layer.draw();
	});
	button.on('mouseout', function() {
		document.body.style.cursor = cursor;
		button.getChildren().each(function(shape) {
			shape.setShadowOffset(0);
			shape.setShadowColor('#C0C0C0');
		});
		config.layer.getParent().draw();
	});
	button.on('click', config.onClick);
	button.buttonDown = false;

	if (config.effect3D) {
		var rect3D = new Kinetic.Rect({
			x : config.x - 12,
			y : config.y - 8,
			width : config.iconSize + 24,
			height : config.iconSize + 24,
			cornerRadius : 3,
			fill : '#E0E0E0',
			stroke : '#C0C0C0',
			strokeWidth : 1,
		});
		button.add(rect3D);
	};

	var imageObj = new Image();
	imageObj.onload = function() {
		var icon = new Kinetic.Image({
			image : imageObj,
			width : config.iconSize,
			height : config.iconSize,
		});
		var rect = new Kinetic.Rect({
			x : config.x,
			y : config.y,
			width : config.iconSize,
			height : config.iconSize,
			cornerRadius : 3,
			fillPatternImage : imageObj,
			shadowOpacity : 0.5,
			shadowBlur : 1,
		});
		button.add(rect);
		if(config.drawHitFunc != undefined) {
			rect.setDrawHitFunc(config.drawHitFunc);
		}

		if (config.effect3D) {
			rect.setDrawHitFunc(function(canvas) {
				var context = canvas.getContext();
				context.beginPath();
				context.rect(-12 - 2, -8 - 2, rect3D.getWidth() + 4, rect3D.getHeight() + 4);
				context.closePath();
				canvas.fillStroke(this);
			});
		}
		config.layer.add(button);
		if (config.layer.buttons == undefined) {
			config.layer.buttons = new Object();
		}
		config.layer.buttons[config.id] = button;
		config.layer.draw();
		if (config.onLoad != undefined) {
			config.onLoad();
		};
	};
	imageObj.src = config.source;

	if (config.addText) {
		var simpleText = new Kinetic.Text({
			x : config.x + config.iconSize / 2,
			y : config.y + config.iconSize + 2,
			text : config.text,
			fontSize : config.fontSize,
			fontFamily : 'sans-serif',
			fill : 'black',
			align : 'center',
			shadowOpacity : 0.5,
		});
		simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2));
		button.add(simpleText);
	}
};

var toggleRadio = function(button) {
	for (var id in radio) {
		radio[id].buttonDown = false;
		radio[id].setStroke('#F2F2F2');
		radio[id].setStrokeWidth(0);
		radio[id].draw();
	}
	button.buttonDown = true;
	button.setStroke('black');
	button.setStrokeWidth(1);
	button.draw();
};

var addRadioButton = function(config) {
	var imageObj = new Image();

	imageObj.onload = function() {
		var icon = new Kinetic.Image({
			image : imageObj,
			width : iconSize,
			height : iconSize,
		});
		var rect = new Kinetic.Rect({
			x : config.x,
			y : config.y,
			width : iconSize,
			height : iconSize,
			cornerRadius : 3,
			fillPatternImage : imageObj,
			id : config.id
		});
		radio[config.id] = rect;

		rect.on('mouseover', function() {
			if (!rect.buttonDown) {
				document.body.style.cursor = 'pointer';
				rect.setStroke('#C0C0C0'), rect.setStrokeWidth(0.5);
				rect.draw();
			}
		});
		rect.on('mouseout', function() {
			if (!rect.buttonDown) {
				document.body.style.cursor = cursor;
				rect.setStroke('#F2F2F2');
				rect.setStrokeWidth(0);
				rect.draw();
			}
		});
		rect.on('click', config.onClick);

		config.layer.add(rect);
		config.layer.draw();

		// Initialize toolbar to buttonOval
		if (rect.getId() == 'buttonOval') {
			toggleRadio(rect);
		}
	};
	imageObj.src = config.source;
};

var addButton = function(configButton) {
	var button = new Kinetic.Group({
		id : (configButton.id != undefined) ? configButton.id : "button"
	});

	var rectButton = new Kinetic.Rect({
		x : configButton.x,
		y : configButton.y,
		width : configButton.width,
		height : configButton.height,
		cornerRadius : 4,
		fillLinearGradientStartPointY : 0,
		fillLinearGradientEndPointY : configButton.height,
	});
	var colorStops = (configButton.isMain == true) ? [0, '#3EA3FD', 1, '#01529A'] : [0, '#A9D6FE', 1, '#38A0FE'];
	rectButton.setFillLinearGradientColorStops(colorStops);
	button.add(rectButton);
	button.rect = rectButton;

	var simpleText = new Kinetic.Text({
		x : Math.round(rectButton.getX() + configButton.width / 2),
		y : Math.round(rectButton.getY() + configButton.height / 2),
		text : configButton.text,
		fontSize : 12,
		fontFamily : 'sans-serif',
		fill : 'white',
		align : 'center',
		listening : false,
	});
	simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2));
	simpleText.setOffsetY(Math.round(simpleText.getHeight() / 2));
	button.add(simpleText);
    
	button.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
		if (configButton.isMain == true) {
			simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2) + 2);
		};
		colorStops = [0, '#01529A', 1, '#3EA3FD'];
		rectButton.setFillLinearGradientColorStops(colorStops);
		configButton.layer.draw();
	});
	button.on('mouseout', function() {
        document.body.style.cursor = cursor;
		colorStops = (configButton.isMain == true) ? [0, '#3EA3FD', 1, '#01529A'] : [0, '#A9D6FE', 1, '#38A0FE'];
		if (configButton.isMain == true) {
			simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2));
		};
		rectButton.setFillLinearGradientColorStops(colorStops);
		configButton.layer.draw();
	});
	button.on('click', configButton.onClick);
	configButton.layer.add(button);
	return button;
};

var addImage = function(config) {
	var imageObj = new Image();
	imageObj.onload = function() {
		var image = new Kinetic.Image({
			id : config.id,
			x : config.x,
			y : config.y,
			width : config.width,
			height : config.width,
			image : imageObj
		});
		if (config.varParent != undefined) {
			config.varParent[config.id] = image;
		}
		if(config.onLoad != undefined) {
			config.onLoad();
		}
	};

	imageObj.src = config.src;
};
stage.images = {};
addImage({
	id : "imgMouse",
	x : 0,
	y : 0,
	width : 20,
	height : 20,
	src : "img/arrowToolbar/mouse.png",
	varParent : stage.images,
	onLoad : openingFile
});
addImage({
	id : "imgCollide",
	x : 0,
	y : 0,
	width : 20,
	height : 20,
	src : "img/arrowToolbar/explosion.png",
	varParent : stage.images
});
addImage({
	id : "imgMouseRed",
	x : 0,
	y : 0,
	width : 20,
	height : 20,
	src : "img/arrowToolbar/mouse-red.png",
	varParent : stage.images,
	onLoad : openingFile
});
addImage({
	id : "imgCollideRed",
	x : 0,
	y : 0,
	width : 20,
	height : 20,
	src : "img/arrowToolbar/explosion-red.png",
	varParent : stage.images
});

function openingFile(){
	if(localStorage.openingFile != undefined && localStorage.openingFile != "false") {
		var filename = localStorage.openingFile;
		setTimeout(function(){
			Xml3di(filename);
		}, 1000);
	}
	localStorage.openingFile = false;
}

stage.arrangeLayer = function() {
	if (stage.get('#layerAvatar')[0] != undefined) {
		stage.get('#layerAvatar')[0].moveToTop();
		stage.get('#layerAvatar')[0].draw();
	}
};

$(window).bind('beforeunload', function(){
	return 'You will lose any unsaved changes!';
});
