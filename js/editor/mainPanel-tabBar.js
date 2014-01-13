var drawTabBar = function(name, noTab) {
	var tabTemplate = "<li><a href='#{href}'>#{label}</a></li>";
	var tabDiv = document.createElement("div");
	tabDiv.counter = 2;
	document.body.appendChild(tabDiv);
	$(tabDiv).attr("id", "tabDiv-" + name);
	$(tabDiv).css({
		width : measurementRectDiagramEditor.width - 9 - 120,
		height : 45,
		//background: "black",
		position : "absolute",
		top : measurementRectDiagramEditor.y,
		left : measurementRectDiagramEditor.x + 4,
		border : "none"
	});

	var ul = document.createElement("ul");
	tabDiv.appendChild(ul);
	
	if(noTab == undefined) {
		ul.innerHTML += '<li><a href="#tabs-1">図1</a></li>';
		tabDiv.innerHTML += '<div id="tabs-1"></div>';
	}
	$(tabDiv).tabs({
		activate : function(event, ui) {
		}
	});
	var tabs = $(tabDiv).tabs();

	$(tabDiv).on("tabsactivate", function(event, ui) {
		if (stage.selectedPanel.array[ui.oldTab.index()] != undefined) {
			stage.selectedPanel.array[ui.oldTab.index()].hide();
		}
		stage.selectedPanel.array[ui.newTab.index()].show();
		stage.selectedPanel.selectedDiagram = stage.selectedPanel.array[ui.newTab.index()];
		stage.selectedPanel.selectedDiagram.draw();
		stage.drawingToolbar.getParent().moveToTop();
	});

	var returnLabelName = function(diagram, label) {
		var charPanel = stage.selectedPanel;
		if (charPanel.diagLabels.containsKey(label) == false) {
			charPanel.diagLabels.put(label, 0);
			return label;
		} else {
			if (diagram.oriLabel != undefined) {
				label = diagram.oriLabel;
			}
			var count = charPanel.diagLabels.get(label);
			charPanel.diagLabels.put(label, ++count);
			var newLabel = label + " (" + count + ")";
			diagram.oriLabel = label;
			return newLabel;
		}
	};

	var stageTabBar = new Kinetic.Stage({
		container : 'divStageTabBar',
		width : $(tabDiv).width() + 120 + 7,
		height : $(tabDiv).height()
	});

	var divStageTabBar = document.getElementById('divStageTabBar');
	$(divStageTabBar).offset({
		top : $(tabDiv).offset().top,
		left : $(tabDiv).offset().left
	});
	var layer = new Kinetic.Layer();
	var toolbar = new Kinetic.Group({
		id : "toolbarTab"
	});
	var rectBackground = new Kinetic.Rect({
		width : $(tabDiv).width() + 120 + 7,
		height : $(tabDiv).height(),
		cornerRadius : 4,
		fill : 'white'
	});
	toolbar.add(rectBackground);

	var space = 24 + 4;
	addIcon({
		x : $(tabDiv).width() + 8 + space * 0,
		y : 5,
		iconSize : 24,
		source : 'img/tabBar/plus.png',
		layer : toolbar,
		id : 'buttonCreateTab',
		name : 'button',
		onClick : function() {
			var counter = stage.selectedPanel.tabDiv.counter;
			var tabs = $(stage.selectedPanel.tabDiv).tabs();
			var label = "図" + counter;
			var id = "tabs-" + counter;
			var li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label));

			var panel = stage.selectedPanel;
			panel.diagrams[id] = new DiagramLayer(id);
			var newLabel = returnLabelName(panel.diagrams[id], label);
			panel.diagrams[id].label = newLabel;
			panel.array.push(panel.diagrams[id]);

			stage.selectedPanel.tabDiv.counter++;
			tabs.find(".ui-tabs-nav").append(li);
			tabs.append("<div id='" + id + "'></div>");
			tabs.tabs("refresh");
			tabs.tabs("option", "active", panel.array.length - 1);
		}
	});

	addIcon({
		x : $(tabDiv).width() + 8 + space * 1,
		y : 5,
		iconSize : 24,
		source : 'img/tabBar/delete.png',
		layer : toolbar,
		id : 'buttonEditTab',
		name : 'button',
		onClick : function() {
			if (confirm('本当に\"' + stage.selectedPanel.selectedDiagram.label + "\"を削除する？")) {
				var tabs = $(stage.selectedPanel.tabDiv).tabs();
				var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
				$("#" + panelId).remove();
				var array = stage.selectedPanel.array;
				for (var i = 0; i < array.length; i++) {
					if (array[i].getId() == panelId) {
						delete stage.selectedPanel.diagrams[array[i].getId()];
						array[i].destroy();
						array.splice(i, 1);
						break;
					}
				}
				tabs.tabs("refresh");
			}
		}
	});

	addIcon({
		x : $(tabDiv).width() + 8 + space * 2,
		y : 5,
		iconSize : 24,
		source : 'img/tabBar/edit1.png',
		layer : toolbar,
		id : 'buttonEditTab',
		name : 'button',
		onClick : function() {
			var tabs = $(stage.selectedPanel.tabDiv).tabs();
			var index = tabs.tabs("option", "active");
			var dialog = new DialogRenameDiagram(index);
		}
	});

	addIcon({
		x : $(tabDiv).width() + 8 + space * 3,
		y : 5,
		iconSize : 24,
		source : 'img/tabBar/copy1.png',
		layer : toolbar,
		id : 'buttonEditTab',
		name : 'button',
		onClick : function() {
			var tabs = $(stage.selectedPanel.tabDiv).tabs();
			var dialog = new DialogDuplicateCharacter(tabs);
		}
	});

	layer.add(toolbar);
	stageTabBar.add(layer);

	return tabDiv;
};

