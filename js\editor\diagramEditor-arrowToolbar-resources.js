var w = 200;
var h = 90;
var DialogArrowToolbarKeyboard = function(toolbar) {
	var dialog = new DialogSmallToolbarArrow({
		x : toolbar.getX() + toolbar.rect.getWidth() / 2 - w / 2,
		y : toolbar.getY() - h - 10,
		width : w,
		height : h,
		layer : toolbar.layer,
		toolbar : toolbar,
	});
	var SelectBox = dialog.SelectBox;

	var simpleText = new Kinetic.Text({
		x : 15,
		y : 10,
		fontFamily : 'sans-serif',
		fill : 'black',
		fontStyle : 'normal',
		fontSize : 14,
		text : "キー: ",
	});
	dialog.add(simpleText);

	var correspondentKey = function(key){
		var value = "";
		if(key == '←'){
			value = 'LEFT';
		} else if(key == '→'){
			value = 'RIGHT';
		} else if(key == '↑'){
			value = 'UP';
		} else if(key == '↓'){
			value = 'DOWN';
		} else {
			value = key;
		}
		return value;
	};
	
	
	dialog.getArrowXML = function() {
		var xml = document.createElement("trans");
		$(xml).attr({
			guard : "key",
			key : correspondentKey(selectBox.value),
			from : toolbar.arrow.fromState.getId(),
			to : toolbar.arrow.toState.getId()
		});
		return xml;
	};

	var selectBox = new SelectBox({
		name : 'selectbox',
		left : simpleText.getX() + simpleText.getWidth(),
		top : simpleText.getY() - 9,
		optionList : {
			left : "←",
			right : "→",
			up : "↑",
			down : "↓",
			enter : "ENTER",
			space : "SPACE",
			a : "a",
			b : "b",
			c : "c",
			d : "d",
			e : "e",
			f : "f",
			g : "g",
			h : "h",
			i : "i",
			j : "j",
			k : "k",
			l : "l",
			m : "m",
			n : "n",
			o : "o",
			p : "p",
			q : "q",
			r : "r",
			s : "s",
			t : "t",
			u : "u",
			v : "v",
			w : "w",
			x : "x",
			y : "y",
			z : "z",
			one : "1",
			two : "2",
			three : "3",
			four : "4",
			five : "5",
			six : "6",
			seven : "7",
			eight : "8",
			nine : "9",
			zero : "0",
		},
		value : dialog.getAttributeString("key", "key", "←"),
	});
	selectBox.onchange = function() {
		//console.log(selectBox.value);
	};

	toolbar.layer.draw();

	return dialog;
};

var DialogArrowToolbarMouse = function(toolbar) {
	var dialog = new DialogSmallToolbarArrow({
		x : toolbar.getX() + toolbar.rect.getWidth() / 2 - w / 2,
		y : toolbar.getY() - h - 10,
		width : w,
		height : h,
		layer : toolbar.layer,
		toolbar : toolbar,
	});
	var SelectBox = dialog.SelectBox;

	var simpleText = new Kinetic.Text({
		x : 15,
		y : 10,
		fontFamily : 'sans-serif',
		fill : 'black',
		fontStyle : 'normal',
		fontSize : 14,
		text : "ボタン",
	});
	dialog.add(simpleText);

	dialog.getArrowXML = function() {
		var xml = document.createElement("trans");
		$(xml).attr({
			guard : "click",
			button : selectBox.value,
			from : toolbar.arrow.fromState.getId(),
			to : toolbar.arrow.toState.getId()
		});
		return xml;
	};

	var selectBox = new SelectBox({
		name : 'selectbox',
		left : simpleText.getX() + simpleText.getWidth(),
		top : simpleText.getY() - 9,
		optionList : {
			left : "左クリック",
		},
		value : dialog.getAttributeString("click", "button", "左クリック"),
	});
	selectBox.onchange = function() {
		//console.log(selectBox.value);
	};

	toolbar.layer.draw();

	return dialog;
};

var DialogArrowToolbarCollide = function(toolbar) {
	var dialog = new DialogSmallToolbarArrow({
		x : toolbar.getX() + toolbar.rect.getWidth() / 2 - w / 2,
		y : toolbar.getY() - h - 10,
		width : w,
		height : h,
		layer : toolbar.layer,
		toolbar : toolbar,
	});
	var SelectBox = dialog.SelectBox;
	var inputDivParent = dialog.inputDivParent;

	var simpleText = new Kinetic.Text({
		x : 15,
		y : 10,
		fontFamily : 'sans-serif',
		fill : 'black',
		fontStyle : 'normal',
		fontSize : 14,
		text : "何を衝突: ",
	});
	dialog.add(simpleText);

	dialog.getArrowXML = function() {
		var xml = document.createElement("trans");
		$(xml).attr({
			guard : "bump",
			bump : getBumpXML(),
			from : toolbar.arrow.fromState.getId(),
			to : toolbar.arrow.toState.getId()
		});
		return xml;
	};

	var WALLLIST = new Object();
	WALLLIST["all"] = "@anywall";
	WALLLIST["east wall"] = "@eastwall";
	WALLLIST["south wall"] = "@southwall";
	WALLLIST["west wall"] = "@westwall";
	WALLLIST["north wall"] = "@northwall";
	WALLLIST["ceiling"] = "@roofwall";
	WALLLIST["floor"] = "@floorwall";

	var CHARACTERLIST = new Object();
	CHARACTERLIST["all"] = "@anychara";
	CHARACTERLIST["robot"] = "robot";
	CHARACTERLIST["car"] = "car";
	CHARACTERLIST["car2"] = "car2";

	var getBumpXML = function() {
		var bump;
		if (document.getElementById("selectBoxCollideWall") != undefined) {
			var selBox = document.getElementById("selectBoxCollideWall");
			bump = WALLLIST[selBox.value];
		} else if (document.getElementById("selectBoxCollideCharacter") != undefined) {
			var selBox = document.getElementById("selectBoxCollideCharacter");
			bump = CHARACTERLIST[selBox.value];
		} else {
			bump = "@any";
		}
		return bump;
	};

	var selectBox = new SelectBox({
		name : 'selectbox',
		left : simpleText.getX() + simpleText.getWidth(),
		top : simpleText.getY() - 9,
		optionList : {
			all : "all",
			wall : "wall",
			character : "character"
		},
		value : ( function() {
				var xml = dialog.getAttributeString("bump", "bump", "all");
				for (var key in WALLLIST) {
					if (WALLLIST[key] == xml) {
						return "wall";
					}
				}
				for (var key in CHARACTERLIST) {
					if (CHARACTERLIST[key] == xml) {
						return "character";
					}
				}
				return "all";
			}()),
	});
	selectBox.onchange = function() {
		if (document.getElementById("selectBoxCollideCharacter") != undefined) {
			inputDivParent.removeChild(document.getElementById("selectBoxCollideCharacter"));
		} else if (document.getElementById("selectBoxCollideWall") != undefined) {
			inputDivParent.removeChild(document.getElementById("selectBoxCollideWall"));
		}
		if (selectBox.value == "wall") {
			var selectBoxWall = new SelectBox({
				name : 'selectbox',
				left : simpleText.getX() + simpleText.getWidth(),
				top : simpleText.getY() + 20,
				optionList : {
					wallall : "all",
					wall1 : "east wall",
					wall2 : "south wall",
					wall3 : "west wall",
					wall4 : "north wall",
					wall5 : "ceiling",
					wall6 : "floor"
				},
				value : ( function() {
						var xml = dialog.getAttributeString("bump", "bump", "all");
						for (var key in WALLLIST) {
							if (WALLLIST[key] == xml) {
								return key;
							}
						}
					}()),
			});
			selectBoxWall.setAttribute("id", "selectBoxCollideWall");
			selectBoxWall.onchange = function() {
				console.log(selectBoxWall.value);
			};
		} else if (selectBox.value == "character") {
			var selectBoxChar = new SelectBox({
				name : 'selectbox',
				left : simpleText.getX() + simpleText.getWidth(),
				top : simpleText.getY() + 20,
				optionList : {
					charall : "all",
					char1 : "robot",
					char2 : "car",
					char3 : "car2"
				},
				value : ( function() {
						var xml = dialog.getAttributeString("bump", "bump", "all");
						for (var key in CHARACTERLIST) {
							if (CHARACTERLIST[key] == xml) {
								return key;
							}
						}
					}()),
			});
			selectBoxChar.setAttribute("id", "selectBoxCollideCharacter");
			selectBoxChar.onchange = function() {
				console.log(selectBoxChar.value);
			};
		}
	};
	selectBox.onchange();
	toolbar.layer.draw();

	return dialog;
};

var DialogArrowToolbarMessage = function(toolbar) {
	var dialog = new DialogSmallToolbarArrow({
		x : toolbar.getX() + toolbar.rect.getWidth() / 2 - w / 2,
		y : toolbar.getY() - h - 10,
		width : w,
		height : h,
		layer : toolbar.layer,
		toolbar : toolbar,
	});
	var SelectBox = dialog.SelectBox;

	var simpleText = new Kinetic.Text({
		x : 15,
		y : 10,
		fontFamily : 'sans-serif',
		fill : 'black',
		fontStyle : 'normal',
		fontSize : 9,
		text : "おしらせ",
	});
	dialog.add(simpleText);

	dialog.getArrowXML = function() {
		var xml = document.createElement("trans");
		$(xml).attr({
			guard : "event",
			type : selectBox.value,
			from : toolbar.arrow.fromState.getId(),
			to : toolbar.arrow.toState.getId()
		});
		return xml;
	};

	var optionList = {
		message1 : "いまだ！",
		message2 : "気をつけて!",
		message3 : "まだだよ",
		message4 : "はじまるよ",
		message5 : "着いたよ",
		message6 : "花が咲いたよ",
		message7 : "晴れてきたよ",
		message8 : "雨がふってきたよ",
		message9 : "雪がふってきたよ",
		message10 : "ボスが来たよ!",
	};
	for (var m in customMessages) {
		optionList[m] = customMessages[m];
	}

	var selectBox = new SelectBox({
		name : 'selectbox',
		left : simpleText.getX() + simpleText.getWidth(),
		top : simpleText.getY() - 9,
		optionList : optionList,
		value : dialog.getAttributeString("event", "type", "いまだ！"),
	});

	selectBox.onchange = function() {
		//console.log(selectBox.value);
	};

	toolbar.layer.draw();

	return dialog;
};

var DialogArrowToolbarPercent = function(toolbar) {
	var dialog = new DialogSmallToolbarArrow({
		x : toolbar.getX() + toolbar.rect.getWidth() / 2 - w / 2,
		y : toolbar.getY() - h - 10,
		width : w,
		height : h,
		layer : toolbar.layer,
		toolbar : toolbar,
	});
	var InputPosition = dialog.InputPosition;

	var simpleText = new Kinetic.Text({
		x : 15,
		y : 20,
		text : "確率:",
		fontFamily : 'sans-serif',
		fill : 'black',
		fontStyle : 'normal',
		fontSize : 14,
	});
	dialog.add(simpleText);

	dialog.getArrowXML = function() {
		var xml = document.createElement("trans");
		$(xml).attr({
			guard : "prob",
			prob : $(input).spinner("value"),
			from : toolbar.arrow.fromState.getId(),
			to : toolbar.arrow.toState.getId()
		});
		return xml;
	};

	var input = new InputPosition("percentage", simpleText.getX() + simpleText.getWidth(), simpleText.getY() - 16, dialog.getAttributeValue("prob", "prob"));
	$(input).spinner("option", "min", 0);
	$(input).spinner("option", "max", 100);
	$(input).spinner("option", "step", 5);
	toolbar.layer.draw();

	return dialog;
};

var DialogArrowToolbarRepeat = function(toolbar) {
	var dialog = new DialogSmallToolbarArrow({
		x : toolbar.getX() + toolbar.rect.getWidth() / 2 - w / 2,
		y : toolbar.getY() - h - 10,
		width : w,
		height : h,
		layer : toolbar.layer,
		toolbar : toolbar,
	});
	var InputPosition = dialog.InputPosition;

	var simpleText = new Kinetic.Text({
		x : 15,
		y : 20,
		text : "繰り返す回数:",
		fontFamily : 'sans-serif',
		fill : 'black',
		fontStyle : 'normal',
		fontSize : 14,
	});
	dialog.add(simpleText);

	dialog.getArrowXML = function() {
		var xml = document.createElement("trans");
		$(xml).attr({
			guard : "timeout",
			count : $(input).spinner("value"),
			from : toolbar.arrow.fromState.getId(),
			to : toolbar.arrow.toState.getId()
		});
		return xml;
	};

	var input = new InputPosition("repeat", simpleText.getX() + simpleText.getWidth(), simpleText.getY() - 16, dialog.getAttributeValue("timeout", "count"));
	$(input).spinner("option", "min", 0);
	toolbar.layer.draw();

	return dialog;
};
