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
	var topMargin = 65;
	var bottomMargin = 60;

	var dialogBox = new DialogBox(config);
	var rect = dialogBox.rect;

	var rectSelect = new Kinetic.Rect({
		x : rect.getX() + m2 + 15,
		y : rect.getY() + tabBarHeight + m2,
		width : config.width - m2 * 2 - 30,
		height : 64,
		stroke : 'black',
		fill : '#FFFFFF',
		strokeWidth : 1,
	});

	var triangleLeft = new Kinetic.Polygon({
		points : [rectSelect.getX(), rectSelect.getY() + 6, rectSelect.getX(), rectSelect.getY() + 60 - 6, rectSelect.getX() - 15, rectSelect.getY() + 32],
		fill : '#DDDDDD',
	});
	triangleLeft.on('click', function() {
		var width = (60 + m2 + m2);
		var diff = Math.abs(dialogBox.selectPanels.getX() - rectSelect.getX() - m2);
		var remainder = diff % width;
		var multiple = Math.floor(diff / width);
		var displacement = width * ((multiple > 0) ? 1 : 0) + remainder;
		if (dialogBox.selectPanels.getX() < rectSelect.getX() + m2) {
			var tweenLeft = new Kinetic.Tween({
				node : dialogBox.selectPanels,
				easing : Kinetic.Easings.EaseInOut,
				x : dialogBox.selectPanels.getX() + displacement,
				duration : 0.2
			});
			tweenLeft.play();
		}
	});
	dialogBox.add(triangleLeft);

	var triangleRight = new Kinetic.Polygon({
		points : [rectSelect.getX() + rectSelect.getWidth(), rectSelect.getY() + 6, rectSelect.getX() + rectSelect.getWidth(), rectSelect.getY() + 60 - 6, rectSelect.getX() + rectSelect.getWidth() + 15, rectSelect.getY() + 32],
		fill : '#DDDDDD',
	});
	triangleRight.on('click', function() {
		var width = (60 + m2 + m2);
		var diff = Math.abs(dialogBox.selectPanels.getMax() - rectSelect.getX() - rectSelect.getWidth() + m2);
		var remainder = diff % width;
		var multiple = Math.floor(diff / width);
		var displacement = width * ((multiple > 0) ? 1 : 0) + remainder;
		if (dialogBox.selectPanels.getMax() > rectSelect.getX() + rectSelect.getWidth() - m2) {
			var tweenRight = new Kinetic.Tween({
				node : dialogBox.selectPanels,
				easing : Kinetic.Easings.EaseInOut,
				x : dialogBox.selectPanels.getX() - displacement,
				duration : 0.2
			});
			tweenRight.play();
		}
	});
	dialogBox.add(triangleRight);

	var rectSelectInner = new Kinetic.Group({
		clip : [rectSelect.getX() + 1, rectSelect.getY() + 1, rectSelect.getWidth() - 2, rectSelect.getHeight() - 2]
	});

	dialogBox.selectPanels = new Kinetic.Group({
		x : rectSelect.getX() + m2,
		y : rectSelect.getY() + m2
	});
	dialogBox.selectPanels.getMax = function() {
		var children = dialogBox.selectPanels.getChildren();
		var lastChild = children[children.length - 1];
		return dialogBox.selectPanels.getX() + lastChild.getX() + 60;
	};

	var addSelectPanel = function(configSelect) {
		var m3 = 4;
		var mText = 8;
		var panel = new Kinetic.Group();

		panel.config = configSelect;
		panel.width = 60;
		panel.height = 45;

		var preview = new Image();
		preview.onload = function() {
			var image = new Kinetic.Image({
				image : preview
			});

			var column = dialogBox.selectPanels.getChildren().length;
			var posX = (panel.width + m3 * 2 + m2) * column;
			//console.log(column, posX);
			panel.setX(posX);

			var rectPanel = new Kinetic.Rect({
				width : panel.width,
				height : panel.height,
				fillPatternImage : preview,
				fillPatternScale : configSelect.scale,
				stroke : '#222222',
				strokeWidth : 1
			});
			panel.add(rectPanel);

			rectPanel.on('mouseover', function(e) {
				document.body.style.cursor = 'pointer';

				var layer = stage.get('#group-create')[0].getParent();
				var tooltip = new Kinetic.Label({
					x : this.getAbsolutePosition().x - 4,
					y : this.getAbsolutePosition().y - 4,
					opacity : 0.75
				});
				tooltip.add(new Kinetic.Tag({
					fill : 'white',
					shadowColor : 'black',
					shadowBlur : 10,
					shadowOffset : 10,
					shadowOpacity : 0.5
				}));
				tooltip.add(new Kinetic.Text({
					text : configSelect.name,
					fontFamily : 'Calibri',
					fontSize : 14,
					padding : 5,
					fill : 'black'
				}));
				tooltip.setOffsetY(tooltip.get('Text')[0].getHeight());

				layer.tooltips.push(tooltip);
				layer.add(tooltip);
				tooltip.draw();
			});

			rectPanel.on('mouseout', function(e) {
				document.body.style.cursor = cursor;

				var layer = stage.get('#group-create')[0].getParent();
				while (layer.tooltips.length != 0) {
					var tooltip = layer.tooltips.pop();
					tooltip.destroy();
				}
				layer.draw();
			});

			rectPanel.on('click', function() {
				addPanel({
					name : configSelect.name,
					path : configSelect.path,
					scale : 0.5,
				});
			});

			rectPanel.superDestroy = rectPanel.destroy;
			rectPanel.destroy = function() {
				rectPanel.off('mouseout');
				rectPanel.superDestroy();
			};

			dialogBox.selectPanels.add(panel);

			dialogBox.getParent().draw();
		};
		preview.src = configSelect.path;
	};

	var setSelectThumbnails = function() {
		for (var i = 0; i < characterPanels.length; i++) {
			if(characterPanels[i].groupXML == undefined){
				addSelectPanel({
					name : characterPanels[i].getId(),
					path : characterPanels[i].path,
					scale : config.thumbnailsSelect.scale,
				});
			};
		}
	};

	rectSelectInner.add(rectSelect);
	rectSelectInner.add(dialogBox.selectPanels);
	dialogBox.add(rectSelectInner);

	setSelectThumbnails();

	/******************* Code for Group follows **********************/
	var titleMargin = 40;

	var rect2 = new Kinetic.Rect({
		x : rect.getX() + m2,
		y : rect.getY() + tabBarHeight + topMargin + m2,
		width : config.width - m2 * 2,
		height : config.height - tabBarHeight - m2 * 2 - bottomMargin - topMargin,
		stroke : 'black',
		fill : '#333333',
		strokeWidth : 1,
	});

	var groupName = stage.groups.getAutoName("グループ1");
	
	var simpleText = new Kinetic.Text({
		x : rect2.getX() + rect2.getWidth() / 2 - 50 - 10,
		y : rect2.getY() + 16,
		text : "グループ名",
		fontSize : 16,
		fontFamily : 'sans-serif',
		fill : 'white',
		align : 'right',
	});
	simpleText.setOffsetX(Math.round(simpleText.getWidth()));
	
	var inputDivParent = document.createElement("div");
	document.body.appendChild(inputDivParent);
	$(inputDivParent).css({
		width : rect2.getWidth(),
		height : titleMargin,
		//background: "green"
	});
	$(inputDivParent).offset({
		left : rect2.getX(),
		top : rect2.getY(),
	});
	dialogBox.inputDivParent = inputDivParent;
	
	var textField = document.createElement("input");
	inputDivParent.appendChild(textField);
	textField.value = groupName;
	//textField.setAttribute("placeholder", groupName);
	textField.style.position = "absolute";
	textField.style.top = "10px";
	textField.style.left = (rect2.getWidth()/2 - 50) + "px";
	dialogBox.textField = textField;
	//
	/*var imgEdit = stage.images['imgWhiteEdit'].clone();
	imgEdit.setAttrs({
		x : simpleText.getX() + simpleText.getWidth()/2 + 10,
		y : simpleText.getY() - 2,
	});*/
	
	dialogBox.scrollBar = new Kinetic.Rect({
		x : rect2.getX() + rect2.getWidth() - 16,
		y : rect2.getY() + 6 + titleMargin,
		width : 12,
		height : rect2.getHeight() - 12,
		fill : 'white',
		cornerRadius : 6,
		draggable : true,
		dragBoundFunc : function(pos) {
			var newY = pos.y;
			if (newY < rect2.getY() + 6 + titleMargin) {
				newY = rect2.getY() + 6 + titleMargin;
			} else if (newY > rect2.getY() + rect2.getHeight() - 6 - dialogBox.scrollBar.getHeight()) {
				newY = rect2.getY() + rect2.getHeight() - 6 - dialogBox.scrollBar.getHeight();
			}
			return {
				x : this.getAbsolutePosition().x,
				y : newY
			};
		}
	});
	dialogBox.scrollBar.refresh = function() {
		if (dialogBox.panels.getHeight() < rect2.getHeight() - titleMargin) {
			dialogBox.scrollBar.hide();
		} else {
			dialogBox.scrollBar.show();
			dialogBox.scrollBar.setHeight((rect2.getHeight()-titleMargin)  / dialogBox.panels.getHeight() * (rect2.getHeight()-titleMargin) - 12);
		}
		dialogBox.draw();
	};
	dialogBox.scrollBar.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	dialogBox.scrollBar.on('mouseout', function() {
		document.body.style.cursor = cursor;
	});
	dialogBox.scrollBar.on('dragend', function() {
		var height = rect2.getHeight() - titleMargin - dialogBox.scrollBar.getHeight() - 12;
		var currentY = dialogBox.scrollBar.getY() - (rect2.getY() + titleMargin) - 6;
		var ratio = currentY / height;
		dialogBox.panels.tween = new Kinetic.Tween({
			node : dialogBox.panels,
			easing : Kinetic.Easings.EaseInOut,
			offsetY : ratio * (dialogBox.panels.getHeight() - (rect2.getHeight() - titleMargin)),
			duration : 0.5
		});
		dialogBox.panels.tween.play();
	});

	dialogBox.panels = new Kinetic.Group({
		x : rect2.getX(),
		y : rect2.getY() + titleMargin
	});
	dialogBox.panels.getHeight = function() {
		var children = dialogBox.panels.getChildren();
		var widthMin = 20000;
		var widthMax = 0;
		for (var i = 0; i < children.length; i++) {
			if (children[i].getY() < widthMin) {
				widthMin = children[i].getY();
			}
			if (children[i].getY() + children[i].rectFrame.getWidth() > widthMax) {
				widthMax = children[i].getY() + children[i].rectFrame.getWidth();
			}
		}
		return widthMax - widthMin;
	};
	dialogBox.panels.refresh = function() {
		var m3 = 4;
		var children = dialogBox.panels.getChildren();
		for (var i = 0; i < children.length; i++) {
			var panel = children[i];
			var column = i % 5;
			var row = Math.floor(i / 5);
			var posX = m2 + (panel.width + m3 * 2 + m2) * column;
			var posY = m2 + (panel.width + m3 * 3) * row;

			panel.setX(posX);
			panel.setY(posY);
		}
		dialogBox.draw();
	};

	var addPanel = function(config) {
		var m3 = 4;
		var mText = 8;
		var panel = new Kinetic.Group();
		panel.config = config;
		panel.width = 100;
		panel.height = 75;
		var column = dialogBox.panels.getChildren().length % 5;
		var row = Math.floor(dialogBox.panels.getChildren().length / 5);
		panel.setX(m2 + (panel.width + m3 * 2 + m2) * column);
		panel.setY(m2 + (panel.width + m3 * 3) * row + titleMargin);

		panel.on('click', config.onClick);

		var preview = new Image();
		preview.onload = function() {
			var image = new Kinetic.Image({
				image : preview
			});

			var rectFrame = new Kinetic.Rect({
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

			rectPanel.on('mouseover', function(e) {
				document.body.style.cursor = 'pointer';
			});

			rectPanel.on('mouseout', function(e) {
				document.body.style.cursor = cursor;
			});

			rectPanel.on('click', function(e) {
				rectPanel.getParent().destroy();
				dialogBox.panels.refresh();
				dialogBox.scrollBar.refresh();
			});

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
			dialogBox.scrollBar.refresh();
			dialogBox.panels.refresh();
		};
		preview.src = config.path;
	};
	dialogBox.addPanel = addPanel;
	var rectInner = new Kinetic.Group({
		clip : [rect2.getX() + 1, rect2.getY() + 1 + titleMargin, rect2.getWidth() - 2, rect2.getHeight() - titleMargin - 2]
	});

	dialogBox.superDestroy = dialogBox.destroy;
	dialogBox.destroy = function(){
		document.body.removeChild(dialogBox.inputDivParent);
		dialogBox.superDestroy();
	};

	dialogBox.add(rect2);
	dialogBox.add(simpleText);
	rectInner.add(dialogBox.panels);
	rectInner.add(dialogBox.scrollBar);
	dialogBox.add(rectInner);
	dialogBox.scrollBar.refresh();
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
