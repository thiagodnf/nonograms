function convertToJSON(grid, lines, columns){
	return {
		"lines": lines,
		"columns": columns,
		"points": getPoints(grid, lines, columns),
		"informations": getInformations(grid, lines, columns)
	};
}

function getPoints(grid, lines, columns){
	var points = new Array();
		
	for (var i = 0; i < lines; i++) {
		for (var j = 0; j < columns; j++) {
			if(grid[i][j] == 1){
				points.push({i:i,j:j});
			}
		}
	}

	return points;
}

function getInformations(grid, lines, columns){
	var lin = new Array();
	var col = new Array();

	// Informations about lines
	for (var i = 0; i < lines; i++) {
		var line = new Array();
		var size = 0;
		for (var j = 0; j < columns; j++) {
			if(grid[i][j] == 1){
				size++;
			}else{
				if(size != 0){
					line.push(size);
				}
				size = 0;
			}
		}
		if(size != 0){
			line.push(size);
		}
		lin.push(line);
	}

	// Informations about columns
	for (var j = 0; j < columns; j++) {
		var column = new Array();
		var size = 0;
		for (var i = 0; i < lines; i++) {
			if(grid[i][j] == 1){
				size++;
			}else{
				if(size != 0){
					column.push(size);
				}
				size = 0;
			}
		}
		if(size != 0){
			column.push(size);
		}
		col.push(column);
	}

	return {
		columns: col,
		lines: lin
	};
}
