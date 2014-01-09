var readdir = function(config) {
	$.ajax({
		type : "POST",
		url : "php/readdir.php",
		data : {
			path : "../" + config.path
		},
		complete : function(r) {
			
			var fileList = r.responseText.split(",");
			if (config.mime == undefined) {
				config.callback(fileList);
			} else {
				var mimeList = new Array();
				for (var i = 0; i < fileList.length; i++) {
					if (fileList[i].match(config.mime) != null) {
						mimeList.push(fileList[i]);
					}
				}
				config.callback(mimeList);
			}
		}
	});
	

};

var sign = function(number){
	return number && number / Math.abs(number);
};

