var EMPTY = 0;
var BLACK_SQUARE = 1;
var X = 2;
var ERROR = 3;

var mouseX = 0;
var mouseY = 0;

var offsetX = 50;
var offsetY = 50;

var scrollTop = 0;
var scrollLeft = 0;

var solution = null;
var informations = null;

var maxErrors = 5;
var countErrors = 0;

var lines = 0;
var columns = 0;

function drawSelection(x,y){
	var color = "rgba(115, 159, 208, 0.2)";
	fillSquare(offsetX+x*dim,0,dim,offsetY+(y+1)*dim,color);
	fillSquare(0,offsetY+y*dim,offsetX+(x+1)*dim,dim,color);	
}

function resizeCanvas() {
	ctx.canvas.width = offsetX+dim*columns+1;
	ctx.canvas.height = offsetY+dim*lines+1;
}

function drawInformationGrid(){
	// Draw Background
	fillSquare(0,0,offsetX+scrollLeft,offsetY+lines*dim,"#eeeeee");
	fillSquare(0,0,offsetX+columns*dim,offsetY+scrollTop,"#eeeeee");

	//Draw Border
	drawLine(0,offsetY+scrollTop,offsetX+columns*dim+scrollLeft,offsetY+scrollTop,"black");
	drawLine(offsetX+scrollLeft,0,offsetX+scrollLeft,offsetY+lines*dim,"black");
	
	for(var i=0; i < lines; i++){
		drawLine(0,offsetY+i*dim,offsetX+scrollLeft,offsetY+i*dim,"black");
	}

	for(var i=0; i < columns; i++){
		drawLine(offsetX+i*dim,0,offsetX+i*dim,offsetY+scrollTop,"black");
	}

	for (var i = 0; i < lines; i++) {
		drawText(5+scrollLeft,offsetY+i*dim+17,informations.lines[i],"blue");
	}

	for (var i = 0; i < columns; i++) {
		var array = informations.columns[i];
		for (var j = 0; j < array.length; j++) {
			//Centralize the numbers
			var font = 10;
			var digit = array[j].toString().length;
			var x = offsetX+i*dim+((dim-digit*font)/2);
			drawText(x,scrollTop+13+j*13,array[j],"blue");
		}
	}

	//Draw the square in the top left
	fillSquare(0,0,offsetX+scrollLeft,offsetY+scrollTop,"#eeeeee");
}

function drawGrid(){
	resizeCanvas();

	// Clear all grid
	ctx.clearRect(0, 0, offsetX+columns*dim, offsetY+lines*dim);
	
	// Draw grid
	for (var i = 0; i < lines; i++) {
		for (var j = 0; j < columns; j++) {
			if(grid[i][j] == X){
				drawSquare(i, j, "X", "white", "blue");
			}else if(grid[i][j] == BLACK_SQUARE){
				drawSquare(i, j, "X", "#424242", "#424242");
			}else if(grid[i][j] == ERROR){
				drawSquare(i, j, "X", "rgb(253, 228, 225)", "rgb(177, 0, 9)");
			}
		}
	}

	//Draw Vertical Lines
	for(var i=1; i <= columns; i++){
		drawLine(offsetX+i*dim,0,offsetX+i*dim,offsetY+lines*dim,1,"black");
	}
	
	//Draw Horizontal Lines
	for(var i=1; i <= lines; i++){
		drawLine(0,offsetY+i*dim,offsetX+columns*dim,offsetY+i*dim,1,"black");
	}

	drawInformationGrid();
}

function mousemove(e){
	var mousePosition = getMousePosition(e);
	mouseX = mousePosition.x;
	mouseY = mousePosition.y;
}

function mouseup(event){
	drawGrid();

	if(theUserFoundTheSolution(grid, solution)){
		alert("Congratulations!!!");
		return;
	}

	if(countErrors >= maxErrors){
		alert("Você perdeu!");
	}
}

function mousedown(event){
	if(theUserFoundTheSolution(grid, solution)){
		alert("Congratulations!!!");
		return;
	}
	
	if(countErrors >= maxErrors){
		alert("Crie um novo jogo");
		return;
	}
	
	// Click only into grid
	if(mouseX > offsetX+columns*dim || mouseY > offsetY+lines*dim){
		return;
	}
	
	// Does not click in offset
	if(mouseX <= offsetX || mouseY <= offsetY){
		return;
	}

	// Get position from grid
	var x = Math.floor((mouseX-offsetX)/dim);
	var y = Math.floor((mouseY-offsetY)/dim);

	// Right button was clicked
	if(event.which == 3){
		if(grid[y][x] == EMPTY){
			grid[y][x] = X;
		}else if(grid[y][x] == X){
			grid[y][x] = EMPTY;
		}	
	}
	// Left button was clicked
	if(event.which == 1){
		if(grid[y][x] == EMPTY){
			if(solution[y][x] == BLACK_SQUARE){
				grid[y][x] = BLACK_SQUARE;
			}else{
				grid[y][x] = ERROR;
				countErrors++;
			}			
		}else if(grid[y][x] == X){
			grid[y][x] = EMPTY;
		}
	}
	
	drawSelection(x, y);
}

$( document ).ready(function() {
	init();

	var drawing = getUrlVars()["d"];;
	
	$.getJSON("drawings/"+drawing+".json", function(result){
		lines = result.lines;
		columns = result.columns;
		grid = createMatrix(columns, lines);
		solution = createMatrix(columns, lines);
		informations = result.informations;
		offsetY = 15*getTheLargerLength(informations.columns);
		offsetX = 15*getTheLargerLength(informations.lines);
        $.each(result.points, function(i, cell){
       		solution[cell.i][cell.j] = 1;
        });
		drawGrid();
    }).error(function(xhr,status,error){
	    alert(xhr.statusText);
		window.location = "index.html";
	}); 	
	
	$("#canvas-scroll").scroll(function (event) {
		scrollTop = $(this).scrollTop();
		scrollLeft = $(this).scrollLeft();
		drawGrid();
	});
});
