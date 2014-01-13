var drawMainPanel = function() {
	var m1 = 8;
	var mText = 8;

	var rectFunctionBar = stage.get('#rectFunctionBar')[0];

	// This layer is for main panel background
	var layer = new Kinetic.Layer({
		id : 'layerMainPanel',
	});

	var rect = new Kinetic.Rect({
		x : rectFunctionBar.getX() + rectFunctionBar.getWidth() + m,
		y : rectFunctionBar.getY(),
		width : window.innerWidth - (rectFunctionBar.getX() + rectFunctionBar.getWidth() + m) - m,
		height : window.innerHeight - m * 2 - menuBarHeight - m * 2,
		stroke : 'black',
		strokeWidth : 1,
		id : 'rectMainPanel'
	});
	layer.add(rect);

	var posX = rectFunctionBar.getX() + rectFunctionBar.getWidth() + m + 80 + 20 + m2;
	var rectSelected = new Kinetic.Rect({
		x : posX,
		y : rectFunctionBar.getY(),
		width : window.innerWidth - posX - m,
		height : window.innerHeight - m * 2 - menuBarHeight - m * 2,
		fill : '#00FFFF',
		opacity : 0,
		id : 'rectMainPanelSelected'
	});
	layer.add(rectSelected);

	// This layer is for character panel
	var layer2 = new Kinetic.Layer();
	var rectPanelBar = new Kinetic.Rect({
		x : rect.getX(),
		y : rect.getY(),
		width : 80 + 20 + m1,
		height : rect.getHeight(),
		stroke : 'black',
		strokeWidth : 1,
	});

	var rectInner = new Kinetic.Group({
		clip : [rectPanelBar.getX(), rectPanelBar.getY(), rectPanelBar.getWidth() + 1, rectPanelBar.getHeight() - 20]
	});
	layer2.add(rectInner);
	rectInner.add(rectPanelBar);

	var panelBar = new Kinetic.Group({
		id : 'groupPanelBar',
	});
	rectInner.add(panelBar);
	panelBar.rect = rectPanelBar;

	panelBar.getMax = function() {
		var children = panelBar.getChildren();
		var max = 0;
		for (var i = 0; i < children.length; i++) {
			if (children[i].rect.getAbsolutePosition().y + children[i].rect.getHeight() > max) {
				max = children[i].rect.getAbsolutePosition().y + children[i].rect.getHeight();
			}
		}
		return max;
	};

	panelBar.refresh = function() {
		for (var i = 0; i < characterPanels.length; i++) {
			characterPanels[i].setX(rectFunctionBar.getX() + rectFunctionBar.getWidth() + m);
			characterPanels[i].setY(rectFunctionBar.getY() + 20 + (60 + m1 * 2 + mText) * i);
		}
		layer2.draw();
	};

	// This layer is for triangle button
	var layer3 = new Kinetic.Layer({
		id : 'layerMainPanelTriangle'
	});
	var triangleUp = new Image();
	triangleUp.onload = function() {
		var image = new Kinetic.Image({
			image : triangleUp
		});
		var rectTriangleUp = new Kinetic.Rect({
			x : rect.getX(),
			y : rect.getY(),
			width : 80 + 20 + m1,
			height : 20,
			fillPatternImage : triangleUp,
			stroke : 'black',
			shadowBlur : 1,
			strokeWidth : 1,
		});
		rectTriangleUp.on('mousedown', function() {
			rectTriangleUp.setShadowOffset(1.5);
			layer3.draw();
		});
		rectTriangleUp.on('mouseup', function() {
			rectTriangleUp.setShadowOffset(0);
			layer3.draw();
			var charPanelHeight = stage.selectedPanel.rect.getHeight();
			var diff = Math.abs(stage.get('#groupPanelBar')[0].getY());
			var remainder = diff%charPanelHeight;
			var multiple = Math.floor(diff/charPanelHeight);
			var displacement = charPanelHeight * ((multiple > 0) ? 1 : 0) + remainder;
			if (displacement > 0) {
				var tweenDn = new Kinetic.Tween({
					node : stage.get('#groupPanelBar')[0],
					easing : Kinetic.Easings.EaseInOut,
					y : stage.get('#groupPanelBar')[0].getY() + displacement,
					duration : 0.2
				});
				tweenDn.play();
			}
		});

		layer3.add(rectTriangleUp);
		layer3.draw();
	};
	triangleUp.src = 'img/mainPanel/triangle.png';

	var triangleDn = new Image();
	triangleDn.onload = function() {
		var image = new Kinetic.Image({
			image : triangleDn
		});
		var rectTriangleDn = new Kinetic.Rect({
			x : rect.getX(),
			y : rect.getY() + rect.getHeight() - 20,
			width : 80 + 20 + m1,
			height : 20,
			fillPatternImage : triangleDn,
			stroke : 'black',
			shadowBlur : 1,
			strokeWidth : 1,
		});
		rectTriangleDn.on('mousedown', function() {
			rectTriangleDn.setShadowOffset(1.5);
			layer3.draw();
		});
		rectTriangleDn.on('mouseup', function() {
			rectTriangleDn.setShadowOffset(0);
			layer3.draw();
			var charPanelHeight = stage.selectedPanel.rect.getHeight();
			var diff = Math.abs(panelBar.getMax() - (rect.getY() + rect.getHeight() - 20));
			var remainder = diff%charPanelHeight;
			var multiple = Math.floor(diff/charPanelHeight);
			var displacement = charPanelHeight * ((multiple > 0) ? 1 : 0) + remainder;
			if (displacement > 0) {
				var tweenUp = new Kinetic.Tween({
					node : stage.get('#groupPanelBar')[0],
					easing : Kinetic.Easings.EaseInOut,
					y : stage.get('#groupPanelBar')[0].getY() - displacement,
					duration : 0.2
				});
				tweenUp.play();
			}
		});
		layer3.add(rectTriangleDn);
		layer3.draw();
	};
	triangleDn.src = 'img/mainPanel/triangleDn.png';

	stage.add(layer);
	stage.add(layer2);
	stage.add(layer3);
	stage.arrangeLayer();
};

