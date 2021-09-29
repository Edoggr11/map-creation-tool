var collumns;
var rows;
var cellSize = 20;

var inpColor = 1;

var selectedCol = "blue";

//this is for the random colors to save to in the future
var colorDict = {
	1: '#0000FF',
};

var array = new Array();

function readSet() {
	collumns = +document.getElementById("widthInp").value;
	rows = +document.getElementById("heightInp").value;

	array = Array(rows).fill().map(() => Array(collumns).fill(0));

	if (collumns > 0 && collumns <= 100 && Number.isInteger(+collumns) && rows > 0 && rows <= 100 && Number.isInteger(+rows)) {

		createCanvas(collumns * cellSize, rows * cellSize);
		loop();

	} else {

		window.alert("Invalid size");
		console.log("Invalid size");
	}

}

function changeIndex(num) {

	if (typeof num !== 'undefined'){
		document.getElementById("index").value = num;
	}

	inpColor = +document.getElementById("index").value;

	if (!colorDict[inpColor]){
		colorDict[inpColor] = setRandomColor(inpColor);
		console.log('suzk xdess 1');
		selectedCol = colorDict[inpColor];

	} else if (colorDict[inpColor]) {
		selectedCol = colorDict[inpColor];
		console.log(colorDict[inpColor], "sussy balls");
	}

	selectedCol = colorDict[inpColor];
	console.log(selectedCol);

	
}

function setRandomColor(seed) {
	return "#" + Math.floor((Math.abs(Math.sin(seed) * 16777215)) % 16777215).toString(16);

}

function exportData() {
	document.getElementById("exportOutput").value = JSON.stringify(array);
}

function importData() {

	try {
        array = JSON.parse(document.getElementById("importInput").value);
    } catch(e) {
        alert(e);
    }

	collumns = array[0].length;
	rows = array.length;
	
	var localColor;

	// console.log("size: ", collumns, rows);
	createCanvas(collumns * cellSize, rows * cellSize);
	loop();

	for (var i = 0; i < rows; i++){
		for (var m = 0; m < collumns; m++){
			if (array[i][m] != 0){
				localColor = colorDict[array[i][m]];
				fill(localColor);
				rect(m * cellSize, i * cellSize, cellSize, cellSize);
				noFill();
			} 
		}
	}
}

function setup() {

	for (let element of document.getElementsByClassName("p5Canvas")) {
    	element.addEventListener("contextmenu", (e) => e.preventDefault());
	}

	noLoop();
	background(255);
	stroke(1);
	noFill();

}

function draw() {
	for (var i = 0; i < collumns; i++) {

		for (var m = 0; m < rows; m++) {

			var x = i * cellSize;
			var y = m * cellSize;

			rect(x, y, cellSize, cellSize);

		}
	}
	if (mouseIsPressed && mouseX <= width - 1 && mouseX >= 0 && mouseY <= height - 1 && mouseY >= 0) {

		if (mouseButton === LEFT) {
			mouseDet(selectedCol, inpColor);

		} else if (mouseButton === RIGHT) {
			mouseDet(255, 0);

		} else {
			console.log("[mouse] tf u doin lmao");

		}
	}
}

function mouseDet(color, index) {
	fill(color);
	rect(mouseX - (mouseX % cellSize), mouseY - (mouseY % cellSize),cellSize, cellSize);
	noFill();

	var xIndex = Math.floor((mouseX - (mouseX % cellSize)) / cellSize);
	var yIndex = Math.floor((mouseY - (mouseY % cellSize)) / cellSize);
	
	// console.log(yIndex, xIndex);
	array[yIndex][xIndex] = index;
	// console.log(array);
}