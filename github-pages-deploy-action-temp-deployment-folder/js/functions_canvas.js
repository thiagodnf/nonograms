function fillSquare(x1, y1, width, height, color){
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(x1, y1, width, height);
	ctx.stroke();
}

function drawText(x, y, text, color){
	drawTextWithFont(x, y, text, color, '10pt Arial')
}

function drawTextWithFont(x, y, text, color, font){
	ctx.font = font;
    ctx.lineWidth = 1;
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}

function drawLine(x1, y1, x2, y2, color){
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.moveTo(x1+0.5, y1+0.5);
	ctx.lineTo(x2+0.5, y2+0.5);
	ctx.lineWidth = 1;
	ctx.stroke();	
}

function drawSquare(i, j, letter, bg, color){
	var color = color || bg;
	var x = offsetX+j*dim;
	var y = offsetY+i*dim;
	fillSquare(x, y, dim, dim, bg);
	drawSquareWithX(i, j, letter, color);
}

function drawSquareWithX(i, j, letter, color){
	var fontSize = 16;
	var paddingTop = (dim-fontSize)/2 + fontSize;
	var paddingLeft = (dim-fontSize)/2;
	var x = offsetX+j*dim+paddingLeft;
	var y = offsetY+i*dim+paddingTop;
	drawTextWithFont(x, y, letter, color, fontSize+"pt Arial");

}
