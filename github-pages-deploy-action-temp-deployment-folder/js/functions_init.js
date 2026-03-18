function init(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	// Settings ajax
	$.ajaxSetup({beforeSend: function(xhr){
	 		if (xhr.overrideMimeType){
				xhr.overrideMimeType("application/json");
	  		}
		}
	});

	$(canvas).mouseup(mouseup);
	$(canvas).mousedown(mousedown);
	$(canvas).mousemove(mousemove);
	$(document).mouseup(mouseupondocument);

	// Remove the context menu when the user clicks with right button
	$(canvas).bind("contextmenu",function(e){
        return false;
	});

	//Resize window when open page
	$("#canvas-scroll").height($(window).height()-85);	

	$( window ).resize(function() {
		// Resize canvas when window is resized		
  		$("#canvas-scroll").height($(this).height()-85);
	});
}

function mouseupondocument(){
	isPressed = false;
}

function resizeCanvasScroll(paddingBottom){
	$("#canvas-scroll").height($(window).height()-paddingBottom);	

	$( window ).resize(function() {
		// Resize canvas when window is resized		
  		$("#canvas-scroll").height($(this).height()-paddingBottom);
	});
}
