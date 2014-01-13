var dialogBoxes = new Array();
dialogBoxes.closeSmallDialogs = function() {
	if (dialogBoxes.actionToolbar != undefined) {
		if (dialogBoxes.actionToolbar.dialog != undefined) {
			dialogBoxes.actionToolbar.dialog.close();
			delete dialogBoxes.actionToolbar.dialog;
		}
	}
	if (dialogBoxes.arrowToolbar != undefined) {
		if (dialogBoxes.arrowToolbar.dialog != undefined) {
			dialogBoxes.arrowToolbar.dialog.close();
			delete dialogBoxes.arrowToolbar.dialog;
		}
	}
	if (dialogBoxes.stateRenameDialog != undefined) {
		dialogBoxes.stateRenameDialog.close();
		delete dialogBoxes.stateRenameDialog;
	}
	if (dialogBoxes.charPanelRenameDialog != undefined) {
		dialogBoxes.charPanelRenameDialog.close();
		delete dialogBoxes.charPanelRenameDialog;
	}
	if (dialogBoxes.diagRenameDialog != undefined) {
		dialogBoxes.diagRenameDialog.close();
		delete dialogBoxes.diagRenameDialog;
	}
	if (dialogBoxes.diagDuplicateChar != undefined) {
		dialogBoxes.diagDuplicateChar.close();
		delete dialogBoxes.diagDuplicateChar;
	}
	if (dialogBoxes.loginDialog != undefined) {
		dialogBoxes.loginDialog.close();
		delete dialogBoxes.loginDialog;
	}
};

dialogBoxes.close = function() {
	while (dialogBoxes.length != 0) {
		var lastElement = dialogBoxes.pop();
		lastElement.getParent().destroy();
	}
	if (dialogBoxes.actionToolbar != undefined) {
		dialogBoxes.actionToolbar.close();
		delete dialogBoxes.actionToolbar;
	}
	if (dialogBoxes.arrowToolbar != undefined) {
		dialogBoxes.arrowToolbar.close();
		delete dialogBoxes.arrowToolbar;
	}
	dialogBoxes.closeSmallDialogs();
};

var createImportModelButton = function() {
	var dialog1 = stage.get('#character-create')[0];
	if (dialog1 == undefined) {
		dialog1 = stage.get('#character-create-changePanel')[0];
	}

	var html = "<div class='container' id='divfileupload'>" + "<span class='btn btn-success fileinput-button' style='pointer-events: none' >" + "<span>Import Model</span>" + "<input id='fileupload' type='file' name='files[]'>" + "</span>" + "</div>";

	$(document.body).append(html);
	$('#divfileupload').offset({
		left : Math.round(window.innerWidth / 2 + 630 / 2) - 120 - 15,
		top : Math.round(window.innerHeight / 2 + 340 / 2) - 50,
	});

	$(function() {'use strict';
		var url = window.location.hostname === 'blueimp.github.io' ? '//jquery-file-upload.appspot.com/' : 'php/';
		$('#fileupload').fileupload({
			url : url,
			add : function(e, data) {
				var goUpload = true;
				var uploadFile = data.files[0];
				stage.uploadedFileName = uploadFile.name;
				data.formData = {
					pid : stage.pid
				};

				if (!(/\.(dae)$/i).test(uploadFile.name)) {
					alert('daeファイルを選んでください');
					goUpload = false;
				}
				if (uploadFile.size > 20000000) {// 20mb
					common.notifyError('20 MBより小さいファイルを選んでください');
					goUpload = false;
				}
				if (goUpload == true) {
					data.submit();
				}
			},
			dataType : 'json',
			autoUpload : false,
			start : function(e) {
				var html = "<div class='container' id='divprogressbar'>" + "<div>" + "<textarea id='import_name' class='ui-widget-content progress-bar-input' rows='1' cols='66'" + "placeholder='name:' autofocus></textarea>" + "</div>" + "<br>" + "<div>" + "<textarea id='import_description' class='ui-widget-content progress-bar-input' rows='6' cols='66'" + "placeholder='e.g. description, author, url' ></textarea>" + "</div>" + "<br>" + "<div id='progress' class='progress'>" + "<div class='progress-bar progress-bar-success'></div>" + "</div>" + "</div>";
				$(document.body).append(html);
				$('#divprogressbar').css({
					width : 580,
				}).offset({
					left : Math.round(window.innerWidth / 2 - 600 / 2 + 10),
					top : Math.round(window.innerHeight / 2 - 110),
				});
				$('.progress-bar-input').offset({
					left : window.innerWidth / 2 - $('textarea').width() / 2,
				});
				//$('#progress').css({backgroundColor: '#01529A'});
			},
			done : function(e, data) {
				dialogBoxes.close();
				var dialogBox2 = new DialogBox(dialogBoxResources['character-import-model']);
				dialogBoxes.push(dialogBox2);
			},
			progressall : function(e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#progress .progress-bar').css('width', progress + '%');
			}
		}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

	});

	$('#divfileupload').hide();

	dialog1.superDestroy = dialog1.destroy;
	dialog1.destroy = function() {
		dialog1.superDestroy();
		$('#divfileupload').remove();
	};
};

var dialogBoxResources = {};
dialogBoxResources['character-create'] = {
	id : 'character-create',
	title : 'キャラクターをえらんでください：',
	width : 630,
	height : 340,
	buttons : [{
		x : Math.round(window.innerWidth / 2 + 630 / 2) - 150 - 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'モデルをとりこむ',
		isMain : true,
		onClick : function() {
			if (stage.get('#labelUserName')[0].getText() == "") {
				var dialog = new DialogLogin();
				var text = dialog.get('Text')[0];
				text.setText('ログインしてください');
				text.setOffsetX(text.getWidth() / 2);
				dialog.draw();
			} else {
				$('#fileupload').trigger('click');
			}
		}
	}, {
		x : Math.round(window.innerWidth / 2 - 630 / 2) + 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'キャンセル',
		onClick : function() {
			dialogBoxes.close();
		}
	}],
	thumbnails : {
		path : 'users/Google105162652429509013137/models/',
		mime : '.png',
		scale : 0.5,
		onMouseOver : function(e) {
			document.body.style.cursor = 'pointer';

			var layer = stage.get('#character-create')[0].getParent();
			var tooltip = new Kinetic.Label({
				x : this.getAbsolutePosition().x - 4,
				y : this.getAbsolutePosition().y - 4,
				opacity : 0.75
			});
			tooltip.add(new Kinetic.Tag({
				fill : 'white',
				shadowColor : 'black',
				shadowBlur : 10,
				shadowOffset : 10,
				shadowOpacity : 0.5
			}));
			$.ajax({
				url : this.getParent().config.path.replace('png', 'desc'),
				success : function(data) {
					tooltip.add(new Kinetic.Text({
						text : data,
						fontFamily : 'Calibri',
						fontSize : 14,
						padding : 5,
						fill : 'black'
					}));
					tooltip.setOffsetY(tooltip.get('Text')[0].getHeight());

					layer.tooltips.push(tooltip);
					layer.add(tooltip);
					tooltip.draw();
				}
			});

		},
		onMouseOut : function(e) {
			document.body.style.cursor = cursor;

			var layer = stage.get('#character-create')[0].getParent();
			while (layer.tooltips.length != 0) {
				var tooltip = layer.tooltips.pop();
				tooltip.destroy();
			}
			layer.draw();
		},
		onClick : function(e) {
			var panels = this.getParent().getChildren();
			panels.each(function(p) {
				p.rectFrame.setFill('white');
			});
			this.rectFrame.setFill('#00FFFF');

			addCharacterPanel({
				name : this.config.name,
				pathImage : this.config.path,
				pathModel : this.config.path.replace('png', 'dae')
			});

			dialogBoxes.close();
		},
	},
	callback : function() {
		var layer = stage.get('#character-create')[0].getParent();
		layer.tooltips = new Array();
		createImportModelButton();
	}
};

dialogBoxResources['group-create'] = {
	id : 'group-create',
	title : 'グループ作成',
	width : 630,
	height : 340,
	buttons : [{
		x : Math.round(window.innerWidth / 2 + 630 / 2) - 150 - 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'つくる',
		isMain : true,
		onClick : function() {
			var groupName = this.getParent().textField.value;
			if (stage.groups.isExistName(groupName)) {
				alert(groupName + "が存在します。新名を入力してください。");
				return;
			}
			
			var groupCharacters = new Array();
			var panels = this.getParent().panels.getChildren();
			for(var i=0; i<panels.length; i++){
				groupCharacters.push({
					name : panels[i].config.name,
					img : panels[i].getChildren()[1].getFillPatternImage()
				});
			}
			
			addGroupPanel({
				name : groupName,
				characters : groupCharacters
			});
					
			dialogBoxes.close();
		}
	}, {
		x : Math.round(window.innerWidth / 2 - 630 / 2) + 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'キャンセル',
		onClick : function() {
			dialogBoxes.close();
		}
	}],
	thumbnailsSelect : {
		path : 'users/Google105162652429509013137/models/',
		mime : '.png',
		scale : 0.3,
	},
	thumbnails : {
		path : 'users/Google105162652429509013137/models/',
		mime : '.png',
		scale : 0.5,
	},
	callback : function() {
		var layer = stage.get('#group-create')[0].getParent();
		layer.tooltips = new Array();
	}
};

dialogBoxResources['character-import-model'] = {
	id : 'character-import-model',
	title : 'モデルのデータ',
	width : 630,
	height : 340,
	buttons : [{
		x : Math.round(window.innerWidth / 2 + 630 / 2) - 150 - 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'OK',
		isMain : true,

		onClick : function() {
			var modelName = $('#import_name').val();
			stage.modelName = modelName;
			var modelDescription = $('#import_description').val();
			if (modelName == "") {
				alert("モデル名を入力ください");
			} else if (modelDescription == "") {
				alert("モデルはどこから来たか描いてください");
			} else {
				dialogBoxes.close();
				$.ajax({
					type : "POST",
					url : "php/rename.php",
					data : {
						oldName : "../users/" + stage.pid + "/models/" + stage.uploadedFileName,
						newName : "../users/" + stage.pid + "/models/" + modelName + ".dae",
					}
				});
				addCharacterPanel({
					name : modelName,
					pathImage : "img/na.png",
					pathModel : "users/" + stage.pid + "/models/" + modelName + ".dae"
				});
				$.ajax({
					type : "POST",
					url : "php/writefile.php",
					data : {
						data : modelDescription,
						dest : "../users/" + stage.pid + "/models/",
						name : modelName + ".desc"
					}
				});
				player.takeScreenshot = true;
			}
		}
	}, {
		x : Math.round(window.innerWidth / 2 - 630 / 2) + 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'キャンセル',
		onClick : function() {
			dialogBoxes.close();
			console.log("php function to delete the uploaded files");
		}
	}],

	callback : function() {
		var dialog = stage.get('#character-import-model')[0];

		var oriX, oriY;
		dialog.on('dragstart', function() {
			oriX = $('#divprogressbar').offset().left;
			oriY = $('#divprogressbar').offset().top;
		});
		dialog.on('dragmove', function() {
			$('#divprogressbar').offset({
				left : oriX + dialog.getAbsolutePosition().x,
				top : oriY + dialog.getAbsolutePosition().y,
			});
		});
		dialog.superDestroy = dialog.destroy;
		dialog.destroy = function() {
			dialog.superDestroy();
			$('#divprogressbar').remove();
		};
	}
};

$(document).on('previewerScreenshot', function(event, path) {
	try {
		var imgData = $('#canvasEnchant')[0].toDataURL();
		var imgDest = "../users/" + stage.pid + "/models/";
		var imgName = stage.modelName + ".png";
		$.ajax({
			type : "POST",
			url : "php/screenshot.php",
			data : {
				data : imgData,
				dest : imgDest,
				name : imgName
			},
			success : function() {
				var preview = new Image();
				preview.onload = function() {
					var image = new Kinetic.Image({
						image : preview,
					});
					stage.selectedPanel.path = imgPath;
					stage.selectedPanel.rectPanel.setFillPatternImage(preview);
					stage.selectedPanel.rectPanel.setFillPatternScale(0.4);
					stage.selectedPanel.draw();
				};
				preview.src = imgDest + imgName;
			}
		});
	} catch(e) {
		console.log("Browser does not support taking screenshot of 3d context");
		return;
	}
});

dialogBoxResources['character-create-changePanel'] = {
	id : 'character-create-changePanel',
	title : 'キャラクターをえらんでください',
	width : 630,
	height : 340,
	buttons : [{
		x : Math.round(window.innerWidth / 2 + 630 / 2) - 150 - 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'モデルをとりこむ',
		isMain : true,
		onClick : function() {
			if (stage.get('#labelUserName')[0].getText() == "") {
				var dialog = new DialogLogin();
				var text = dialog.get('Text')[0];
				text.setText('ログインしてください');
				text.setOffsetX(text.getWidth() / 2);
				dialog.draw();
			} else {
				$('#fileupload').trigger('click');
			}
		}
	}, {
		x : Math.round(window.innerWidth / 2 - 630 / 2) + 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'キャンセル',
		onClick : function() {
			dialogBoxes.close();
		}
	}],
	thumbnails : {
		path : 'users/Google105162652429509013137/models/',
		mime : '.png',
		onClick : function() {
			var panels = this.getParent().getChildren();
			panels.each(function(p) {
				p.rectFrame.setFill('white');
			});
			this.rectFrame.setFill('#00FFFF');

			charPanel = stage.selectedPanel;
			charPanel.path = this.config.path;
			charPanel.renameCharPanel(this.config.name);
			charPanel.modelPath = charPanel.path.replace("png", "dae");

			var preview = new Image();
			preview.onload = function() {
				var image = new Kinetic.Image({
					image : preview
				});
				charPanel.rectPanel.setFillPatternImage(preview);
				charPanel.getParent().draw();
				//toggleCharactersPanel(charPanel);
			};
			preview.src = charPanel.path;

			charPanel.simpleText.setText(charPanel.getId());
			dialogBoxes.close();
		}
	},
	callback : function() {
		createImportModelButton();
	}
};

dialogBoxResources['save-file'] = {
	id : 'save-file',
	title : 'ファイル名を入力してください：',
	width : 630,
	height : 340,
	buttons : [{
		x : Math.round(window.innerWidth / 2 + 630 / 2) - 150 - 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'OK',
		isMain : true,
		onClick : function() {
			var xml = convertToXML(stage.getXML());
			var filename = $('#textfield-filename').val();
			if (filename == "") {
				filename = "untitled";
			}
			$.ajax({
				type : "POST",
				url : "php/writefile.php",
				data : {
					data : xml,
					dest : "../users/" + stage.pid + "/files/",
					name : filename + ".3di"
				},
				success : function(result) {
					console.log(filename + ".3di" + ' saved');
				}
			});
			if (localStorage.playerScreenshot != undefined) {
				$.ajax({
					type : "POST",
					url : "php/screenshot.php",
					data : {
						data : localStorage.playerScreenshot,
						dest : "../" + "users/" + stage.pid + "/files/",
						name : filename + ".png"
					},
					success : function() {
						console.log(filename + ".png" + ' saved');
					}
				});
			} else {
				$.ajax({
					type : "POST",
					url : "php/copy.php",
					data : {
						srcfile : "../img/na_screenshot.png",
						dest : "../" + "users/" + stage.pid + "/files/",
						name : filename + ".png"
					},
					success : function() {
						console.log(filename + ".png" + ' blank screenshot saved');
					}
				});
			}
			dialogBoxes.close();
		}
	}, {
		x : Math.round(window.innerWidth / 2 - 630 / 2) + 15,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'キャンセル',
		onClick : function() {
			dialogBoxes.close();
		}
	}],
	imgDataUrl : localStorage.playerScreenshot
};

dialogBoxResources['open-file'] = {
	id : 'open-file',
	title : 'セーブファイルを選んでください：',
	width : 630,
	height : 340,
	buttons : [{
		x : Math.round(window.innerWidth / 2) - 150 / 2,
		y : Math.round(window.innerHeight / 2 + 340 / 2) - 40,
		width : 150,
		height : 28,
		text : 'キャンセル',
		onClick : function() {
			dialogBoxes.close();
		}
	}],
	thumbnails : {
		path : 'users/' + stage.pid + '/files/',
		mime : '.png',
		scale : 0.15625,
		onClick : function(e) {
			var panels = this.getParent().getChildren();
			panels.each(function(p) {
				p.rectFrame.setFill('white');
			});
			this.rectFrame.setFill('#00FFFF');

			localStorage.openingFile = this.config.path.replace(".png", ".3di");
			$(window).unbind('beforeunload');
			location.reload();
		},
	},

}; 