var drawBackground = function() {
	var layer = new Kinetic.Layer({
		id : 'layerBarebone'
	});

	var rect = new Kinetic.Rect({
		x : 0,
		y : 0,
		width : window.innerWidth,
		height : window.innerHeight,
		fill : '#F2F2F2',
		opacity : 0.5
	});

	layer.add(rect);
	stage.add(layer);
	stage.arrangeLayer();
}; 