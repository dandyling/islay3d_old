var DialogBox = function(config) {
	config.callback = (config.callback == undefined) ? function() {
	} : config.callback;

	var layer = new Kinetic.Layer({
		id : "dialogBoxLayer"
	});

	var dialogBox = new Kinetic.Group({
		id : config.id
	});

	var rect = new Kinetic.Rect({
		x : Math.round(window.innerWidth / 2 - config.width / 2),
		y : Math.round(window.innerHeight / 2 - config.height / 2),
		width : config.width,
		height : config.height,
		stroke : 'black',
		strokeWidth : 1,
		shadowOffset : 3,
		shadowColor : 'gray',
		fill : 'white',
		cornerRadius : 8,
	});
	dialogBox.add(rect);
	dialogBox.rect = rect;

	var titleBar = new Image();
	titleBar.onload = function() {
		var titleGroup = new Kinetic.Group();
		titleGroup.on('mouseover', function() {
			dialogBox.setDraggable(true);
			document.body.style.cursor = 'pointer';
		});
		titleGroup.on('mouseout', function() {
			dialogBox.setDraggable(false);
			document.body.style.cursor = cursor;
		});

		var image = new Kinetic.Image({
			image : titleBar,
			width : 500,
			height : 100
		});
		var rectTab = new Kinetic.Rect({
			x : rect.getX() + 4,
			y : rect.getY() + 4,
			width : rect.getWidth() - 8,
			height : tabBarHeight,
			cornerRadius : 8,
			fillPatternImage : titleBar,
			stroke : 'black',
			strokeWidth : 1
		});
		titleGroup.add(rectTab);

		var simpleText = new Kinetic.Text({
			x : rectTab.getX() + rectTab.getWidth() / 2,
			y : rectTab.getY() + rectTab.getHeight() / 2,
			text : config.title,
			fontSize : 18,
			fontStyle : 'bold',
			fontFamily : 'sans-serif',
			fill : 'white',
			align : 'center',
			shadowOpacity : 0.5,
		});
		simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2));
		simpleText.setOffsetY(Math.round(simpleText.getHeight() / 2));
		titleGroup.add(simpleText);

		dialogBox.add(titleGroup);
		layer.draw();
	};
	titleBar.src = 'img/tabBar2.png';

	var crossButton = new Image();
	crossButton.onload = function() {
		var image = new Kinetic.Image({
			image : crossButton,
			width : 20,
			height : 20
		});
		var rectButton = new Kinetic.Rect({
			x : rect.getX() + rect.getWidth() - 8 - 20,
			y : rect.getY() + 10,
			width : 20,
			height : 20,
			fillPatternImage : crossButton,
		});
		rectButton.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		rectButton.on('mouseout', function() {
			document.body.style.cursor = cursor;
		});
		rectButton.on('click', function() {
			dialogBoxes.close();
		});
		dialogBox.add(rectButton);
		rectButton.moveToTop();
		layer.draw();
	};
	crossButton.src = 'img/dialogBox/cross.png';

	for (var i = 0; i < config.buttons.length; i++) {
		config.buttons[i].layer = dialogBox;
		addButton(config.buttons[i]);
	}

	layer.add(dialogBox);
	stage.add(layer);
	stage.arrangeLayer();

	config.callback();

	return dialogBox;
};

var DialogBoxWithThumbnails = function(config) {
	var m2 = 8;
	var bottomMargin = 60;

	var dialogBox = new DialogBox(config);
	var rect = dialogBox.rect;

	var rect2 = new Kinetic.Rect({
		x : rect.getX() + m2,
		y : rect.getY() + tabBarHeight + m2,
		width : config.width - m2 * 2,
		height : config.height - tabBarHeight - m2 * 2 - bottomMargin,
		stroke : 'black',
		fill : '#333333',
		strokeWidth : 1,
	});

	dialogBox.scrollBar = new Kinetic.Rect({
		x : rect2.getX() + rect2.getWidth() - 16,
		y : rect2.getY() + 6,
		width : 12,
		height : rect2.getHeight() - 12,
		fill : 'white',
		cornerRadius : 6,
		draggable : true,
		dragBoundFunc : function(pos) {
			var newY = pos.y;
			if (newY < rect2.getY() + 6) {
				newY = rect2.getY() + 6;
			} else if (newY > rect2.getY() + rect2.getHeight() - 6 - dialogBox.scrollBar.getHeight()) {
				newY = rect2.getY() + rect2.getHeight() - 6 - dialogBox.scrollBar.getHeight();
			}
			return {
				x : this.getAbsolutePosition().x,
				y : newY
			};
		}
	});
	dialogBox.scrollBar.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	dialogBox.scrollBar.on('mouseout', function() {
		document.body.style.cursor = cursor;
	});
	dialogBox.scrollBar.on('dragend', function() {
		var height = rect2.getHeight() - dialogBox.scrollBar.getHeight() - 12;
		var currentY = dialogBox.scrollBar.getY() - rect2.getY() - 6;
		var ratio = currentY / height;
		dialogBox.panels.tween = new Kinetic.Tween({
			node : dialogBox.panels,
			easing : Kinetic.Easings.EaseInOut,
			offsetY : ratio * (dialogBox.panels.getHeight() - rect2.getHeight()),
			duration : 0.5
		});
		dialogBox.panels.tween.play();
	});

	dialogBox.panels = new Kinetic.Group();
	dialogBox.panels.getHeight = function() {
		var children = dialogBox.panels.getChildren();
		var widthMin = 20000;
		var widthMax = 0;
		for (var i = 0; i < children.length; i++) {
			if (children[i].rectFrame.getY() < widthMin) {
				widthMin = children[i].rectFrame.getY();
			}
			if (children[i].rectFrame.getY() + children[i].rectFrame.getWidth() > widthMax) {
				widthMax = children[i].rectFrame.getY() + children[i].rectFrame.getWidth();
			}
		}
		return widthMax - widthMin;
	};

	var addPanel = function(config) {
		var m3 = 4;
		var mText = 8;
		var panel = new Kinetic.Group();
		panel.config = config;

		panel.width = 100;
		panel.height = 75;

		panel.on('click', config.onClick);

		var preview = new Image();
		preview.onload = function() {
			var image = new Kinetic.Image({
				image : preview
			});

			var column = dialogBox.panels.getChildren().length % 5;
			var row = Math.floor(dialogBox.panels.getChildren().length / 5);

			var posX = rect2.getX() + m2 + (panel.width + m3 * 2 + m2) * column;
			var posY = rect2.getY() + m2 + (panel.width + m3 * 3) * row;

			var rectFrame = new Kinetic.Rect({
				x : posX,
				y : posY,
				width : panel.width + m3 * 2,
				height : panel.height + m3 * 3 + mText,
				stroke : 'black',
				fill : 'white',
				cornerRadius : '4',
				strokeWidth : 1,
				shadowOffset : 4
			});
			panel.add(rectFrame);
			panel.rectFrame = rectFrame;

			var rectPanel = new Kinetic.Rect({
				x : rectFrame.getX() + m3,
				y : rectFrame.getY() + m3,
				width : panel.width,
				height : panel.height,
				fillPatternImage : preview,
				fillPatternScale : config.scale,
				stroke : 'black',
				strokeWidth : 1
			});
			panel.add(rectPanel);

			if (config.onMouseOver != undefined) {
				rectPanel.on('mouseover', config.onMouseOver);
			}
			if (config.onMouseOut != undefined) {
				rectPanel.on('mouseout', config.onMouseOut);
			}

			rectPanel.superDestroy = rectPanel.destroy;
			rectPanel.destroy = function() {
				rectPanel.off('mouseout');
				rectPanel.superDestroy();
			};

			var simpleText = new Kinetic.Text({
				x : rectPanel.getX() + panel.width / 2,
				y : rectPanel.getY() + panel.height + 2,
				text : config.name.replace(config.mime, ""),
				fontStyle : 'bold',
				fontSize : 9,
				fontFamily : 'sans-serif',
				fill : 'black',
				align : 'center',
				shadowOpacity : 0.5,
			});
			simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2));
			panel.add(simpleText);
			dialogBox.panels.add(panel);
			if (dialogBox.panels.getHeight() < rect2.getHeight()) {
				dialogBox.scrollBar.hide();
			} else {
				dialogBox.scrollBar.show();
				dialogBox.scrollBar.setHeight(rect2.getHeight() / dialogBox.panels.getHeight() * rect2.getHeight() - 12);
			}

			dialogBox.getParent().draw();
		};
		preview.src = config.path;
	};

	var setThumbnails = function() {
		readdir({
			path : config.thumbnails.path,
			mime : config.thumbnails.mime,
			callback : function(thumbnails) {
				for (var i = 0; i < thumbnails.length; i++) {
					addPanel({
						name : thumbnails[i].replace('.png', ""),
						mime : '.png',
						path : config.thumbnails.path + thumbnails[i],
						scale : config.thumbnails.scale,
						onClick : config.thumbnails.onClick,
						onMouseOver : config.thumbnails.onMouseOver,
						onMouseOut : config.thumbnails.onMouseOut,
					});
				}
			}
		});
	};

	var rectInner = new Kinetic.Group({
		clip : [rect2.getX() + 1, rect2.getY() + 1, rect2.getWidth() - 2, rect2.getHeight() - 2]
	});

	rectInner.add(rect2);
	rectInner.add(dialogBox.panels);
	rectInner.add(dialogBox.scrollBar);
	dialogBox.add(rectInner);

	setThumbnails();

	return dialogBox;
};

var DialogBoxWithAddThumbnails = function(config) {
	var m2 = 8;
	var topMargin = 80;
	var bottomMargin = 60;

	var dialogBox = new DialogBox(config);
	var rect = dialogBox.rect;

	var rectSelect = new Kinetic.Rect({
		x : rect.getX() + m2,
		y : rect.getY() + tabBarHeight + m2,
		width : config.width - m2 * 2,
		height : 80,
		stroke : 'black',
		fill : '#FFFFFF',
		strokeWidth : 1,
	});

	var rectSelectInner = new Kinetic.Group({
		clip : [rectSelect.getX() + 1, rectSelect.getY() + 1, rectSelect.getWidth() - 2, rectSelect.getHeight() - 2]
	});

	dialogBox.selectPanels = new Kinetic.Group();

	var addSelectPanel = function(config) {
		var m3 = 4;
		var mText = 8;
		var panel = new Kinetic.Group();
		panel.config = config;

		panel.width = 60;
		panel.height = 45;

		panel.on('click', config.onClick);

		var preview = new Image();
		preview.onload = function() {
			var image = new Kinetic.Image({
				image : preview
			});

			var column = dialogBox.selectPanels.getChildren().length;
			var posX = rectSelect.getX() + m2 + (panel.width + m3 * 2 + m2) * column;
			var posY = rectSelect.getY() + m2;

			var rectPanel = new Kinetic.Rect({
				x : posX,
				y : posY,
				width : panel.width,
				height : panel.height,
				fillPatternImage : preview,
				fillPatternScale : config.scale,
				stroke : '#222222',
				strokeWidth : 1
			});
			panel.add(rectPanel);

			if (config.onMouseOver != undefined) {
				rectPanel.on('mouseover', config.onMouseOver);
			}
			if (config.onMouseOut != undefined) {
				rectPanel.on('mouseout', config.onMouseOut);
			}

			rectPanel.superDestroy = rectPanel.destroy;
			rectPanel.destroy = function() {
				rectPanel.off('mouseout');
				rectPanel.superDestroy();
			};

			/*var simpleText = new Kinetic.Text({
			 x : rectPanel.getX() + panel.width / 2,
			 y : rectPanel.getY() + panel.height + 2,
			 text : config.name.replace(config.mime, ""),
			 fontStyle : 'bold',
			 fontSize : 9,
			 fontFamily : 'sans-serif',
			 fill : 'black',
			 align : 'center',
			 shadowOpacity : 0.5,
			 });
			 simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2));
			 panel.add(simpleText);*/
			dialogBox.selectPanels.add(panel);
			/*if (dialogBox.panels.getHeight() < rect2.getHeight()) {
			 dialogBox.scrollBar.hide();
			 } else {
			 dialogBox.scrollBar.show();
			 dialogBox.scrollBar.setHeight(rect2.getHeight() / dialogBox.panels.getHeight() * rect2.getHeight() - 12);
			 }*/

			dialogBox.getParent().draw();
		};
		preview.src = config.path;
	};

	var setSelectThumbnails = function() {
		console.log(characterPanels);
		for (var i = 0; i < characterPanels.length; i++) {
			addSelectPanel({
				name : characterPanels[i].getId(),
				
			});
		}

		readdir({
			path : config.thumbnailsSelect.path,
			mime : config.thumbnailsSelect.mime,
			callback : function(thumbnailsSelect) {
				for (var i = 0; i < thumbnailsSelect.length; i++) {
					addSelectPanel({
						name : thumbnailsSelect[i].replace('.png', ""),
						mime : '.png',
						path : config.thumbnailsSelect.path + thumbnailsSelect[i],
						scale : config.thumbnailsSelect.scale,
						onClick : config.thumbnailsSelect.onClick,
						onMouseOver : config.thumbnailsSelect.onMouseOver,
						onMouseOut : config.thumbnailsSelect.onMouseOut,
					});
				}
			}
		});
	};

	rectSelectInner.add(rectSelect);
	rectSelectInner.add(dialogBox.selectPanels);
	dialogBox.add(rectSelectInner);

	setSelectThumbnails();

	var rect2 = new Kinetic.Rect({
		x : rect.getX() + m2,
		y : rect.getY() + tabBarHeight + topMargin + m2,
		width : config.width - m2 * 2,
		height : config.height - tabBarHeight - m2 * 2 - bottomMargin - topMargin,
		stroke : 'black',
		fill : '#333333',
		strokeWidth : 1,
	});

	dialogBox.scrollBar = new Kinetic.Rect({
		x : rect2.getX() + rect2.getWidth() - 16,
		y : rect2.getY() + 6,
		width : 12,
		height : rect2.getHeight() - 12,
		fill : 'white',
		cornerRadius : 6,
		draggable : true,
		dragBoundFunc : function(pos) {
			var newY = pos.y;
			if (newY < rect2.getY() + 6) {
				newY = rect2.getY() + 6;
			} else if (newY > rect2.getY() + rect2.getHeight() - 6 - dialogBox.scrollBar.getHeight()) {
				newY = rect2.getY() + rect2.getHeight() - 6 - dialogBox.scrollBar.getHeight();
			}
			return {
				x : this.getAbsolutePosition().x,
				y : newY
			};
		}
	});
	dialogBox.scrollBar.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	dialogBox.scrollBar.on('mouseout', function() {
		document.body.style.cursor = cursor;
	});
	dialogBox.scrollBar.on('dragend', function() {
		var height = rect2.getHeight() - dialogBox.scrollBar.getHeight() - 12;
		var currentY = dialogBox.scrollBar.getY() - rect2.getY() - 6;
		var ratio = currentY / height;
		dialogBox.panels.tween = new Kinetic.Tween({
			node : dialogBox.panels,
			easing : Kinetic.Easings.EaseInOut,
			offsetY : ratio * (dialogBox.panels.getHeight() - rect2.getHeight()),
			duration : 0.5
		});
		dialogBox.panels.tween.play();
	});

	dialogBox.panels = new Kinetic.Group();
	dialogBox.panels.getHeight = function() {
		var children = dialogBox.panels.getChildren();
		var widthMin = 20000;
		var widthMax = 0;
		for (var i = 0; i < children.length; i++) {
			if (children[i].rectFrame.getY() < widthMin) {
				widthMin = children[i].rectFrame.getY();
			}
			if (children[i].rectFrame.getY() + children[i].rectFrame.getWidth() > widthMax) {
				widthMax = children[i].rectFrame.getY() + children[i].rectFrame.getWidth();
			}
		}
		return widthMax - widthMin;
	};

	var addPanel = function(config) {
		var m3 = 4;
		var mText = 8;
		var panel = new Kinetic.Group();
		panel.config = config;

		panel.width = 100;
		panel.height = 75;

		panel.on('click', config.onClick);

		var preview = new Image();
		preview.onload = function() {
			var image = new Kinetic.Image({
				image : preview
			});

			var column = dialogBox.panels.getChildren().length % 5;
			var row = Math.floor(dialogBox.panels.getChildren().length / 5);

			var posX = rect2.getX() + m2 + (panel.width + m3 * 2 + m2) * column;
			var posY = rect2.getY() + m2 + (panel.width + m3 * 3) * row;

			var rectFrame = new Kinetic.Rect({
				x : posX,
				y : posY,
				width : panel.width + m3 * 2,
				height : panel.height + m3 * 3 + mText,
				stroke : 'black',
				fill : 'white',
				cornerRadius : '4',
				strokeWidth : 1,
				shadowOffset : 4
			});
			panel.add(rectFrame);
			panel.rectFrame = rectFrame;

			var rectPanel = new Kinetic.Rect({
				x : rectFrame.getX() + m3,
				y : rectFrame.getY() + m3,
				width : panel.width,
				height : panel.height,
				fillPatternImage : preview,
				fillPatternScale : config.scale,
				stroke : 'black',
				strokeWidth : 1
			});
			panel.add(rectPanel);

			if (config.onMouseOver != undefined) {
				rectPanel.on('mouseover', config.onMouseOver);
			}
			if (config.onMouseOut != undefined) {
				rectPanel.on('mouseout', config.onMouseOut);
			}

			rectPanel.superDestroy = rectPanel.destroy;
			rectPanel.destroy = function() {
				rectPanel.off('mouseout');
				rectPanel.superDestroy();
			};

			var simpleText = new Kinetic.Text({
				x : rectPanel.getX() + panel.width / 2,
				y : rectPanel.getY() + panel.height + 2,
				text : config.name.replace(config.mime, ""),
				fontStyle : 'bold',
				fontSize : 9,
				fontFamily : 'sans-serif',
				fill : 'black',
				align : 'center',
				shadowOpacity : 0.5,
			});
			simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2));
			panel.add(simpleText);
			dialogBox.panels.add(panel);
			if (dialogBox.panels.getHeight() < rect2.getHeight()) {
				dialogBox.scrollBar.hide();
			} else {
				dialogBox.scrollBar.show();
				dialogBox.scrollBar.setHeight(rect2.getHeight() / dialogBox.panels.getHeight() * rect2.getHeight() - 12);
			}

			dialogBox.getParent().draw();
		};
		preview.src = config.path;
	};

	var setThumbnails = function() {
		readdir({
			path : config.thumbnails.path,
			mime : config.thumbnails.mime,
			callback : function(thumbnails) {
				for (var i = 0; i < thumbnails.length; i++) {
					addPanel({
						name : thumbnails[i].replace('.png', ""),
						mime : '.png',
						path : config.thumbnails.path + thumbnails[i],
						scale : config.thumbnails.scale,
						onClick : config.thumbnails.onClick,
						onMouseOver : config.thumbnails.onMouseOver,
						onMouseOut : config.thumbnails.onMouseOut,
					});
				}
			}
		});
	};

	var rectInner = new Kinetic.Group({
		clip : [rect2.getX() + 1, rect2.getY() + 1, rect2.getWidth() - 2, rect2.getHeight() - 2]
	});

	rectInner.add(rect2);
	rectInner.add(dialogBox.panels);
	rectInner.add(dialogBox.scrollBar);
	dialogBox.add(rectInner);

	setThumbnails();

	return dialogBox;
};

var DialogBoxImage = function(config) {
	var dialogBox = new DialogBox(config);
	var rect = dialogBox.rect;

	if (localStorage.playerScreenshot != undefined) {
		var preview = new Image();
		preview.onload = function() {
			var image = new Kinetic.Image({
				image : preview
			});

			var rect2 = new Kinetic.Rect({
				x : Math.round(rect.getX() + rect.getWidth() / 2 - 256 / 2),
				y : Math.round(rect.getY() + rect.getHeight() / 2 - 192 / 2 - 20),
				width : 256,
				height : 192,
				fillPatternImage : preview,
				fillPatternScaleX : 0.4,
				fillPatternScaleY : 0.4,
				stroke : 'black',
				strokeWidth : '1'
			});
			dialogBox.add(rect2);
			dialogBox.draw();
		};
		preview.src = localStorage.playerScreenshot;
	} else {
		var rect2 = new Kinetic.Rect({
			x : Math.round(rect.getX() + rect.getWidth() / 2 - 256 / 2),
			y : Math.round(rect.getY() + rect.getHeight() / 2 - 192 / 2 - 20),
			width : 256,
			height : 192,
			stroke : 'black',
			strokeWidth : '1'
		});
		dialogBox.add(rect2);
		dialogBox.draw();
	}

	var inputDivParent = document.createElement("div");
	document.body.appendChild(inputDivParent);
	$(inputDivParent).css({
		width : rect.getWidth() - 10,
		height : rect.getHeight() - 90,
		//background: "green"
	});
	$(inputDivParent).offset({
		left : rect.getAbsolutePosition().x + 5,
		top : rect.getAbsolutePosition().y + 45,
	});

	var textField = document.createElement("input");
	inputDivParent.appendChild(textField);
	$(textField).attr({
		id : 'textfield-filename',
		size : 50,
		placeholder : "untitled"
	});
	$(textField).offset({
		left : Math.round(rect.getX() + rect.getWidth() / 2 - $(textField).width() / 2),
		top : Math.round(rect.getY() + rect.getHeight() - 80),
	});
	textField.focus();

	dialogBox.superDestroy = dialogBox.destroy;
	dialogBox.destroy = function() {
		dialogBox.superDestroy();
		document.body.removeChild(inputDivParent);
	};
	return dialogBox;
};
