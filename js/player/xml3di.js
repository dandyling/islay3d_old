var player;

function loadXMLDoc(dname){
	if (window.XMLHttpRequest) {
	    xhttp=new XMLHttpRequest();
	}
	else {
	  	xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET", dname, false);
	xhttp.send();
	return xhttp;
}


/* this function get the xml3di file using ajax*/
function Xml3di(filename) {
	$.ajax({
        type: "GET",
        url: filename,
        cache: false,
        async: false,
        dataType: "xml",
        success: function(xml3di) {
        	player.XML3DI = $(xml3di).find("islay3d")[0];
			player.data = new Hash(xml3di.getElementsByTagName("data"), "name");
			
			player.XML3DI.print = function(){
			    this.printChild(player.XML3DI.getElementsByTagName("islay3d")[0]);
			};
			
			var count = 1;
			player.XML3DI.printChild = function(tag){
			    for(var i=1; i<tag.childNodes.length; i+=2) {    
			        console.log("(" + count++ + ") ");
			        console.log(tag.childNodes[i].tagName + " ");
			        if(tag.childNodes[i].attributes[0] != null) {
			            for(var j=0; j<tag.childNodes[i].attributes.length; j++) {
			                console.log(tag.childNodes[i].attributes[j].value + " ");
			            }
			            console.log("<br>");
			        }
			        else {
			            console.log("# <br>");
			        }
			        this.printChild(tag.childNodes[i]);   
			    }
			};
			
			loadGame(xml3di);
        }
    });
}		

function loadGame(xml3di){
	// the code starting from here is for opening file
	var characters = xml3di.getElementsByTagName("character");
	var data = player.data;
	for (var i = 0; i < characters.length; i++) {
		loadCharacter(characters[i], data);
	}
	setTimeout(function(){
		stage.get('#rectPanel')[0].fire('click');
		setTimeout(function(){
			stage.drawingToolbar.get('#buttonOval')[0].fire('click');
		}, 1000);
	}, 1000);
}

function loadCharacter(characterXML, data){
	var charName = characterXML.attributes["name"].value;
	var charParts = characterXML.attributes["parts"].value;
	var modelPath = data[charParts].attributes["path"].value;
	var thumbnailPath = modelPath.replace("dae", "png");
	addCharacterPanel({
		name : charName,
		pathImage : thumbnailPath,
		pathModel : modelPath,
		noTab : true
	});
	
	var charPanel = characterPanels[characterPanels.length - 1];
						
	var statediagrams = characterXML.getElementsByTagName("statediagram");
	for (var j = 0; j < statediagrams.length; j++) {
		loadStateDiagram(charPanel, statediagrams[j]);
	}
	charPanel.selectedDiagram = charPanel.array[0];
	charPanel.selectedDiagram.show();
};

function loadStateDiagram(charPanel, statediagramXML){
	var tabTemplate = "<li><a href='#{href}'>#{label}</a></li>";
	
	var name = statediagramXML.attributes["name"].value;
	var counter = charPanel.tabDiv.counter;
	var tabs = $(charPanel.tabDiv).tabs();
	var label = name;
	var id = "tabs-" + counter;
	var li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));

	charPanel.diagrams[id] = new DiagramLayer(id);
	charPanel.diagrams[id].label = label;
	charPanel.array.push(charPanel.diagrams[id]);

	charPanel.tabDiv.counter++;
	tabs.find(".ui-tabs-nav").append(li);
	tabs.append("<div id='" + id + "'></div>");
	tabs.tabs("refresh");
	
	charPanel.diagrams[id].drawDiagram(statediagramXML);
	charPanel.diagrams[id].hide();
}

function convertToXML(element){
	var s = new XMLSerializer();
	var str = s.serializeToString(element);
	str = str.replace(/><\/state>/g, "/>");
	str = str.replace(/><\/trans>/g, "/>");
	str = str.replace(/></g, ">\n<");
	return str;
}

