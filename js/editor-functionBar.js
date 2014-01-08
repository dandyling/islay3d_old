var drawFunctionBar = function() {
	var layer = new Kinetic.Layer();
	var m1 = 8;

	var h = (iconSize + 20) * 3 + 13 * 4;
	var w = iconSize + 23 * 2;

	var posX = m;
	var posY = menuBarHeight + m + m;

	var rect1 = new Kinetic.Rect({
		x : posX,
		y : posY,
		width : w,
		height : h + 20,
		stroke : '#C0C0C0',
		strokeWidth : 1,
		cornerRadius : 4,
		fillLinearGradientColorStops : [0, '#E0E0E0', 0.5, '#F0F0F0', 1, '#E0E0E0'],
		fillLinearGradientStartPoint : [w, 0],
		shadowOffset : 2,
		shadowOpacity : 0.8,
		id : 'rectFunctionBar'
	});
	layer.add(rect1);
	
	var space = iconSize + 20 + 20;
	addIcon({
		x : posX + 23,
		y : posY + 13 + space * 0,
		source : 'img/functionBar/character.png',
		layer : layer,
		id : 'buttonCharacter',
		addText : true,
		text : 'キャラクター\n作成',
		drawHitFunc : function(canvas){
			var context = canvas.getContext();
			context.beginPath();
			context.rect(0 - 23, 0 - 13, w, iconSize + 20 * 2);
			context.closePath();
			canvas.fillStroke(this);
		},
		onClick : function() {
			dialogBoxes.close();
			var dialogBox1 = new DialogBoxWithThumbnails(dialogBoxResources['character-create']);
			dialogBoxes.push(dialogBox1);
		}
	});
	addIcon({
		x : posX + 23,
		y : posY + 13 + space * 1,
		source : 'img/functionBar/robot.png',
		layer : layer,
		id : 'buttonComplex',
		addText : true,
		text : 'コンプレックス体\n作成',
		drawHitFunc : function(canvas){
			var context = canvas.getContext();
			context.beginPath();
			context.rect(0 - 23, 0 - 13, w, iconSize + 20 * 2);
			context.closePath();
			canvas.fillStroke(this);
		},
	});
	addIcon({
		x : posX + 23,
		y : posY + 13 + space * 2,
		source : 'img/functionBar/group.png',
		layer : layer,
		id : 'buttonGroup',
		addText : true,
		text : 'グループ作成',
		drawHitFunc : function(canvas){
			var context = canvas.getContext();
			context.beginPath();
			context.rect(0 - 23, 0 - 13, w, iconSize + 20 * 2);
			context.closePath();
			canvas.fillStroke(this);
		},
		onClick : function(){
			if(characterPanels.length == 0){
				alert("Please add a character to the game first");
				return;
			}
			dialogBoxes.close();
			var dialogBox1 = new DialogBoxWithAddThumbnails(dialogBoxResources['group-create']);
			dialogBoxes.push(dialogBox1);
		}
	});

	var rect2 = new Kinetic.Rect({
		x : rect1.getX(),
		y : rect1.getY() + rect1.getHeight() + m1,
		width : rect1.getWidth(),
		height : (iconSize + 20) + 13 * 2,
		stroke : '#C0C0C0',
		strokeWidth : 1,
		cornerRadius : 4,
		fillLinearGradientColorStops : [0, '#E0E0E0', 0.5, '#F0F0F0', 1, '#E0E0E0'],
		fillLinearGradientStartPoint : [w, 0],
		shadowOffset : 2,
		shadowOpacity : 0.8,
	});
	layer.add(rect2);

	var space = iconSize + 20;
	addIcon({
		x : rect2.getX() + 23,
		y : rect2.getY() + 13 + space * 0,
		source : 'img/functionBar/world.png',
		layer : layer,
		id : 'buttonWorld',
		addText : true,
		text : 'ワールド設定',
		drawHitFunc : function(canvas){
			var context = canvas.getContext();
			context.beginPath();
			context.rect(0 - 23, 0 - 13, w, iconSize + 20 * 2 + 6);
			context.closePath();
			canvas.fillStroke(this);
		},
	});
	//stage.add(layer);

	var rect3 = new Kinetic.Rect({
		x : rect1.getX(),
		y : rect2.getY() + rect2.getHeight() + m1,
		width : rect1.getWidth(),
		height : (iconSize + 20) + 13 * 2,
		stroke : '#C0C0C0',
		strokeWidth : 1,
		cornerRadius : 4,
		fillLinearGradientColorStops : [0, '#E0E0E0', 0.5, '#F0F0F0', 1, '#E0E0E0'],
		fillLinearGradientStartPoint : [w, 0],
		shadowOffset : 2,
		shadowOpacity : 0.8,
		
	});
	layer.add(rect3);

	var space = iconSize + 20;
	addIcon({
		x : rect3.getX() + 23,
		y : rect3.getY() + 13 + space * 0,
		source : 'img/functionBar/run.png',
		layer : layer,
		id : 'buttonRun',
		addText : true,
		text : '動かす',
		drawHitFunc : function(canvas){
			var context = canvas.getContext();
			context.beginPath();
			context.rect(0 - 23, 0 - 13, w, iconSize + 20 * 2 + 6);
			context.closePath();
			canvas.fillStroke(this);
		},
		onClick : function() {
			var xml = convertToXML(stage.getXML());
			console.log(xml);
			localStorage.playerXML = xml;
			playerWin = window.open('./player.php', '', 'width=' + 640 + ', ' + 'height=' + 480);
		}
	});
	stage.add(layer);
	stage.arrangeLayer();
}; 