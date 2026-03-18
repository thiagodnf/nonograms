/** 
 * Return a matrix where all cells contains zero values.
 *
 * @param {integer} x - Number of columns.
 * @param {integer} y - Number of lines.
 */
function createMatrix(x, y){
	var matrix = new Array(y);

	for (var i = 0; i < y; i++) {
		matrix[i] = new Array(x);
		for (var j = 0; j < x; j++) {
			matrix[i][j] = 0;
		}
	}

	return matrix;
}

function theUserFoundTheSolution(grid, solution){
	if(grid.length != solution.length){
		throw "The grid and solutions are different";
	}

	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < solution[i].length; j++) {
			if(solution[i][j] == BLACK_SQUARE && grid[i][j] != BLACK_SQUARE){
				return false;
			}
		}
	}

	return true;
}

function getTheLargerLength(array){
	var max = -1;
	
	for (var i = 0; i < array.length; i++) {
		if(array[i].length > max){
			max = array[i].length;
		}
	}
	
	return max;
}

function getMousePosition(event){
	var mousePosition = {};

	if (event.offsetX) {
		mousePosition.x = event.offsetX;
		mousePosition.y = event.offsetY;
	} else if (event.layerX) {
		mousePosition.x = event.layerX;
		mousePosition.y = event.layerY;
	} else if (event.clientX) { // Firefox
		mousePosition.x = event.clientX - $(canvas).offset().left;
		mousePosition.y = event.clientY - $(canvas).offset().top;
	}	

	return mousePosition;
}
