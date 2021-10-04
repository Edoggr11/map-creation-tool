var collumns;
var rows;
var cellSize = 20;
var spriteRadius = 5;
var inpColor = 1;
var selectedCol = 'blue';

var spriteMode = false;
var selectedSprite = 'barrel';

var colorDict = {
	1: '#0000FF',
};

var array = [];
var spriteDict = {};
var spriteNums = {};

// run when the settings apply button is pressed
function readSet() {
	collumns = +document.getElementById('widthInp').value;
	rows = +document.getElementById('heightInp').value;

	array = Array(rows).fill().map(() => Array(collumns).fill(0));

	if (collumns > 0 && collumns <= 100 && Number.isInteger(+collumns) && rows > 0 && rows <= 100 && Number.isInteger(+rows)) {

		spriteMode = false;
		spriteDict = {};

		createCanvas(collumns * cellSize, rows * cellSize);
		loop();

	} else {

		window.alert('Invalid size');
		console.log('Invalid size');
	}
}

function changeIndex(num) {

	if (typeof num !== 'undefined'){
		document.getElementById('index').value = num;
	}

	inpColor = +document.getElementById('index').value;

	if (!colorDict[inpColor]){
		colorDict[inpColor] = setRandomColor(inpColor);
		selectedCol = colorDict[inpColor];

		spawnKeys(inpColor);

	} else if (colorDict[inpColor]) {
		selectedCol = colorDict[inpColor];
	}
	selectedCol = colorDict[inpColor];
	console.log(selectedCol);
}

function setActiveSprite() {
	selectedSprite = document.getElementById('sprite').value;
}

function spawnKeys(input) {
	var th = document.createElement('th');
	document.getElementById('colorNumber').appendChild(th);
	th.textContent = input;

	var colorBox = document.createElement('th');
	var colorBoxSpan = document.createElement('span');
	document.getElementById('colorDisplay').appendChild(colorBox);
	colorBox.appendChild(colorBoxSpan);
	colorBoxSpan.setAttribute('class', 'box');
	colorBoxSpan.setAttribute('style', 'background: ' + colorDict[input] + ';');
	colorBoxSpan.setAttribute('onClick', 'changeIndex(' + input + ');');
}

// generates a pseudo-random color based on the seed
function setRandomColor(seed) {
	return '#' + Math.floor((Math.abs(Math.sin(seed) * 16777215)) % 16777215).toString(16);
}

function exportData() {
	if (spriteMode === true){
		
		document.getElementById('exportOutput').value = "";
		
		for (i = 0; i < Object.keys(spriteDict).length; i++) {
			var text;
			text = "new Pseudo3D.Sprite(" + spriteNums[spriteDict[i][2]] + ", [" + Math.round(spriteDict[i][0])/cellSize + ", " + Math.round(spriteDict[i][1])/cellSize + "]),";
			// console.log(text);
			
			document.getElementById('exportOutput').value += text;
		}

		var existingExportText = document.getElementById('exportOutput').value;
		document.getElementById('exportOutput').value = '[' + existingExportText + '], ';
		
	} else {
		document.getElementById('exportOutput').value = JSON.stringify(array);
	}
	
}

function importData() {

	try {
        array = JSON.parse(document.getElementById('importInput').value);
    } catch(e) {
        alert(e);
    }

	collumns = array[0].length;
	rows = array.length;
	
	var localColor;

	createCanvas(collumns * cellSize, rows * cellSize);
	loop();

	for (var i = 0; i < rows; i++){
		for (var m = 0; m < collumns; m++){
			if (array[i][m] !== 0){
				if (!colorDict[array[i][m]]) {
					colorDict[array[i][m]] = setRandomColor(array[i][m]);
					spawnKeys(array[i][m]);
				}
				localColor = colorDict[array[i][m]];
				fill(localColor);
				rect(m * cellSize, i * cellSize, cellSize, cellSize);
				noFill();
			}
		}
	}

	document.getElementById('widthInp').value = collumns;
	document.getElementById('heightInp').value = rows;

}

function drawFromArray() {
	for (var i = 0; i < rows; i++){
		for (var m = 0; m < collumns; m++){
			if (array[i][m] !== 0){
				if (!colorDict[array[i][m]]) {
					colorDict[array[i][m]] = setRandomColor(array[i][m]);
					spawnKeys(array[i][m]);
				}
				localColor = colorDict[array[i][m]];
				fill(localColor);
				rect(m * cellSize, i * cellSize, cellSize, cellSize);
				noFill();
			}
		}
	}
}

function setup() {
	for (let element of document.getElementsByClassName('p5Canvas')) {
    	element.addEventListener('contextmenu', (e) => e.preventDefault());
	}
	noLoop();
	background(255);
	stroke(1);
	noFill();
}


var spriteModeToolTip = document.getElementById('spriteModeToolTip');

function draw() {

	// remove sprite dots when not in spritemode
	if (!spriteMode) {
		background('#FF');
	}

	// draws the tile dividers
	for (var i = 0; i < collumns; i++) {
		for (var m = 0; m < rows; m++) {
			var x = i * cellSize;
			var y = m * cellSize;
			rect(x, y, cellSize, cellSize);
		}
	}

	// draw the existing boxes from the array
	drawFromArray();

	// places and removes tiles
	if (mouseIsPressed && mouseX <= width - 1 && mouseX >= 0 && mouseY <= height - 1 && mouseY >= 0) {
		if (mouseButton === LEFT) {
			mouseDet(selectedCol, inpColor);
		} else if (mouseButton === RIGHT) {
			mouseDet(255, 0);
		} else {
			console.log('[mouse] tf u doin lmao');
		}
	}

	// run the spritemode
	if (spriteMode) {
		runSpriteMode();
	}

	if (spriteMode === false) {
		spriteModeToolTip.style.display='none';
	} else {
		spriteModeToolTip.style.display='';
	}
}

function mouseDet(color, index) {
	if (!spriteMode) {
		var xIndex = Math.floor((mouseX - (mouseX % cellSize)) / cellSize);
		var yIndex = Math.floor((mouseY - (mouseY % cellSize)) / cellSize);
		
		array[yIndex][xIndex] = index;
	}
}

function runSpriteMode() {
	fill('#FFFFFF80')
	rect(0, 0, width, height);

	for (i = 0; i < Object.keys(spriteDict).length; i++){
		fill(setRandomColor(spriteDict[i][2]-600));
		ellipse(spriteDict[i][0], spriteDict[i][1], spriteRadius*2);
		
	}
	noFill();

}

function mouseReleased() {
	// place sprites on the screne here if in spritemode
	if (spriteMode && mouseX <= width - 1 && mouseX >= 0 && mouseY <= height - 1 && mouseY >= 0) {
		if (mouseButton === LEFT) {
			// ellipse(mouseX+spriteRadius, mouseY+spriteRadius, spriteRadius*2);
			var lowestSpriteDict = findLowestUnused(spriteDict);
			var lowestSpriteNums = findLowestUnused(spriteNums);

			// add sprite to spriteNums if it isn't already in the object
			if (!getKeyByValue(spriteNums, selectedSprite)) {
				console.log('new sprite color');
				spriteNums[lowestSpriteNums] = selectedSprite;
			}
			if (keyIsPressed && keyCode === CONTROL) {
				spriteDict[lowestSpriteDict] = [((Math.round((mouseX-10)/cellSize)*cellSize)+10), ((Math.round((mouseY-10)/cellSize)*cellSize)+10), getKeyByValue(spriteNums, selectedSprite)];
				console.log('control');
			} else {
				spriteDict[lowestSpriteDict] = [mouseX, mouseY, getKeyByValue(spriteNums, selectedSprite)];
			}
			// console.log(lowestSpriteDict, spriteDict[lowestSpriteDict]);
		}
	}
}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}


function findLowestUnused(object) {
	var i = 0;
	while (object[i]) {
		i++;
	}
	return i;
}