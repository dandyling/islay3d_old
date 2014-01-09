var ArrowToolbar = function(arrow) {
	var m0 = 18;
	var m1 = 12;
	var iconSize = 20;

	var space = iconSize + m1 + 15;
	var h = (iconSize + m1 * 2) - 2 + 10;
	var w = space * 6 + 10;

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
		x : arrow.spline.getPoints()[1].x,
		y : arrow.spline.getPoints()[1].y,
		id : "arrowToolbar",
		draggable : false
	});
	toolbar.layer = layer;
	toolbar.arrow = arrow;

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
		source : 'img/arrowToolbar/keyboard.png',
		layer : toolbar,
		id : 'buttonArrowKeyboard',
		name : 'button',
		addText : true,
		text : 'キーボード',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogArrowToolbarKeyboard(toolbar);
				toolbar.setAutoPosition(arrow.spline.getPoints()[1].x, arrow.spline.getPoints()[1].y);
			}
		}
	});

	addIcon({
		x : m0 + space * 1,
		y : m1,
		iconSize : iconSize,
		source : 'img/arrowToolbar/mouse.png',
		layer : toolbar,
		id : 'buttonArrowMouse',
		name : 'button',
		addText : true,
		text : 'クリック',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogArrowToolbarMouse(toolbar);
				toolbar.setAutoPosition(arrow.spline.getPoints()[1].x, arrow.spline.getPoints()[1].y);
			}
		}
	});

	addIcon({
		x : m0 + space * 2,
		y : m1,
		iconSize : iconSize,
		source : 'img/arrowToolbar/explosion.png',
		layer : toolbar,
		id : 'buttonArrowExplosion',
		name : 'button',
		addText : true,
		text : '衝突',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogArrowToolbarCollide(toolbar);
				toolbar.setAutoPosition(arrow.spline.getPoints()[1].x, arrow.spline.getPoints()[1].y);
			}
		}
	});

	addIcon({
		x : m0 + space * 3,
		y : m1,
		iconSize : iconSize,
		source : 'img/arrowToolbar/message.png',
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
				toolbar.dialog = new DialogArrowToolbarMessage(toolbar);
				toolbar.setAutoPosition(arrow.spline.getPoints()[1].x, arrow.spline.getPoints()[1].y);
			}
		}
	});

	addIcon({
		x : m0 + space * 4,
		y : m1,
		iconSize : iconSize,
		source : 'img/arrowToolbar/percent.png',
		layer : toolbar,
		id : 'buttonArrowPercent',
		name : 'button',
		addText : true,
		text : '確率',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogArrowToolbarPercent(toolbar);
				toolbar.setAutoPosition(arrow.spline.getPoints()[1].x, arrow.spline.getPoints()[1].y);
			}
		}
	});

	addIcon({
		x : m0 + space * 5,
		y : m1,
		iconSize : iconSize,
		source : 'img/arrowToolbar/repeat.png',
		layer : toolbar,
		id : 'buttonActionChange',
		name : 'button',
		addText : true,
		text : '繰り返し',
		effect3D : true,
		onClick : function() {
			toolbar.toggle(this);
			if (toolbar.dialog != undefined) {
				dialogBoxes.closeSmallDialogs();
			}
			if (this.buttonDown) {
				toolbar.dialog = new DialogArrowToolbarRepeat(toolbar);
				toolbar.setAutoPosition(arrow.spline.getPoints()[1].x, arrow.spline.getPoints()[1].y);
			}
		}
	});

	var rectD = stage.get('#rectDiagramEditor')[0];
	var min3X = rectD.getX() + rectD.getParent().getX() + m1;
	var max3X = rectD.getX() + rectD.getParent().getX() + rectD.getWidth() - m1;
	var min3Y = rectD.getY() + rectD.getParent().getY() + tabBarHeight + m1;
	var max3Y = rectD.getY() + rectD.getParent().getY() + rectD.getHeight() - m1;

	toolbar.setAutoPosition = function(posX, posY) {
		var rectDiag = stage.get('#rectDiagramEditor')[0];
		if (toolbar.dialog == undefined) {
			/*var xrect1 = posX - rect.getWidth()/2;
			 var yrect1 = posY - (rect.getHeight() + 10);
			 var offsetX1 = 0, offsetY1 = 0;

			 if(xrect1 < min3X) {
			 offsetX1 = xrect1 - min3X;
			 }
			 else if( xrect1 + rect.getWidth() > max3X) {
			 offsetX1 = xrect1 + rect.getWidth() - max3X;
			 }
			 if(yrect1 < min3Y) {
			 offsetY1 = -rect.getHeight() - OVALRADIUS - 10*2;
			 }
			 toolbar.setPosition(xrect1 - offsetX1, yrect1 - offsetY1);*/
			toolbar.setPosition(rectDiag.getWidth() / 2, rectDiag.getHeight());
		} else {
			/*var xrect1 = posX - rect.getWidth()/2;
			 var xrect2 = posX - toolbar.dialog.rect.getWidth()/2;
			 var yrect1 = posY - (rect.getHeight() + 10);
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
			 offsetY1 = -rect.getHeight() - OVALRADIUS - 10*2;
			 offsetY2 = offsetY1 - toolbar.dialog.rect.getHeight() - 10 - rect.getHeight() - 10;
			 }

			 toolbar.setPosition(xrect1 - offsetX1, yrect1 - offsetY1);
			 toolbar.dialog.adjustPosition(xrect2 - offsetX2, yrect2 - offsetY2);*/
			toolbar.setPosition(rectDiag.getWidth() / 2, rectDiag.getHeight());
			//toolbar.dialog.adjustPosition(rectDiag.getWidth()/2 - toolbar.dialog.rect.getWidth()/2, rectDiag.getHeight() - 180);
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
	layer.add(toolbar);

	return toolbar;
};
