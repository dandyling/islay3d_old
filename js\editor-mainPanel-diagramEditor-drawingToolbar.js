var drawDrawingToolbar = function() {
	var layer = new Kinetic.Layer({
		id : 'layerDrawingToolbar'
	});
	var diagRect = stage.get('#rectDiagramEditor')[0];
	var w = iconSize + 13 * 2;
	var h = iconSize * 4 + 10 * 3 + 13 * 2;
	var posX = diagRect.getX() + diagRect.getWidth() - w - 10;
	var posY = diagRect.getY() + $('#enchant-stage').height() + 40;

	var toolbar = new Kinetic.Group({
		id : "groupDrawingToolbar",
		x : posX,
		y : posY,
		draggable : false,
	});

	var rect = new Kinetic.Rect({
		width : w,
		height : h,
		fill : '#F2F2F2',
		stroke : '#C0C0C0',
		strokeWidth : 1,
		shadowOffset : 2,
		shadowOpacity : 0.8,
		cornerRadius : 15,
	});
	toolbar.add(rect);

	var space = iconSize + 10;
	addRadioButton({
		x : 13,
		y : 13 + space * 0,
		source : 'img/drawingBar/pointer.png',
		layer : toolbar,
		id : 'buttonPointer',
		onClick : function() {
			toggleRadio(this);
			if (this.buttonDown) {
				stage.selectedPanel.selectedDiagram.setStatesDraggable(true);
				stage.selectedPanel.selectedDiagram.off('mousedown');
				document.body.style.cursor = 'pointer';
				cursor = 'pointer';
			} else {
				document.body.style.cursor = cursor;
			}
		}
	});

	addRadioButton({
		x : 13,
		y : 13 + space * 1,
		source : 'img/drawingBar/oval.png',
		layer : toolbar,
		id : 'buttonOval',
		onClick : function() {
			toggleRadio(this);
			if (dialogBoxes.arrowToolbar != undefined) {
				dialogBoxes.arrowToolbar.close();
			}
			if (this.buttonDown) {
				stage.selectedPanel.selectedDiagram.setStatesDraggable(true);
				stage.selectedPanel.selectedDiagram.off('mousedown');
				cursor = "url('img/cursor/oval.cur'), auto";
			} 
			document.body.style.cursor = cursor;
		}
	});

	addRadioButton({
		x : 13,
		y : 13 + space * 2,
		source : 'img/drawingBar/arrow.png',
		layer : toolbar,
		id : 'buttonArrow',
		onClick : function() {
			var layerEd = stage.selectedPanel.selectedDiagram;
			toggleRadio(this);
			dialogBoxes.close();
			if (this.buttonDown) {
				stage.selectedPanel.selectedDiagram.setStatesDraggable(false);
				//cursor = "url('img/cursor/arrow.cur'), auto";
				cursor = 'pointer';
			} else {
				layerEd.off('mousedown');
				layerEd.off('mousemove');
				layerEd.off('mouseup');
			}
			document.body.style.cursor = cursor;
		}
	});

	addRadioButton({
		x : 13,
		y : 13 + space * 3,
		source : 'img/drawingBar/cross.png',
		layer : toolbar,
		id : 'buttonCross',
		onClick : function() {
			toggleRadio(this);
			if (this.buttonDown) {
				stage.selectedPanel.selectedDiagram.setStatesDraggable(false);
				stage.selectedPanel.selectedDiagram.off('mousedown');
				//cursor = "url('img/cursor/eraser.cur'), auto";
				cursor = 'pointer';
			}
			document.body.style.cursor = cursor;
		}
	});

	diagRect.calcBoundary2 = function() {
		minX2 = diagRect.getX() + layer.getX() + m1 * 2;
		maxX2 = diagRect.getX() + layer.getX() + diagRect.getWidth() - rect.getWidth() - m1 * 2;
		minY2 = diagRect.getY() + layer.getY() + tabBarHeight + m1 * 2;
		maxY2 = diagRect.getY() + layer.getY() + diagRect.getHeight() - rect.getHeight() - m1 * 2;
	};

	diagRect.calcBoundary2();

	toolbar.setDragBoundFunc(function(pos, abs) {
		var X = pos.x;
		var Y = pos.y;
		if (X < minX2) {
			X = minX2;
		}
		if (X > maxX2) {
			X = maxX2;
		}
		if (Y < minY2) {
			Y = minY2;
		}
		if (Y > maxY2) {
			Y = maxY2;
		}
		return ( {
			x : X,
			y : Y
		});
	});

	layer.add(toolbar);
	stage.add(layer);
	stage.arrangeLayer();
	return toolbar;
}; 