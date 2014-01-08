var ActionToolbar = function(state) {
	var m0 = 18;
	var m1 = 12;
	var iconSize = 20;

	var space = iconSize + m1 + 15;
	var h = (iconSize + m1 * 2) - 2 + 10;
	var w = space * 7 + 20;

	var layer;
	if (stage.get('#layerActionAndArrowToolbar')[0] != undefined) {
		layer = stage.get('#layerActionAndArrowToolbar')[0];
		layer.moveToTop();
		stage.arrangeLayer();
	} else {
		layer = new Kinetic.Layer({
			id : "layerActionAndArrowToolbar"
		});
		stage.add(layer);
		stage.arrangeLayer();
	}

	var toolbar = new Kinetic.Group({
		x : state.getX(),
		y : state.getY(),
		id : "actionToolbar",
		draggable : false
	});
	toolbar.layer = layer;
	toolbar.state = state;

	var rect = new Kinetic.Rect({
		width : w,
		height : h,
		stroke : '#C0C0C0',
		strokeWidth : 1,
		cornerRadius : 4,
		//fill: '#E0E0E0',
		fillLinearGradientColorStops : [0, '#C33745', 0.5, 'red', 1, '#C33745'],
		fillLinearGradientStartPoint : [w, 0],
	});
	toolbar.rect = rect;

	addIcon({
		x : m0 + space * 0,
		y : m1,
		iconSize : iconSize,
		source : 'img/actionToolbar/move.png',
		layer : toolbar,
		id : 'buttonActionMove',
		name : 'button',
		addText : true,
		text : 'うごかす',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogActionToolbarMove(toolbar);
				toolbar.setAutoPosition(toolbar.currentState.getX(), toolbar.currentState.getY());
			}
		}
	});

	addIcon({
		x : m0 + space * 1,
		y : m1,
		iconSize : iconSize,
		source : 'img/actionToolbar/jump.png',
		layer : toolbar,
		id : 'buttonActionJump',
		name : 'button',
		addText : true,
		text : 'ジャンプ',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				if (toolbar.state.xml != undefined && toolbar.state.xml.attributes["action"].value == "jump") {
					toolbar.dialog = new DialogActionToolbarJump(toolbar);
				} else if (toolbar.state.xml != undefined && toolbar.state.xml.attributes["action"].value == "jump-rand") {
					toolbar.dialog = new DialogActionToolbarJumpRandom(toolbar);
				} else {
					toolbar.dialog = new DialogActionToolbarJump(toolbar);
				}
				toolbar.setAutoPosition(toolbar.currentState.getX(), toolbar.currentState.getY());
			}
		}
	});

	addIcon({
		x : m0 + space * 2,
		y : m1,
		iconSize : iconSize,
		source : 'img/actionToolbar/reset.png',
		layer : toolbar,
		id : 'buttonActionReset',
		name : 'button',
		addText : true,
		text : 'リセット',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogActionToolbarReset(toolbar);
				toolbar.setAutoPosition(toolbar.currentState.getX(), toolbar.currentState.getY());
			}
		}
	});

	var rect2 = new Kinetic.Rect({
		x : m0 + space * 3 - 12,
		y : 5,
		width : 7,
		height : h - 10,
		stroke : 'white',
		strokeWidth : 1,
		cornerRadius : 2,
		fill : 'white',
	});

	addIcon({
		x : m0 + space * 3 + 10,
		y : m1,
		iconSize : iconSize,
		source : 'img/actionToolbar/message.png',
		layer : toolbar,
		id : 'buttonActionMessage',
		name : 'button',
		addText : true,
		text : 'おしらせ',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogActionToolbarMessage(toolbar);
				toolbar.setAutoPosition(toolbar.currentState.getX(), toolbar.currentState.getY());
			}
		}
	});

	addIcon({
		x : m0 + space * 4 + 10,
		y : m1,
		iconSize : iconSize,
		source : 'img/actionToolbar/fork.png',
		layer : toolbar,
		id : 'buttonActionFork',
		name : 'button',
		addText : true,
		text : '親になる',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogActionToolbarGroup(toolbar);
				toolbar.setAutoPosition(toolbar.currentState.getX(), toolbar.currentState.getY());
			}
		}
	});

	addIcon({
		x : m0 + space * 5 + 10,
		y : m1,
		iconSize : iconSize,
		source : 'img/actionToolbar/transform.png',
		layer : toolbar,
		id : 'buttonActionChange',
		name : 'button',
		addText : true,
		text : '変わる',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogActionToolbarCharacter(toolbar);
				toolbar.setAutoPosition(toolbar.currentState.getX(), toolbar.currentState.getY());
			}
		}
	});

	addIcon({
		x : m0 + space * 6 + 10,
		y : m1,
		iconSize : iconSize,
		source : 'img/actionToolbar/transform2.png',
		layer : toolbar,
		id : 'buttonActionTransform',
		name : 'button',
		addText : true,
		text : 'へんかく',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogActionToolbarTransform(toolbar);
				toolbar.setAutoPosition(toolbar.currentState.getX(), toolbar.currentState.getY());
			}
		}
	});

	var rectD = measurementRectDiagramEditor;
	var min3X = rectD.x + m1;
	var max3X = rectD.x + rectD.width - m1;
	var min3Y = rectD.y + tabBarHeight + m1;
	var max3Y = rectD.y + rectD.height - m1;

	toolbar.setAutoPosition = function(posX, posY) {
		var rectDiag = measurementRectDiagramEditor;
		if (toolbar.dialog == undefined) {
			/*var xrect1 = posX - rect.getWidth()/2;
			 var yrect1 = posY - (rect.getHeight() + 64/2 + 10);
			 var offsetX1 = 0, offsetY1 = 0;

			 if(xrect1 < min3X) {
			 offsetX1 = xrect1 - min3X;
			 }
			 else if( xrect1 + rect.getWidth() > max3X) {
			 offsetX1 = xrect1 + rect.getWidth() - max3X;
			 }
			 if(yrect1 < min3Y) {
			 offsetY1 = -rect.getHeight() - 64 - 10*2;
			 }
			 toolbar.setPosition(xrect1 - offsetX1, yrect1 - offsetY1);*/
			toolbar.setPosition(rectDiag.width / 2, rectDiag.height);
		} else {
			/*var xrect1 = posX - rect.getWidth()/2;
			 var xrect2 = posX - toolbar.dialog.rect.getWidth()/2;
			 var yrect1 = posY - (rect.getHeight() + 64/2 + 10);
			 var yrect2 = yrect1 - (toolbar.dialog.rect.getHeight() + 10);
			 var offsetX1 = 0, offsetX2 = 0, offsetY1 = 0, offsetY2 = 0;

			 if(xrect2 < min3X) {
			 offsetX1 = xrect1 - min3X;
			 offsetX2 = xrect2 - min3X;
			 }
			 else if(xrect2 + toolbar.dialog.rect.getWidth() > max3X) {
			 offsetX1 = xrect1 + rect.getWidth() - max3X;
			 offsetX2 = xrect2 + toolbar.dialog.rect.getWidth() - max3X;
			 }
			 if(yrect2 < min3Y) {
			 offsetY1 = -rect.getHeight() - 64 - 10*2;
			 offsetY2 = offsetY1 - toolbar.dialog.rect.getHeight() - 10 - rect.getHeight() - 10;
			 }

			 toolbar.setPosition(xrect1 - offsetX1, yrect1 - offsetY1);
			 toolbar.dialog.adjustPosition(xrect2 - offsetX2, yrect2 - offsetY2);*/
			toolbar.setPosition(rectDiag.width / 2, rectDiag.height);
			//toolbar.dialog.adjustPosition(rectDiag.getWidth()/2 - dialog.rect.getWidth()/2, rectDiag.getHeight() - 180);
		}

		toolbar.getParent().draw();
	};

	toolbar.toggle = function(button) {
		var allButtons = toolbar.get('.button');
		allButtons.each(function(b) {
			if (b != button) {
				b.get('Rect')[0].setFill('#E0E0E0');
				b.get('Rect')[0].setStroke('#C0C0C0');
				b.buttonDown = false;
			} else {
				b.buttonDown = !button.buttonDown;
				if (b.buttonDown) {
					b.get('Rect')[0].setFill('#C0C0C0');
					b.get('Rect')[0].setStroke('gray');
				} else {
					b.get('Rect')[0].setFill('#E0E0E0');
					b.get('Rect')[0].setStroke('#C0C0C0');
				}
			}
			toolbar.draw();
		});
	};

	toolbar.close = function() {
		if (toolbar.dialog != undefined) {
			toolbar.dialog.close();
		}
		toolbar.destroy();
		layer.draw();
	};

	toolbar.add(rect);
	toolbar.add(rect2);
	layer.add(toolbar);

	return toolbar;
};
