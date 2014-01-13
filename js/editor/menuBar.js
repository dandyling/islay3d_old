var drawMenuBar = function() {
	var layer = stage.get('#layerBarebone')[0];

	var space = iconSize + 10;

	addIcon({
		x : m + space * 0,
		y : m,
		source : 'img/menuBar/new.png',
		layer : layer,
		onClick : function(){
			if(confirm("You will lose any unsaved changes!  Are you sure you want to continue to create a new file?")){
				$(window).unbind('beforeunload');
				location.reload();
			}
		}
	});
	addIcon({
		x : m + space * 1,
		y : m,
		source : 'img/menuBar/open.png',
		layer : layer,
		onClick : function() {
			if (stage.get('#labelUserName')[0].getText() == "") {
				var dialog = new DialogLogin();
				var text = dialog.get('Text')[0];
				text.setText('ログインしてください');
				text.setOffsetX(text.getWidth() / 2);
				dialog.draw();
			} else if(confirm("You will lose any unsaved changes!  Are you sure you want to continue to open a saved file?")){
				dialogBoxes.close();
				dialogBoxResources['open-file'].thumbnails.path = 'users/' + stage.pid + '/files/';
				var dialogBox1 = new DialogBoxWithThumbnails(dialogBoxResources['open-file']);
				dialogBoxes.push(dialogBox1);
			}	
		}
	});
	addIcon({
		x : m + space * 2,
		y : m,
		source : 'img/menuBar/save.png',
		layer : layer,
		onClick : function() {
			if (stage.get('#labelUserName')[0].getText() == "") {
				var dialog = new DialogLogin();
				var text = dialog.get('Text')[0];
				text.setText('ログインしてください');
				text.setOffsetX(text.getWidth() / 2);
				dialog.draw();
			} else {
				dialogBoxes.close();
				var dialogBox1 = new DialogBoxImage(dialogBoxResources['save-file']);
				dialogBoxes.push(dialogBox1);
			}			
		}
	});
	/*addIcon({
		x : m + space * 3,
		y : m,
		source : 'img/menuBar/cloud.png',
		layer : layer,
		onClick : function() {
			// <img id="canvasImg" alt="Right click to save me!" style="position: absolute; top: 1000px">	      	
	      	//document.getElementById('canvasImg').src = localStorage.playerScreenshot;
	      	console.log(localStorage.playerScreenshot);
		}
	});*/
	addIcon({
		x : m + space * 4 + 20,
		y : m,
		source : 'img/menuBar/undo.png',
		layer : layer
	});
	addIcon({
		x : m + space * 5 + 20,
		y : m,
		source : 'img/menuBar/redo.png',
		layer : layer
	});
	addIcon({
		x : window.innerWidth - m - iconSize,
		y : m,
		id : 'buttonMenuHelp',
		source : 'img/menuBar/help.png',
		layer : layer,
		onClick : function() {
			var layerAvatar = stage.get('#layerAvatar')[0];
			if(layerAvatar.isVisible()){
				layerAvatar.hide();
			} else {
				layerAvatar.show();
			}
		}
	});

	var imageObj = new Image();
	imageObj.onload = function() {
		var image = new Kinetic.Image({
			id : "buttonLogin",
			x : window.innerWidth - m - iconSize - m - 60,
			y : m + 2 + 5,
			width : 60,
			height : 20,
			image : imageObj
		});
		image.on('click', function() {
			var dialog = new DialogLogin();
		});
		image.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
			image.setShadowOffset(1);
			image.setShadowColor('black');
			layer.draw();
		});
		image.on('mouseout', function() {
			document.body.style.cursor = cursor;
			image.setShadowOffset(0);
			image.setShadowColor('#C0C0C0');
			layer.draw();
		});
		if (localStorage.data != undefined && !oldLogin()) {
			image.hide();
		}
		layer.add(image);
		image.draw();
	};
	imageObj.src = 'img/menuBar/login.png';

	var imageObj2 = new Image();
	imageObj2.onload = function() {
		var image = new Kinetic.Image({
			id : "buttonLogout",
			x : window.innerWidth - m - iconSize - m - 60,
			y : m + 2 + 5,
			width : 60,
			height : 20,
			image : imageObj2
		});
		image.on('click', function() {
			localStorage.clear();
			logout();
		});
		image.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
			image.setShadowOffset(1);
			image.setShadowColor('black');
			layer.draw();
		});
		image.on('mouseout', function() {
			document.body.style.cursor = cursor;
			image.setShadowOffset(0);
			image.setShadowColor('#C0C0C0');
			layer.draw();
		});
		if (localStorage.data == undefined || (localStorage.data != undefined && oldLogin())) {
			image.hide();
		}
		layer.add(image);
		image.draw();
	};
	imageObj2.src = 'img/menuBar/logout.png';
};
