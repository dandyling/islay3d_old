var oldLogin = function() {
	var old;
	stage.data = JSON.parse(localStorage.data);
	var storageDate = parseInt(stage.data.timestamp.substr(8, 2));
	var currentDate = new Date().getDate();
	if (currentDate - storageDate > 1 || currentDate - storageDate < 0) {
		old = true;
	} else {
		old = false;
	}
	return old;
};

var setUserName = function(username) {
	var text = stage.get('#labelUserName')[0];
	text.setText(username);
	text.setOffsetX(text.getWidth());
	text.getParent().draw();
	if (localStorage.data != undefined) {
		stage.data = JSON.parse(localStorage.data);
		stage.pid = stage.data.auth.provider + stage.data.auth.uid;
		$.ajax({
			type : "POST",
			url : "php/session.php",
			data : {
				key : 'pid',
				value : stage.pid,
			}
		});
	}
};

var login = function(username) {
	setUserName(username);
	stage.get('#buttonLogin')[0].hide();
	stage.get('#buttonLogout')[0].show();
	stage.get('#buttonLogin')[0].getParent().draw();
};

var logout = function() {
	setUserName("");
	stage.get('#buttonLogout')[0].hide();
	stage.get('#buttonLogin')[0].show();
	stage.get('#buttonLogin')[0].getParent().draw();
};

var addUserName = function() {
	var layer = new Kinetic.Layer();
	var text = new Kinetic.Text({
		id : 'labelUserName',
		x : window.innerWidth - m - iconSize - m - 60,
		y : 5,
		fontFamily : 'Calibri',
		fontSize : 14,
		padding : 20,
		fontStyle : 'bold',
		fill : 'black',
		shadowOffset : 1,
		shadowColor : 'black',
		text : ""
	});
	text.setOffsetX(text.getWidth());
	layer.add(text);
	stage.add(layer);

	var username = "";
	if (localStorage.data != undefined) {
		stage.data = JSON.parse(localStorage.data);
		stage.pid = stage.data.auth.provider + stage.data.auth.uid;
		console.log(stage.pid);
		var storageDate = parseInt(stage.data.timestamp.substr(8, 2));
		var currentDate = new Date().getDate();
		if (oldLogin()) {
			console.log("Login information is older than 1 day..  logging out");
			localStorage.clear();
			setUserName("");
		} else {
			setUserName(stage.data.auth.info.name);
		}
	}

};
addUserName();

var onStorageChanged = function(event) {
	if (localStorage.data != undefined) {
		stage.data = JSON.parse(localStorage.data);
		login(stage.data.auth.info.name);
	}
};
window.addEventListener("storage", onStorageChanged, false);
