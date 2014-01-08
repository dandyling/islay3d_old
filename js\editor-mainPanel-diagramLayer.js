var m1 = 3;
var m2 = 8;
var s1 = undefined;
var i = 0;
var headlen = 10;

var rectFunctionBar = stage.get('#rectFunctionBar')[0];

/** Returns a new layer for the diagram editor */
var DiagramLayer = function(name) {
	var rectFunctionBar = stage.get('#rectFunctionBar')[0];

	var layer = new Kinetic.Layer({
		id : name,
	});

	var posX = rectFunctionBar.getX() + rectFunctionBar.getWidth() + m + 80 + 20 + m2 * 2;
	var rect = new Kinetic.Rect({
		x : measurementRectDiagramEditor.x + 4,
		y : measurementRectDiagramEditor.y + 4 + 27,
		width : measurementRectDiagramEditor.width - 8,
		height : measurementRectDiagramEditor.height - 8 - 27,
		fill : 'white',
		cornerRadius : 4,
		id : 'rectDiagramEditor'
	});

	rect.calcBoundary = function() {
		minX = rect.getX() + layer.getX() + OVALRADIUS + m1;
		maxX = rect.getX() + layer.getX() + rect.getWidth() - OVALRADIUS - m1;
		minY = rect.getY() + layer.getY() + OVALRADIUS + tabBarHeight + m1 + m1;
		maxY = rect.getY() + layer.getY() + rect.getHeight() - OVALRADIUS - m1;
	};

	layer.states = {};
	layer.setStatesDraggable = function(isDraggable) {
		for (var i in layer.states) {
			layer.states[i].setDraggable(isDraggable);
		}
	};
	layer.statesNum = 0;
	rect.on('mousedown', function() {
		if (radio['buttonOval'].buttonDown) {
			var mousePos = stage.getMousePosition();
			var newState = new State23(mousePos.x - layer.getX(), mousePos.y - layer.getY(), '状態　' + layer.statesNum, layer);
			layer.states[newState.getId()] = newState;
			rect.calcBoundary();
			layer.states[newState.getId()].setDragBoundFunc(function(pos) {
				var X = pos.x;
				var Y = pos.y;
				if (X < minX) {
					X = minX;
				}
				if (X > maxX) {
					X = maxX;
				}
				if (Y < minY) {
					Y = minY;
				}
				if (Y > maxY) {
					Y = maxY;
				}
				return ( {
					x : X,
					y : Y
				});
			});
			layer.statesNum++;
			layer.states[newState.getId()].select();

			dialogBoxes.close();
			dialogBoxes.actionToolbar = new ActionToolbar(newState);
			dialogBoxes.actionToolbar.currentState = newState;
			dialogBoxes.actionToolbar.setAutoPosition(newState.getX(), newState.getY());
		}
	});
	layer.add(rect);

	layer.drawDiagram = function(statediagram) {
		var states = statediagram.getElementsByTagName("state");
		for (var i = 0; i < states.length; i++) {
			var newState = new State23(parseInt(states[i].attributes["pos_x"].value), parseInt(states[i].attributes["pos_y"].value), states[i].attributes["name"].value, layer);
			if(i == 0){
				newState.oval.setStrokeWidth(3);
				newState.isMain = true;
			}
			
			newState.xml = states[i];
			//newState.buttons["stateRenameButton"].hide();
			layer.states[newState.getId()] = newState;
			rect.calcBoundary();
			layer.states[newState.getId()].setDragBoundFunc(function(pos) {
				var X = pos.x;
				var Y = pos.y;
				if (X < minX) {
					X = minX;
				}
				if (X > maxX) {
					X = maxX;
				}
				if (Y < minY) {
					Y = minY;
				}
				if (Y > maxY) {
					Y = maxY;
				}
				return ( {
					x : X,
					y : Y
				});
			});
			layer.statesNum++;
		}

		var trans = statediagram.getElementsByTagName("trans");
		for (var i = 0; i < trans.length; i++) {
			var stateFrom = layer.states[trans[i].attributes["from"].value];
			var stateTo = layer.states[trans[i].attributes["to"].value];
			var newArrow = stateFrom.createTransition(stateTo);
			newArrow.xml = trans[i];
		}
	};

	layer.drawings = new Kinetic.Group({
		clipFunc : function(canvas) {
			var context = canvas.getContext();
			context.rect(rect.getX() + 1, rect.getY() + 1, rect.getWidth() - 2, rect.getHeight() - 2);
		}
	});

	layer.getXML = function() {
		var statediagram = document.createElement("statediagram");
		$(statediagram).attr("name", layer.label);
		var statelist = document.createElement("statelist");
		var translist = document.createElement("translist");
		for (var s in layer.states) {
			//var state = layer.states[s];
			statelist.appendChild(layer.states[s].xml);
			var attrib = layer.states[s].xml2.attributes;
			if(attrib.length != 0) {
				for(var i=0; i<attrib.length; i++){
					//console.log(attrib);
					var name = attrib[i].name;
					//console.log(attrib[i], attrib[i].name, attrib[i].value);
					layer.states[s].xml.setAttribute(name, attrib[i].value);
					//layer.states[s].xml.attributes[name] = attrib[i].value;
					
					console.log(layer.states[s].xml);
				}
			}
			//console.log(s, layer, statelist);
			for (var a in layer.states[s].outArrows) {
				var arrow = layer.states[s].outArrows[a];
				translist.appendChild(arrow.xml);
			}
		}
		statediagram.appendChild(statelist);
		statediagram.appendChild(translist);

		return statediagram;
	};

	layer.add(layer.drawings);
	stage.add(layer);
	stage.arrangeLayer();

	return layer;
};

