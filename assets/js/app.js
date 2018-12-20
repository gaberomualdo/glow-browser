var allTabs = ["homepage.html"];

$(function(){
	updateEvents();
});

$(document).on("resize",function(e){
	updateTabWidth();
});

function checkForwardBackwardBtns(){
	if(!$("#web webview.activeWeb")[0].canGoForward()){
		$("#topbar button.forward").addClass("disabled");
	}else{
		$("#topbar button.forward").removeClass("disabled");
	}
	if(!$("#web webview.activeWeb")[0].canGoBack()){
		$("#topbar button.back").addClass("disabled");
	}else{
		$("#topbar button.back").removeClass("disabled");
	}
}

function updateTabWidth(){
	let remSize = getComputedStyle(document.documentElement).fontSize;
	remSize = remSize.split("px").join("");
	if((window.innerWidth - ((remSize * 17.75) * allTabs.length + (remSize * 3))) < 0){
		h1Width = window.innerWidth - (remSize * 3);
		h1Width = h1Width / allTabs.length;
		h1Width = h1Width - (remSize * 6.25);
		if(h1Width > 0){
			$("#h1WidthStyle").html("#tabs div h1 { width: " + h1Width + "px }");
		}
	}else{
		$("#h1WidthStyle").html("");
	}
}

function addTab(url){
	allTabs.push(url);
	$("#tabs div.activeTab").removeClass("activeTab");
	$('<div class="activeTab"><img src="assets/img/loader.gif" onerror="this.setAttribute(\"src\",\"favicon.png\")"><h1>New Tab</h1><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg></span></div>').insertAfter($("#tabs div:eq(" + (allTabs.length-2) +")"));

	$("#web webview.activeWeb").removeClass("activeWeb");
	$("<webview class='activeWeb' src='" + url + "'></webview>").insertAfter($("#web webview:eq(" + (allTabs.length-2) +")"));

	$("#topbar input.activeInput").removeClass("activeInput");
	$('<input class="activeInput" type="text" placeholder="Type URL or Search Google...">').insertAfter($("#topbar input:eq(" + (allTabs.length-2) +")"));

	if(url == "homepage.html"){
		$("#topbar input.activeInput").focus();
	}

	updateEvents();
	updateTabWidth();
}
function removeTab(index){
	allTabs.splice(index,1);
	$("#tabs div:eq(" + index +")").remove();
	$("#web webview:eq(" + index +")").remove();
	$("#topbar input:eq(" + index + ")").remove();

	if(allTabs.length==0){
		remote.getCurrentWindow().close();
	}
	if($("#tabs div.activeTab").length == 0){
		if(index == 0){
			$("#web webview:eq(" + (index) + ")").addClass("activeWeb");
			$("#tabs div:eq(" + (index) + ")").addClass("activeTab");
			$("#topbar input:eq(" + (index) + ")").addClass("activeInput");
		}else{
			$("#web webview:eq(" + (index-1) + ")").addClass("activeWeb");
			$("#tabs div:eq(" + (index-1) + ")").addClass("activeTab");
			$("#topbar input:eq(" + (index-1) + ")").addClass("activeInput");
		}
	}

	updateTabWidth();
}
function updateEvents(){
	$('#tabs div span').off('click');
	$("#tabs div span").on("click",function(){
		var index = $("#tabs div").index($(this).parent());
		removeTab(index);
	});

	$("#tabs div").off("click");
	$("#tabs div").on("click",function(e){
		$("#tabs div.activeTab").removeClass("activeTab");
		$(this).addClass("activeTab");

		var index = $("#tabs div").index($(this));

		$("#web webview.activeWeb").removeClass("activeWeb");
		$("#web webview:eq(" + index + ")").addClass("activeWeb");

		$("#topbar input.activeInput").removeClass("activeInput");
		$("#topbar input:eq(" + index + ")").addClass("activeInput");
		checkForwardBackwardBtns();
	});

	$("#topbar input").off("keydown");
	$("#topbar input").on("keydown",function(e){
		var searchEngines = [
			"@twitter",
			"@google",
			"@bing",
			"@github",
			"@yahoo",
			"@wikipedia",
			"@duckduckgo",
			"@wikihow",
			"@amazon",
			"@steam",
			"@guardian",
			"@nytimes",
			"@cnn"
		];
		var searchEngineStart = [
			"http://twitter.com/search?q=",
			"http://google.com/search?q=",
			"http://www.bing.com/search?q=",
			"http://github.com/search?q=",
			"http://search.yahoo.com/search?q=",
			"http://en.wikipedia.org/w/index.php?search=",
			"http://duckduckgo.com/?q=",
			"https://www.wikihow.com/wikiHowTo?search=",
			"https://www.amazon.com/s/?field-keywords=",
			"http://store.steampowered.com/search/?term=",
			"https://www.google.co.uk/search?as_sitesearch=www.theguardian.com&q=",
			"https://www.nytimes.com/search/",
			"https://edition.cnn.com/search/?q="
		];

		if(e.keyCode == 13){
			var url = $(this).val();
			$(this).blur();

			if(url.indexOf(" ") != -1 || url.indexOf(".") == -1){
				var searchEngine = searchEngines.indexOf(url.split(" ")[0]);
				if(searchEngine != -1){
					url = url.split(" ");
					url[0] = "";
					url = url.join(" ");
					url = url.substring(1);
					url = searchEngineStart[searchEngine] + url;
				}else{
					url = "https://google.com/search?q=" + url;
				}
			}
			if(!url.startsWith("http://") && !url.startsWith("file://") && !url.startsWith("https://")){
				url = "https://" + url;
			}

			var fakeA = document.createElement("a");
			fakeA.href = url;

			var index = $("#tabs div").index($("#tabs div.activeTab"));

			$("#web webview:eq(" + index + ")")[0].loadURL(url);
			$("#web webview:eq(" + index + ")")[0].focus();
		}
	});

	$("#web webview.activeWeb")[0].addEventListener("page-title-updated",(e) => {
		var index = $("#web webview").index($(this));
		$("#tabs div h1:eq(" + index + ")").text(e.title);
	});

	$("#web webview").off("did-start-loading");
	$("#web webview").on("did-start-loading",function(){
		var index = $("#web webview").index($(this));
		$("#tabs div img:eq(" + index + ")").attr("src","assets/img/loader.gif");
	});

	$("#web webview").off("did-stop-loading");
	$("#web webview").on("did-stop-loading",function(){
		$(this).blur();
		var index = $("#web webview").index($(this));
		if(!$("#topbar input:eq(" + index + ")").is(":focus")){
			if($(this).attr("src").endsWith("homepage.html")){
				$("#topbar input:eq(" + index + ")").val("");
			}else{
				$("#topbar input:eq(" + index + ")").val($(this).attr("src"));
			}
		}
		if($(this).attr("src").endsWith("homepage.html")){
			$("#tabs div img:eq(" + index + ")").attr("src", "assets/img/icon_no_border.png");
		}else{
			$("#tabs div img:eq(" + index + ")").attr("src", "https://www.google.com/s2/favicons?domain=" + $(this).attr("src").split("?")[0]);
		}
		checkForwardBackwardBtns();
	});

	$("#web webview.activeWeb")[0].addEventListener("new-window",(e) => {
		addTab(e.url);
	});

	$("#topbar input").off("focus");
	$("#topbar input").on("focus",function(){
		$(this)[0].select();
	});
}

$("#tabs button.addTab").on("click",function(){
	addTab("homepage.html");
});

$("#topbar button.back").on("click",function(){
	$("#web webview.activeWeb")[0].goBack();
});
$("#topbar button.forward").on("click",function(){
	$("#web webview.activeWeb")[0].goForward();
});
$("#topbar button.reload").on("click",function(){
	$("#web webview.activeWeb")[0].reload();
});
