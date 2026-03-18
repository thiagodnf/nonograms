var scrollTop = 0;
var scrollLeft = 0;

var scale = 1;

var operation = 0;

function resizeCanvas() {
	ctx.canvas.width = scale*dim*columns + 1;
	ctx.canvas.height = scale*dim*lines + 1;
}

function drawCell(i, j, color){
	fillSquare(j*dim+1, i*dim+1, dim-1, dim-1, color);
}

function setBlackCell(i, j){
	grid[i][j] = 1;
	drawCell(i, j, "#424242");
}

function removeBlackCell(i, j){
	grid[i][j] = 0;
	drawCell(i, j, "white");
}

function drawCanvas(clearCanvas){
	resizeCanvas();

	ctx.translate(0,0);
	ctx.scale(scale, scale);
	ctx.translate(0,0);
	
	// Draw black square
	for (var i = 0; i < lines; i++) {
		for (var j = 0; j < columns; j++) {
			if(grid[i][j] == 1){
				fillSquare(j*dim, i*dim, dim, dim, "#424242");
			}
		}
	}

	//Draw Vertical Lines
	for(var i=0; i <= columns; i++){
		drawLine(dim*i, 0, i*dim, lines*dim, 1, "black");
	}

	//Draw Horizontal Lines
	for(var i=0; i <= lines; i++){
		drawLine(0, i*dim, columns*dim, i*dim, 1, "black");
	}
}

function mousemove(e){
	var mousePosition = getMousePosition(e);

	j = Math.floor((mousePosition.x/scale)/dim);
	i = Math.floor((mousePosition.y/scale)/dim);

	if(isPressed){
		if(operation == 0){
			setBlackCell(i, j);
		}else if(operation == 1){
			removeBlackCell(i, j);
		}
	}
}

function mouseup(event){
	isPressed = false;
	
	if(operation == 0){
		setBlackCell(i, j);
	}else if(operation == 1){
		removeBlackCell(i, j);
	}
}

function mousedown(event){
	isPressed = true;
}

$( document ).ready(function() {
	init();

	$.validate({
		scrollToTopOnError : false,
		onSuccess : function() {
			lines = $("#lines").val();
			columns = $("#columns").val();
			grid = createMatrix(columns, lines);
			drawCanvas();
      		return false; // Will stop the submission of the form 
    	}
	});

	$("#slider-zoom").slider({
		min: 0.05, 
		max: 1, 
		value: 1,	
		step: 0.05
	}).on('slide', function(event){
		scale = event.value;
		drawCanvas();
	});
	
	//Resize window when open page
	resizeCanvasScroll(140);
 
	$("#button-export-to-json").click(function(){
		var content = JSON.stringify(convertToJSON(grid, lines, columns));
		saveTextAsFile(content,"application/json",lines+"x"+columns+"x1.json");	
	});

	$("#button-export-to-png").click(function(){
		var dataURL = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");;
		$(this).attr("href",dataURL);
	});

	$("#button-add").click(function(){
		operation = 0;
		$(".toolbar-creative-mode").removeClass("active");
		$(this).addClass("active");
	});

	$("#button-remove").click(function(){
		operation = 1;
		$(".toolbar-creative-mode").removeClass("active");
		$(this).addClass("active");
	});
	
	$("#canvas-scroll").scroll(function (event) {
		scrollTop = $(this).scrollTop();
		scrollLeft = $(this).scrollLeft();
	});	
});
