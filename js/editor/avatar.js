var Avatar = function(config) {
	var layer = new Kinetic.Layer({
		id : "layerAvatar"
	});
	stage.add(layer);

	var avatar = new Kinetic.Group({
		id : config.id,
		x : config.x,
		y : config.y,
		draggable : false
	});
	layer.add(avatar);

	var imageObj = new Image();
	imageObj.onload = function() {
		var image = new Kinetic.Image({
			image : imageObj,
			width : config.width,
			height : config.height,
			shadowOpacity : 0.5,
			shadowBlur : 1,
		});
		avatar.add(image);
		image.on('click', function() {
			bubble.show();
			layer.get('#pointerAvatar')[0].show();
		});
		image.on('dragstart', function() {
			layer.moveToTop();
		});
		avatar.draw();
	};
	imageObj.src = config.source;

	var bubble = new Kinetic.Label({
		y : 68,
		//opacity: 0.85
	});
	avatar.add(bubble);

	var tag = new Kinetic.Tag({
		fill : '#EDC97A',
		pointerDirection : 'right',
		pointerWidth : 10,
		pointerHeight : 10,
		lineJoin : 'round',
		stroke : 'red',
		strokeWidth : '2',
	});
	bubble.add(tag);

	var text = new Kinetic.Text({
		fontFamily : 'Calibri',
		fontSize : 16,
		padding : 20,
		fill : 'black',
		align : 'center',
		text : config.text
	});
	bubble.add(text);
	
	var buttonX;
	var imageObj2 = new Image();
	imageObj2.onload = function() {
		buttonX = new Kinetic.Image({
			id : 'buttonBubbleClose',
			x : -tag.getPointerHeight() - 20 - 5,
			y : -tag.getHeight() / 2 + 5,
			width : 20,
			height : 20,
			image : imageObj2,
		});
		bubble.add(buttonX);
		bubble.draw();
		buttonX.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		buttonX.on('mouseout', function() {
			document.body.style.cursor = cursor;
		});
		buttonX.on('click', function() {
			bubble.hide();
			layer.get('#pointerAvatar')[0].hide();
			stage.draw();
		});
		buttonX.adjustPosition = function() {
			buttonX.setPosition(-tag.getPointerHeight() - 20 - 5, -tag.getHeight() / 2 + 5);
		};
	};
	imageObj2.src = 'img/avatar/cross.png';

	var button1 = addButton({
		id : 'buttonBubbleNext',
		x : -tag.getWidth() / 2 - 30 - 15,
		y : 30,
		width : 60,
		height : 20,
		layer : bubble,
		text : 'つぎへ',
		isMain : true,
		onClick : function() {
			avatar.say("まず、あたらしいキャラクターを\n追加してみましょう。\n\n「キャラクター作成」ボタンを\nクリックしてください。");
			button1.hide();
			var pointer = stage.get('#pointerAvatar')[0];
			pointer.hide();
			setTimeout(function(){
				pointer.setX(stage.get('#rectFunctionBar')[0].getX() + 150);
				pointer.setY(stage.get('#rectFunctionBar')[0].getY() + 50);	
				pointer.setCenterX();
				pointer.setRotation(Math.PI);
				pointer.show();
			}, 1000);
			/*var tween = new Kinetic.Tween({
				node : stage.get('#pointerAvatar')[0],
				duration : 1,
				x : stage.get('#rectFunctionBar')[0].getX() + 150,
				y : stage.get('#rectFunctionBar')[0].getY() + 50,
				rotation : Math.PI,
				onFinish : stage.get('#pointerAvatar')[0].setCenterX
			});
			tween.play();*/
			var marker = new Marker();
		}
	});
	
	avatar.say = function(msg) {
		text.setText(msg);
		buttonX.adjustPosition();
		avatar.draw();
	};

	return avatar;
};

var Pointer = function(config) {
	var layer = stage.get('#layerAvatar')[0];

	var pointer = new Kinetic.Tag({
		id : 'pointerAvatar',
		x : config.x,
		y : config.y,
		width : 25,
		height : 25,
		stroke : 'red',
		strokeWidth : 3,
		fill : 'yellow',
		pointerDirection : 'right',
		pointerWidth : 45,
		pointerHeight : 50,
		lineJoin : 'round'
	});
	layer.add(pointer);

	pointer.setCenterX = function() {
		centerX = pointer.getX();
	};

	pointer.setCenterY = function() {
		centerY = pointer.getY();
	};

	var amplitude = 10;
	var amplitudeY = 5;
	var period = 1500;
	var centerX = pointer.getX();
	var centerY = pointer.getY();
	pointer.animation = new Kinetic.Animation(function(frame) {
		pointer.setX(amplitude * Math.sin(frame.time * 2 * Math.PI / period) + centerX);
	}, layer);
	pointer.animation2 = new Kinetic.Animation(function(frame) {
		pointer.setY(amplitudeY * Math.sin(frame.time * 2 * Math.PI / period) + centerY);
	}, layer);

	pointer.animation.start();
};

var Marker = function() {
	var marker = new Kinetic.Circle({
		x : stage.get('#rectFunctionBar')[0].getX() + 40,
		y : stage.get('#rectFunctionBar')[0].getY() + 40,
	});
	marker.config1 = {
		radius : 40,
		fill : 'red',
		opacity : 0, // 0.5 for visible
	};
	marker.setAttrs(marker.config1);

	marker.on('mouseover', function() {
		document.body.style.cursor = 'pointer';
	});
	marker.on('mouseout', function() {
		document.body.style.cursor = cursor;
	});
	var layer = stage.get('#layerAvatar')[0];
	var avatar = stage.get('#islayAvatar')[0];
	var pointer = stage.get('#pointerAvatar')[0];

	var click15 = function() {
		stage.get('#buttonRun')[0].fire('click');
		marker.hide();
		avatar.say("おめでとう\n\nゲームをインタラクティブにすることができました！\n\n");
		var button = avatar.get('#buttonBubbleNext')[0];
		button.rect.setX(-avatar.get('Tag')[0].getWidth() / 2 - 30 - 15);
		var text = button.get('Text')[0];
		text.setText('終了');
		text.setX(button.rect.getX() + 30);
		text.setOffsetX(Math.round(text.getWidth() / 2));
		button.show();
		button.off('click');
		button.on('click', function() {
			pointer.animation.stop();
			pointer.hide();
			layer.draw();
			avatar.get('#buttonBubbleClose')[0].fire('click');
			stage.get('#layerAvatar')[0].hide();
		});
		pointer.hide();
		
		setTimeout(function(){
			pointer.setX(button.rect.getAbsolutePosition().x - 90);
			pointer.setY(button.rect.getAbsolutePosition().y);	
			pointer.setCenterX();
			pointer.setRotation(0);
			pointer.show();
		}, 1000);
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : button.rect.getAbsolutePosition().x - 90,
			y : button.rect.getAbsolutePosition().y,
			rotation : 0,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		layer.draw();
	};

	var click14 = function() {
		stage.get('#buttonOK')[0].fire('click');
		avatar.say("もどるやじるしをかく\n\n２個目の丸をクリックしたまま、\n１個目の丸にドラッグして、\n\n最初の動きにもどってくるようにします。\n\n注:今回、じょうけんを設定してないため、\n自動的に1つ目の動きにもどる");
		marker.hide();
		marker.draw();
		setTimeout(function() {
			pointer.hide();
			var marker1 = marker.clone();
			marker1.setAttrs(marker.config2);
			marker1.setAttrs(marker.config21);
			marker1.setX(avatar.state2.getX());
			marker1.setY(avatar.state2.getY());
			var layerDiagram = stage.selectedPanel.selectedDiagram;
			layerDiagram.add(marker1);
			layerDiagram.drawings.moveToTop();
			avatar.state2.select();
			layerDiagram.draw();
			avatar.state2.on('mousedown', function() {
				if (stage.get('#tempArrow')[0] != undefined) {
					stage.get('#tempArrow')[0].destroy();
					clearInterval(avatar.intID);
					layer.draw();
				}
			});

			var arrow = new Kinetic.Group({
				id : 'tempArrow'
			});
			layer.add(arrow);
			var x1 = avatar.state2.getX(), y1 = avatar.state2.getY();
			var x2 = avatar.state1.getX() - 6, y2 = avatar.state1.getY();
			var vertex = calcVertices(x1, y1, x2, y2, 6, true);
			var spline = new Kinetic.Spline({
				points : [x1, y1, x1, y1, x1, y1],
				stroke : '#C33745',
				strokeWidth : 2,
				dashArray : [4, 2],
				tension : 0.5,
			});
			arrow.add(spline);
			var angle = Math.atan2(y2 - y1, x2 - x1);
			var triangle = new Kinetic.Polygon({
				points : [x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6), x2, y2, x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6)],
				fill : '#C33745'
			});
			var tween2 = new Kinetic.Tween({
				node : spline,
				duration : 1,
				points : [x1, y1, vertex.x, vertex.y, x2, y2],
				onFinish : function() {
					arrow.add(triangle);
					var blink = true;
					avatar.intID = setInterval(function() {
						blink = !blink;
						arrow.setOpacity( blink ? 1 : 0);
						arrow.draw();
					}, 500);
				}
			});
			tween2.play();

			stage.on('arrow-created', function(arrow) {
				marker1.destroy();
				
				layerDiagram.draw();
				var functionBar = stage.get('#rectFunctionBar')[0];
				pointer.hide();
				setTimeout(function(){
					pointer.setX(functionBar.getX() + 150);
					pointer.setY(functionBar.getY() + 370);	
					pointer.setCenterX();
					pointer.setRotation(Math.PI);
					pointer.show();
				}, 1000);
				/*var tween = new Kinetic.Tween({
					node : pointer,
					duration : 1,
					x : functionBar.getX() + 150,
					y : functionBar.getY() + 370,
					rotation : Math.PI,
					onFinish : pointer.setCenterX
				});
				tween.play();*/
				avatar.say("それじゃあ、ゲームを実行してみよう。\n\nその後で、キーボードの「→」キーをおして、\nまた動きを確認してみましょう。");
				marker.setX(functionBar.getX() + 38);
				marker.setY(functionBar.getY() + 360);
				marker.off('click');
				marker.on('click', click15);
				marker.show();
				pointer.show();
				layer.draw();
			});
		}, 1000);

	};

	var click13 = function() {
		var button = stage.get('#buttonArrowKeyboard')[0];
		button.fire('click');
		var dialog = stage.get('#arrowToolbar')[0].dialog;
		var buttonOK = stage.get('#buttonOK')[0];
		marker.setX(buttonOK.getAbsolutePosition().x + 50);
		marker.setY(buttonOK.getAbsolutePosition().y + 77);
		pointer.hide();
		setTimeout(function(){
			pointer.setX(buttonOK.getAbsolutePosition().x - 85);
			pointer.setY(buttonOK.getAbsolutePosition().y);	
			pointer.setCenterX();
			pointer.setRotation(0);
			pointer.show();
		}, 1000);

		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : buttonOK.getAbsolutePosition().x - 85,
			y : buttonOK.getAbsolutePosition().y,
			rotation : 0,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		marker.off('click');
		marker.on('click', click14);
		avatar.say("ボックス中の「→」をえらんで、\nOKをおしてください。\n\nそうすると、もし「→」のキーをおすとき、\nキャラクターは前に決まった\n２個目の動きをする。");
	};

	var click12 = function() {
		stage.get('#buttonArrow')[0].fire('click');
		avatar.say("やじるしをかく\n\n1つ目の丸をクリックしたまま、\n２つ目の丸までドラッグしてください。\n\nそうすると、1つ目の動きが終わったら、\n２つ目の動きへ進む");
		setTimeout(function() {
			pointer.hide();
			var marker1 = marker.clone();
			marker.hide();
			marker.config21 = {
				radius : 14,
				opacity : 1,
				strokeEnabled : 1
			};
			marker1.setAttrs(marker.config2);
			marker1.setAttrs(marker.config21);
			marker1.setX(avatar.state1.getX());
			marker1.setY(avatar.state1.getY());
			var layerDiagram = stage.selectedPanel.selectedDiagram;
			layerDiagram.add(marker1);
			layerDiagram.drawings.moveToTop();
			avatar.state1.select();
			layerDiagram.draw();
			avatar.state1.on('mousedown', function() {
				if (stage.get('#tempArrow')[0] != undefined) {
					stage.get('#tempArrow')[0].destroy();
					clearInterval(avatar.intID);
					layer.draw();
				}
			});

			var arrow = new Kinetic.Group({
				id : 'tempArrow'
			});
			layer.add(arrow);
			var x1 = avatar.state1.getX() + 18, y1 = avatar.state1.getY();
			var x2 = avatar.state2.getX() - 6, y2 = avatar.state2.getY();
			var spline = new Kinetic.Spline({
				points : [x1, y1, x1, y1],
				stroke : '#C33745',
				strokeWidth : 2,
				dashArray : [4, 2],
				tension : 0.5,
			});
			arrow.add(spline);
			var angle = Math.atan2(y2 - y1, x2 - x1);
			var triangle = new Kinetic.Polygon({
				points : [x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6), x2, y2, x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6)],
				fill : '#C33745'
			});
			var tween2 = new Kinetic.Tween({
				node : spline,
				duration : 1,
				points : [x1, y1, x2, y2],
				onFinish : function() {
					arrow.add(triangle);
					var blink = true;
					avatar.intID = setInterval(function() {
						blink = !blink;
						arrow.setOpacity( blink ? 1 : 0);
						arrow.draw();
					}, 500);
				}
			});
			tween2.play();

			stage.on('arrow-created', function(arrow) {
				marker1.destroy();
				layerDiagram.draw();
				avatar.say("進むのじょうけんをきめる\n\n「キー」ボタンをクリックして\nじょうけんをせんたくする。");
				var toolbar = stage.get('#rectDiagramEditor')[0];
				pointer.setX(toolbar.getWidth() / 2 - 80);
				pointer.setY(toolbar.getHeight() + 15);
				pointer.setRotation(0);
				pointer.setCenterX();
				pointer.show();
				marker.setAttrs(marker.config1);
				marker.setStrokeEnabled(false);
				marker.setX(toolbar.getWidth() / 2 + 25);
				marker.setY(toolbar.getHeight() + 25);
				marker.show();
				marker.off('click');
				marker.on('click', click13);
				stage.off('arrow-created');
			});
		}, 1000);
	};

	var click11 = function() {
		stage.get('#actionToolbar')[0].dialog.get('#buttonOK')[0].fire('click');
		avatar.say("やじるしをかく\n\nつぎに、矢印を書いて２つの動き\nをつなげてみましょう。矢印ツールを\nクリックしてください。");
		var drawingToolbar = stage.get('#groupDrawingToolbar')[0];
		pointer.hide();
		setTimeout(function(){
			pointer.setX(drawingToolbar.getX() - 90);
			pointer.setY(drawingToolbar.getY() + 100);	
			pointer.setCenterX();
			pointer.setRotation(0);
			pointer.show();
		}, 1000);
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : drawingToolbar.getX() - 90,
			y : drawingToolbar.getY() + 100,
			rotation : 0,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		marker.setX(drawingToolbar.getX() + 30);
		marker.setY(drawingToolbar.getY() + 110);
		marker.off('click');
		marker.on('click', click12);
		stage.showHitCanvas(stage.get('#layerAvatar')[0]);
	};

	var click10 = function() {
		stage.get('#buttonActionMove')[0].fire('click');
		var toolbar = stage.get('#actionToolbar')[0];
		pointer.hide();
		setTimeout(function(){
			pointer.setX(toolbar.dialog.getX() - 80);
			pointer.setY(toolbar.dialog.getY() + 15);	
			pointer.setCenterX();
			pointer.setRotation(0);
			pointer.show();
		}, 1000);
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : toolbar.dialog.getX() - 80,
			y : toolbar.dialog.getY() + 15,
			rotation : 0,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		/*$(toolbar.dialog.inputZr).animate({
			backgroundColor : "#C33745"
		}, 500);*/
		avatar.say("キャラクターをうごかす\n\n別のテキストボックスの数字を\nふやしてみてください。\n\nこんど、キャラクターは右に\nかいてんするようにしましょう");
		marker.setX(toolbar.dialog.getX() + 142);
		marker.setY(toolbar.dialog.getY() + 150);
		marker.off('click');
		marker.on('click', click11);
	};

	var click9 = function() {
		stage.on('state-created', function(state) {
			avatar.state2 = state;
			stage.off('state-created');
		});
		stage.selectedPanel.selectedDiagram.get('#rectDiagramEditor')[0].fire('mousedown');
		var toolbar = stage.get('#actionToolbar')[0];
		pointer.hide();
		setTimeout(function(){
			pointer.setX(toolbar.getX() - 80);
			pointer.setY(toolbar.getY() + 15);	
			pointer.setCenterX();
			pointer.setRotation(0);
			pointer.show();
		}, 1000);
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : toolbar.getX() - 80,
			y : toolbar.getY() + 15,
			rotation : 0,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		pointer.animation.start();
		marker.animation.stop();
		marker.setAttrs(marker.config1);
		marker.setScale(1);
		marker.setStrokeEnabled(false);
		marker.setX(toolbar.getX() + 25);
		marker.setY(toolbar.getY() + 25);
		avatar.say("２個目の動きをきめる\n\n２個目の丸の動きをきめましょう。\n「うごかす」しるしの所を\nクリックしてください。");
		marker.off('click');
		marker.on('click', click10);
	};

	var click8 = function() {
		stage.get('#buttonRun')[0].fire('click');
		pointer.hide();
		marker.hide();
		avatar.say("おめでとう!!\n\nゲームできた!");
		setTimeout(function() {
			pointer.setX(650);
			pointer.setY(150);
			pointer.setRotation(Math.PI * 0.25);
			pointer.setCenterX();
			//pointer.animation.stop();
			pointer.show();
			marker.setX(730);
			marker.setY(230);
			marker.setAttrs(marker.config2);
			marker.setStrokeEnabled(true);
			marker.animation.start();
			marker.show();
			marker.off('click');
			marker.on('click', click9);
			avatar.say("２個目の丸をかく\n\nこんどは、２個目の丸を書いてみましょう。");
		}, 4000);
	};

	var click7 = function() {
		stage.get('#actionToolbar')[0].dialog.get('#buttonOK')[0].fire('click');
		var functionBar = stage.get('#rectFunctionBar')[0];
		pointer.hide();
		setTimeout(function(){
			pointer.setX(functionBar.getX() + 150);
			pointer.setY(functionBar.getY() + 370);	
			pointer.setCenterX();
			pointer.setRotation(Math.PI);
			pointer.show();
		}, 1000);
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : functionBar.getX() + 150,
			y : functionBar.getY() + 370,
			rotation : Math.PI,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		avatar.say("ゲームをはじめよう！\n\nそれじゃあ、ゲームを実行して、\n動きを確認してみましょう。");
		marker.setX(functionBar.getX() + 38);
		marker.setY(functionBar.getY() + 360);
		marker.off('click');
		marker.on('click', click8);
	};

	var click6 = function() {
		stage.get('#buttonActionMove')[0].fire('click');
		var toolbar = stage.get('#actionToolbar')[0];
		pointer.hide();
		setTimeout(function(){
			pointer.setX(toolbar.dialog.getX() - 80);
			pointer.setY(toolbar.dialog.getY() + 15);	
			pointer.setCenterX();
			pointer.setRotation(0);
			pointer.show();
		}, 1000);
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : toolbar.dialog.getX() - 80,
			y : toolbar.dialog.getY() + 15,
			rotation : 0,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		/*$(toolbar.dialog.inputY).animate({
			backgroundColor : "#C33745"
		}, 500);*/
		avatar.say("キャラクターをうごかす\n\nテキストボックスの数字を\nふやしてみてください。\n\nキャラクターが前に動くようにしましょう");
		marker.setX(toolbar.dialog.getX() + 142);
		marker.setY(toolbar.dialog.getY() + 150);
		marker.off('click');
		marker.on('click', click7);
	};

	var click5 = function() {
		stage.on('state-created', function(state) {
			avatar.state1 = state;
			stage.off('state-created');
		});
		stage.selectedPanel.selectedDiagram.get('#rectDiagramEditor')[0].fire('mousedown');
		var toolbar = stage.get('#actionToolbar')[0];
		pointer.hide();
		setTimeout(function(){
			pointer.setX(toolbar.getX() - 80);
			pointer.setY(toolbar.getY() + 15);	
			pointer.setCenterX();
			pointer.setRotation(0);
			pointer.show();
		}, 1000);
		
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : toolbar.getX() - 80,
			y : toolbar.getY() + 15,
			rotation : 0,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		pointer.animation.start();
		marker.animation.stop();
		marker.setAttrs(marker.config1);
		marker.setScale(1);
		marker.setStrokeEnabled(false);
		marker.setX(toolbar.getX() + 25);
		marker.setY(toolbar.getY() + 25);
		avatar.say("動きをきめる\n\nこの丸の動きをきめましょう。\n「うごかす」しるしの所を\nクリックしてください。");
		marker.off('click');
		marker.on('click', click6);
	};

	var click4 = function() {
		pointer.hide();
		setTimeout(function(){
			pointer.setX(450);
			pointer.setY(150);	
			pointer.setCenterX();
			pointer.setRotation(Math.PI * 0.25);
			pointer.show();
		}, 1000);
		
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : 350,
			y : 150,
			rotation : Math.PI * 0.25,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		marker.setX(530);
		marker.setY(230);
		marker.config2 = {
			fill : 'white',
			radius : 15,
			stroke : 'red',
			strokeWidth : 2,
			dashArray : [4, 1],
			opacity: 0.5,
		};
		marker.setAttrs(marker.config2);
		pointer.animation.stop();
		var amplitude = 0.15;
		var period = 1000;
		marker.animation = new Kinetic.Animation(function(frame) {
			marker.setScale(amplitude * Math.sin(frame.time * 2 * Math.PI / period) + 2);
		}, layer);
		marker.animation.start();
		avatar.say('あかい丸でかこまれたところを\nクリックすると、丸がひょうじされます。');
		marker.off('click');
		marker.on('click', click5);
	};

	var click3 = function() {
		avatar.say("おめでとう！！\n\nキャラクターをゲームについかできました。");
		marker.hide();
		pointer.hide();
		setTimeout(function() {
			var drawingToolbar = stage.get('#groupDrawingToolbar')[0];
			marker.setX(drawingToolbar.getX() + 30);
			marker.setY(drawingToolbar.getY() + 70);
			marker.setScale(1);
			marker.setOpacity(0); // set 0.5 for red
			marker.show();
			pointer.setX(drawingToolbar.getX() - 90);
			pointer.setY(drawingToolbar.getY() + 60);
			pointer.setRotation(0);
			pointer.show();
			pointer.setCenterX();
			avatar.say("キャラクターを動かしてみよう\n\nこんどは、サークルツールを\nえらんで動きをつくりましょう。");
			marker.off('click');
			marker.on('click', click4);
		}, 3000);
	};

	var click2 = function() {
		stage.get('#character-create')[0].panels.off('click');
		var dialogBox = stage.get('#character-adjustPosition')[0];
		pointer.hide();
		setTimeout(function(){
			pointer.setX(dialogBox.rect.getX() + dialogBox.rect.getWidth() / 2);
			pointer.setY(dialogBox.rect.getY() + dialogBox.rect.getHeight() + 35);	
			pointer.setCenterX();
			pointer.setRotation(Math.PI * -0.25);
			pointer.show();
		}, 1000);
		
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : dialogBox.rect.getX() + dialogBox.rect.getWidth() / 2,
			y : dialogBox.rect.getY() + dialogBox.rect.getHeight() + 35,
			rotation : Math.PI * -0.25,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		avatar.say("Click the next button");
		marker.setX(dialogBox.rect.getX() + dialogBox.rect.getWidth() / 2 + 75);
		marker.setY(dialogBox.rect.getY() + dialogBox.rect.getHeight() - 25);
		marker.setScaleX(2.2);
		marker.setScaleY(0.7);
		marker.off('click');
		marker.on('click', click3);
		marker.show();
	};

	var click1 = function() {
		stage.get('#buttonCharacter')[0].fire('click');
		pointer.hide();
		setTimeout(function(){
			pointer.setX(stage.get('#character-create')[0].rect.getX() - 50);
			pointer.setY(stage.get('#character-create')[0].rect.getY() + 80);	
			pointer.setCenterX();
			pointer.setRotation(0);
			pointer.show();
		}, 1000);
		
		/*var tween = new Kinetic.Tween({
			node : pointer,
			duration : 1,
			x : stage.get('#character-create')[0].rect.getX() - 50,
			y : stage.get('#character-create')[0].rect.getY() + 80,
			rotation : 0,
			onFinish : pointer.setCenterX
		});
		tween.play();*/
		avatar.say("つぎに、すきなキャラクターを選んでください");
		marker.hide();
		stage.get('#character-create')[0].panels.on('mousedown', click3);
	};

	marker.on('click', click1);

	stage.get('#layerAvatar')[0].add(marker);
	return marker;
};

(function() {
	var avatar = new Avatar({
		id : 'islayAvatar',
		name : 'label',
		source : 'img/avatar/islayAvatar.png',
		x : window.innerWidth - 140,
		y : window.innerHeight - 180,
		width : 100,
		height : 100,
		text : "ようこそ！！\n\nこんにちは、ぼくはアイラ。はじめてのユーザー\nですか？ぼくが使いかたを説明します。\n\n",
	});
	var buttonPos = avatar.get('#buttonBubbleNext')[0].rect.getAbsolutePosition();
	var pointer = new Pointer({
		x : buttonPos.x - 90,
		y : buttonPos.y
	});
	stage.get('#layerAvatar')[0].hide();
})();