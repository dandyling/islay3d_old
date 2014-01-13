var State23 = function(x, y, id, layer) {
	var oval = new Kinetic.Circle({
		radius : OVALRADIUS, // 6 for minimalist
		fill : 'white',
		stroke : '#333333',
		strokeWidth : 1.5,
		shadowOffset : 2,
		name : "stateCircle",
	});
	var simpleText = new Kinetic.Text({
		text : id,
		fontSize : 9,
		fontFamily : 'sans-serif',
		fill : 'black',
		name : "stateText",
		shadowOffset : 1,
		//padding: 5,
	});
	simpleText.setOffset({
		x: Math.round(simpleText.getWidth()/2),	
		y: Math.round(simpleText.getHeight()/2)	
		/*x : Math.round(-8), //-8 For minimalist
		y : Math.round(4)	// 4 For minimalist*/
	});
	simpleText.setDrawHitFunc(function(canvas) {
		var context = canvas.getContext();
		context.beginPath();
		context.arc(Math.round(simpleText.getWidth()/2), Math.round(simpleText.getHeight()/2), 40, 0, Math.PI * 2, true);
		context.closePath();
		canvas.fillStroke(this);
	});

	var state = new Kinetic.Group({
		x : x,
		y : y,
		name : 'state',
		id : id,
		draggable : true,
	});
	state.add(oval);
	state.oval = oval;
	state.add(simpleText);
	state.simpleText = simpleText;

	if(id == "状態　0"){
		state.oval.setStrokeWidth(3);
		state.isMain = true;
	}
	
	addIcon({
		x : -OVALRADIUS - 20,
		y : -OVALRADIUS - 20,
		source : 'img/actionToolbar/edit2.png',
		layer : state,
		id : 'stateRenameButton',
		iconSize : 20,
		onClick : function() {
			var dialog = new DialogRenameState(state);
		}
	});

	state.resetFill = function() {
		oval.setFill('white');
		state.buttons["stateRenameButton"].hide();
	};

	state.outArrows = new Object();
	state.inArrows = new Object();

	state.existTransition = function(s2) {
		return state.outArrows[s2.getId()] != undefined && s2.inArrows[state.getId()] != undefined;
	};

	state.createTransition = function(s2) {
		var newArrow = new Arrow(state, s2, layer);

		state.outArrows[s2.getId()] = newArrow;
		newArrow.from = state;
		state.fire('click');
		s2.inArrows[state.getId()] = newArrow;
		newArrow.to = s2;
		state.moveToTop();
		s2.moveToTop();
		layer.draw();
		state.update();

		return newArrow;
	};

	state.deleteTransitionTo = function(s2) {
		var arrow = state.outArrows[s2.getId()];
		arrow.destroy();
		layer.draw();
		delete state.outArrows[s2.getId()];
		delete s2.inArrows[state.getId()];
	};

	state.deleteSelf = function() {
		player.previewStop();
		for (var s2_id in state.outArrows) {
			var arrow = state.outArrows[s2_id];
			arrow.destroy();
			delete layer.states[s2_id].inArrows[state.getId()];
		}
		for (var s2_id in state.inArrows) {
			var arrow = state.inArrows[s2_id];
			arrow.destroy();
			delete layer.states[s2_id].outArrows[state.getId()];
		}
		var s_id = state.getId();
		state.destroyChildren();
		delete layer.states[s_id];
		layer.draw();
	};

	state.updateArrows = function(type) {
		var arrowsOut = (type == 'out') ? state.outArrows : state.inArrows;
		var arrowsIn = (type == 'out') ? state.inArrows : state.outArrows;
		for (var t in arrowsOut) {
			var angle = Math.atan2(layer.states[t].getY() - state.getY(), layer.states[t].getX() - state.getX());
			var offsetX = 25*Math.cos(angle);
			 var offsetY = 25*Math.sin(angle);
			/*var offsetX = 0 * Math.cos(angle); //minimalist style
			var offsetY = 0 * Math.sin(angle);*/
			var x1 = (type == 'out') ? state.getX() + offsetX : layer.states[t].getX() - offsetX;
			var x2 = (type == 'out') ? layer.states[t].getX() - offsetX : state.getX() + offsetX;
			var y1 = (type == 'out') ? state.getY() + offsetY : layer.states[t].getY() - offsetY;
			var y2 = (type == 'out') ? layer.states[t].getY() - offsetY : state.getY() + offsetY;

			curve = (arrowsIn[t] != undefined) ? true : false;
			vertex = calcVertices(x1, y1, x2, y2, 6, curve);
			arrowsOut[t].get('.arrowSpline')[0].setAttrs({
				points : [x1, y1, vertex.x, vertex.y, x2, y2]
			});

			vertex2 = calcVertices(x1, y1, x2, y2, 4, curve);
			var angle = Math.atan2(y2 - vertex2.y, x2 - vertex2.x);
			var offsetX = 6 * Math.cos(angle);
			var offsetY = 6 * Math.sin(angle);
			var thetaTop = Math.cos(angle - Math.PI / 6);
			var thetaBtm = Math.sin(angle + Math.PI / 6);
			arrowsOut[t].get('.arrowTriangle')[0].setAttrs({
				points : [x2 - headlen * Math.cos(angle - Math.PI / 6) - offsetX, y2 - headlen * Math.sin(angle - Math.PI / 6) - offsetY, x2 - offsetX, y2 - offsetY, x2 - headlen * Math.cos(angle + Math.PI / 6) - offsetX, y2 - headlen * Math.sin(angle + Math.PI / 6) - offsetY]
			});
			if (arrowsOut[t].label != undefined) {
				arrowsOut[t].label.destroy();
			}
			arrowsOut[t].drawLabel(vertex.x, vertex.y);
			layer.draw();
		};
	};

	state.update = function() {
		state.updateArrows('out');
		state.updateArrows('in');
	};

	state.xml = document.createElement("state");
	state.xml2 = document.createElement("stateOption");
	$(state.xml).attr({
		name : state.getId(),
		action : "stay",
		pos_x : state.getX(),
		pos_y : state.getY(),
	});

	state.on('mouseover', function() {
		if(stage.get('#buttonArrow')[0].buttonDown){
			document.body.style.cursor = "url('img/cursor/arrow.cur'), auto";
		} else if(stage.get('#buttonCross')[0].buttonDown){
			document.body.style.cursor = "url('img/cursor/eraser.cur'), auto";
		} else {
			document.body.style.cursor = 'pointer';
		}
		
		layer.draw();
		player.previewStart(state.xml);
	});
	state.on('mouseout', function() {
		document.body.style.cursor = cursor;
		layer.draw();
		player.previewStop();
	});

	state.select = function() {
		if (layer.isSelected != undefined) {
			previousSelected = layer.isSelected;
			previousSelected.resetFill();
			previousSelected.draw();
		}

		layer.isSelected = state;
		if (layer.isSelected.buttons != undefined) {
			layer.isSelected.buttons["stateRenameButton"].show();
		}
		oval.setFill('#C33745');
		oval.draw();
	};

	state.on('mousedown', function() {
		state.select();

		dialogBoxes.close();
		if (radio['buttonCross'].buttonDown) {
			if(state.isMain != undefined && state.isMain == true) {
				alert("You cannot delete the main state!");
			} else {
				state.deleteSelf();
				delete layer.isSelected;
			}
		} else {
			if (radio['buttonArrow'].buttonDown) {
				if (layer.isDragging == true) {
					state.fire('mouseup');
					return;
				} else {
					layer.isDragging = false;
				}
	
				layer.fromState = state;
				var x1 = state.getX();
				var y1 = state.getY();
				var x2 = stage.getMousePosition().x - layer.getX();
				var y2 = stage.getMousePosition().y - layer.getY();
	
				layer.line = new Kinetic.Line({
					points : [x1, y1, x2, y2],
					dashArray : [4, 2],
					stroke : '#666',
					strokeWidth : 1.5,
					name : 'line'
				});
				var layerTemp = new Kinetic.Layer({
					id : "layerTempForDottedLine"
				});
				layerTemp.add(layer.line);
				stage.add(layerTemp);
				stage.arrangeLayer();
				state.moveToTop();
				layer.isDragging = true;
				// starts dragging
	
				layer.on('mousemove', function() {
					x2 = stage.getMousePosition().x - layer.getX();
					y2 = stage.getMousePosition().y - layer.getY();
					layer.line.setAttrs({
						points : [x1, y1, x2 > x1 ? x2 - 10 : x2 + 10, y2 > y1 ? y2 - 10 : y2 + 10]
						// avoid the anti-alias bug of Kineticjs with a 10 margin
					});
					layerTemp.draw();
				});
			} 
			
			dialogBoxes.actionToolbar = new ActionToolbar(state);
			dialogBoxes.actionToolbar.currentState = state;
			dialogBoxes.actionToolbar.setAutoPosition(state.getX(), state.getY());
		}
	});

	state.on('dragstart', function() {
		if (dialogBoxes.actionToolbar.dialog != undefined) {
			dialogBoxes.closeSmallDialogs();
		}
		var oval = new Kinetic.Circle({
			x : state.getX(),
			y : state.getY(),
			radius : OVALRADIUS, // 6 for minimalist
			fill : 'white',
			stroke : '#333333',
			strokeWidth : 1.5,
			dashArray : [4, 2],
			name : "stateShadow",
		});
		layer.drawings.add(oval);
		state.stateShadow = oval;
		state.moveToTop();
		layer.draw();
	});

	state.on('dragend', function() {
		dialogBoxes.actionToolbar.currentState = state;
		dialogBoxes.actionToolbar.currentState.xml.attributes["pos_x"].value = state.getX();
		dialogBoxes.actionToolbar.currentState.xml.attributes["pos_y"].value = state.getY();
		dialogBoxes.actionToolbar.setAutoPosition(state.getX(), state.getY());
		if (state.stateShadow != undefined) {
			state.stateShadow.destroy();
			delete state.stateShadow;
			layer.draw();
		}
		state.update();
	});

	state.on('mouseup', function() {
		if (layer.isDragging == true) {
			stage.get("#layerTempForDottedLine")[0].off('mousemove');
			layer.line.destroy();
			stage.get("#layerTempForDottedLine")[0].destroy();
			if (layer.fromState != undefined && layer.fromState != state) {
				if(!layer.fromState.existTransition(state)) {
					var arrow = layer.fromState.createTransition(state);
					arrow.fire('mousedown');
				}
			}
			layer.isDragging = false;
			layer.fromState = undefined;
		}
		layer.draw();
	});

	layer.on('mouseup', function() {
		if (layer.isDragging == true) {
			stage.get("#layerTempForDottedLine")[0].off('mousemove');
			layer.line.destroy();
			stage.get("#layerTempForDottedLine")[0].destroy();
			layer.isDragging = false;
			layer.fromState = undefined;
		}
		layer.draw();
	});

	layer.drawings.add(state);
	layer.draw();

	stage.fire('state-created', state);
	
	return state;
};

var calcVertices = function(x1, y1, x2, y2, scale, curve) {
	var xm = (x1 + x2) / 2;
	var ym = (y1 + y2) / 2;
	dx = (xm - x1) / scale;
	dy = (ym - y1) / scale;
	//var x3 = xm - dy; var y3 = ym + dx;
	var x4 = curve ? xm + dy : xm;
	var y4 = curve ? ym - dx : ym;
	var point = {
		x : x4,
		y : y4
	};
	return point;
};

var equSign = function(pos1, pos2){
	return sign(pos1.x - pos2.x) == sign(pos1.y - pos2.y);
};

var Arrow = function(state1, state2, layer) {
	var x1 = state1.getX();
	var y1 = state1.getY();
	var x2 = state2.getX();
	var y2 = state2.getY();
	var vertex = calcVertices(x1, y1, x2, y2, 6);
	var spline = new Kinetic.Spline({
		points : [x1, y1, vertex.x, vertex.y, x2, y2],
		stroke : '#666',
		strokeWidth : 1.5,
		tension : 0.5,
		shadowOffset : 1,
		name : 'arrowSpline',
		drawHitFunc : function(canvas) {
			var points = this.getPoints(), length = points.length, context = canvas.getContext(), tension = this.getTension();
			
			var wx = 8;
			var wy = equSign(points[length - 1], points[0]) ? -8 : 8;
			
			context.beginPath();
			context.moveTo(points[0].x - wx, points[0].y - wy);
			if (tension !== 0 && length > 2) {
				var ap = this.allPoints, len = ap.length;
				context.quadraticCurveTo(ap[0].x - wx, ap[0].y - wy, ap[1].x - wx, ap[1].y - wy);
				var n = 2;
				while (n < len - 1) {
					context.bezierCurveTo(ap[n].x - wx, ap[n++].y - wy, ap[n].x - wx, ap[n++].y - wy, ap[n].x - wx, ap[n++].y - wy);
				}
				context.quadraticCurveTo(ap[len - 1].x - wx, ap[len - 1].y - wy, points[length - 1].x - wx, points[length - 1].y - wy);
			}
			
			context.lineTo(points[length - 1].x + wx, points[length - 1].y + wy);
			if (tension !== 0 && length > 2) {
				var ap = this.allPoints, len = ap.length;
				context.quadraticCurveTo(ap[len - 1].x + wx, ap[len - 1].y + wy, points[length - 2].x + wx, points[length - 2].y + wy);
				var n = length - 3;
				while (n > 0) {
					context.bezierCurveTo(ap[n].x + wx, ap[n--].y + wy, ap[n].x + wx, ap[n--].y + wy, ap[n].x + wx, ap[n--].y + wy);
				}
				context.quadraticCurveTo(ap[0].x + wx, ap[0].y + wy, points[0].x + wx, points[0].y + wy);
			}
			context.lineTo(points[0].x - wx, points[0].y - wy);
			canvas.fill(this);
			}
	});

	var angle = Math.atan2(y2 - y1, x2 - x1);

	var triangle = new Kinetic.Polygon({
		points : [x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6), x2, y2, x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6)],
		fill : 'black',
		shadowOffset : 2,
		name : 'arrowTriangle'
	});

	var arrow = new Kinetic.Group({
		//draggable: true
	});
	arrow.fromState = state1;
	arrow.toState = state2;

	arrow.resetFill = function() {
		//spline.setStrokeWidth('1.5');
		spline.setStroke('black');
		spline.setShadowColor('gray');
		triangle.setFill('black');
		triangle.setShadowColor('gray');
		if(arrow.get('Text')[0] != undefined){
			arrow.get('Text')[0].setFill('black');
			arrow.get('Text')[0].setShadowColor('black');
		} else if(arrow.get('Image')[0] != undefined){
			if(arrow.get('Image')[0].getImage().src.indexOf("-red.png") !== -1) {
			var imageObj = new Image();
				imageObj.onload = function() {
					arrow.get('Image')[0].setImage(imageObj);
				};
				imageObj.src = arrow.get('Image')[0].getImage().src.replace("-red.png", ".png");
			}
		}
	};

	arrow.add(spline);
	arrow.spline = spline;
	arrow.add(triangle);
	arrow.triangle = triangle;

	arrow.on('mouseover', function() {
		if(stage.get('#buttonCross')[0].buttonDown){
			document.body.style.cursor = "url('img/cursor/eraser.cur'), auto";
		} else {
			document.body.style.cursor = 'pointer';
		}
		layer.draw();
	});
	arrow.on('mouseout', function() {
		document.body.style.cursor = cursor;
		layer.draw();
	});
	arrow.on('mousedown', function() {
		if (layer.isSelected != undefined) {
			previousSelected = layer.isSelected;
			previousSelected.resetFill();
		}
		layer.isSelected = arrow;
		//spline.setStrokeWidth(3);
		spline.setStroke('#C33745');
		spline.setShadowColor('#C33745');
		triangle.setFill('#C33745');
		triangle.setShadowColor('#C33745');
		if(arrow.get('Text')[0] != undefined){
			arrow.get('Text')[0].setFill('#C33745');
			arrow.get('Text')[0].setShadowColor('#C33745');
		} else if(arrow.get('Image')[0] != undefined){
			var imageObj = new Image();
			imageObj.onload = function() {
				arrow.get('Image')[0].setImage(imageObj);
			};
			imageObj.src = arrow.get('Image')[0].getImage().src.replace(".png", "-red.png");
		}
		layer.draw();

		dialogBoxes.close();
		if (radio['buttonCross'].buttonDown) {
			var state1 = arrow.from;
			var state2 = arrow.to;
			state1.deleteTransitionTo(state2);
			delete layer.isSelected;
		} else {
			dialogBoxes.arrowToolbar = new ArrowToolbar(arrow);
			dialogBoxes.arrowToolbar.currentArrow = arrow;
			dialogBoxes.arrowToolbar.setAutoPosition(arrow.spline.getPoints()[1].x, arrow.spline.getPoints()[1].y);
		}
	});

	arrow.resetXML = function() {
		arrow.xml = document.createElement("trans");
		$(arrow.xml).attr({
			guard : "default",
			from : state1.getId(),
			to : state2.getId(),
		});
	};
	arrow.resetXML();

	arrow.refreshStateName = function() {
		$(arrow.xml).attr({
			from : state1.getId(),
			to : state2.getId(),
		});
	};

	arrow.drawLabel = function(x, y) {
		var label;
		var simpleText = new Kinetic.Text({
			x : x,
			y : y + 10,
			fontSize : 9,
			fontFamily : 'sans-serif',
			fill : 'black',
			name : "arrowLabel",
			shadowOffset : 1,
			shadowColor : 'black',
		});

		var setTextLabel = function(value) {
			simpleText.setText(value);
			simpleText.setOffsetX(Math.round(simpleText.getWidth() / 2));
			label = simpleText;
		};

		var setImgLabel = function(id) {
			var img = stage.images[id].clone();
			img.setX(x - img.getWidth() / 2);
			img.setY(y + 10 - img.getHeight() / 2);
			label = img;
		};

		if (arrow.xml.attributes["guard"].value == 'default') {
			setTextLabel("");
		} else if (arrow.xml.attributes["guard"].value == 'key') {
			setTextLabel(arrow.xml.attributes["key"].value);
		} else if (arrow.xml.attributes["guard"].value == 'event') {
			setTextLabel(arrow.xml.attributes["type"].value);
		} else if (arrow.xml.attributes["guard"].value == 'prob') {
			setTextLabel(arrow.xml.attributes["prob"].value + "%");
		} else if (arrow.xml.attributes["guard"].value == 'timeout') {
			setTextLabel("x" + arrow.xml.attributes["count"].value);
		} else if (arrow.xml.attributes["guard"].value == 'click') {
			setImgLabel('imgMouse');
		} else if (arrow.xml.attributes["guard"].value == 'bump') {
			setImgLabel('imgCollide');
		}

		var theta = Math.atan2(state2.getY() - state1.getY(), state2.getX() - state1.getX());
		if (theta >= -Math.PI / 2 && theta < Math.PI / 2) {
			theta = theta;
		} else {
			theta = theta + Math.PI;
		}
		label.rotate(theta);

		arrow.add(label);
		arrow.label = label;
		arrow.getParent().getParent().draw();
	};
	
	//arrow.drawLabel(vertex.x, vertex.y);
	layer.drawings.add(arrow);
	stage.fire('arrow-created', arrow);
	return arrow;
}; 