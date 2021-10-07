var collumns;
var rows;
var cellSize = 20;
var spriteRadius = 5;
var inpColor = 1;
var selectedCol = 'blue';

var spriteMode = false;
var selectedSprite = 'barrel';
var importSpritesArray;

var colorDict = {
    1: '#0000FF',
};

var array = [];

var spriteDict = {};
// this one starts at zero because im dumb and didnt think about it, and also dont want to go fix all the problems that result from it starting at 1 :(
var spriteNums = {
    0: 'barrel',
};

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

    if (typeof num !== 'undefined') {
        document.getElementById('index').value = num;
    }

    inpColor = +document.getElementById('index').value;

    if (!colorDict[inpColor]) {
        colorDict[inpColor] = setRandomColor(inpColor);
        selectedCol = colorDict[inpColor];

        spawnKeys(inpColor);

    } else if (colorDict[inpColor]) {
        selectedCol = colorDict[inpColor];
    }
    selectedCol = colorDict[inpColor];
    console.log(selectedCol);
}

function setActiveSprite(num) {

    var lowestSpriteNums = findLowestUnused(spriteNums);

    if (typeof num !== 'undefined') {
        document.getElementById('sprite').value = spriteNums[num];
    }

    console.log('sprite changed');
    selectedSprite = document.getElementById('sprite').value;

    if (!getKeyByValue(spriteNums, selectedSprite)) {
        console.log('new sprite color');
        spriteNums[lowestSpriteNums] = selectedSprite;

        spawnSpriteKeys(getKeyByValue(spriteNums, selectedSprite));
    }
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

function spawnSpriteKeys(input) {
    var th = document.createElement('th');
    document.getElementById('spriteColorNumber').appendChild(th);
    th.textContent = +input + 1;

    var colorOrb = document.createElement('th');
    var colorOrbSpan = document.createElement('span');
    document.getElementById('spriteColorDisplay').appendChild(colorOrb);
    colorOrb.appendChild(colorOrbSpan);
    colorOrbSpan.setAttribute('class', 'circle');
    colorOrbSpan.setAttribute('style', 'background: ' + setRandomColor(input - 600) + ';');
    colorOrbSpan.setAttribute('onClick', 'setActiveSprite(' + input + ');');
}

// generates a pseudo-random color based on the seed
function setRandomColor(seed) {
    return '#' + Math.floor((Math.abs(Math.sin(seed) * 16777215)) % 16777215).toString(16);
}

function exportData() {
    if (spriteMode === true) {

        document.getElementById('exportOutput').value = "";

        for (let i = 0; i < Object.keys(spriteDict).length; i++) {
            var text;
            text = "new Pseudo3D.Sprite(" + spriteNums[spriteDict[i][2]] + ", [" + Math.round(spriteDict[i][1]) / cellSize + ", " + Math.round(spriteDict[i][0]) / cellSize + "]),";
            // console.log(text);

            document.getElementById('exportOutput').value += text;
        }

        var existingExportText = document.getElementById('exportOutput').value;
        document.getElementById('exportOutput').value = '[' + existingExportText + '],';

    } else {
        document.getElementById('exportOutput').value = JSON.stringify(array);
    }

}

function importData() {
    if (!spriteMode) {
        try {
            array = JSON.parse(document.getElementById('importInput').value);
        } catch (e) {
            alert(e);
        }

        collumns = array[0].length;
        rows = array.length;

        var localColor;

        createCanvas(collumns * cellSize, rows * cellSize);
        loop();

        for (let i = 0; i < rows; i++) {
            for (let m = 0; m < collumns; m++) {
                if (array[i][m] !== 0) {
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

    } else {

        var importSprites = document.getElementById('importInput').value;
        // remove newline characters from the input, just in case
        importSprites = importSprites.split(/\r?\n|\r/).join('');
        // some string manipulation because JSON.parse can't handle anything that isn't a common datatype or somthing
        importSprites = importSprites.split('[n').join('["n').split(',n').join('","n').split(',],').join('"]');
        // console.log(importSprites);
        importSpritesArray = JSON.parse(importSprites);

        spriteDict = {};

        for (let i = 0; i < importSpritesArray.length; i++) {
            // more string manipulation
            importSpritesArray[i] = importSpritesArray[i].split('e(').join('e("').split(', [').join('", [');
            importSpritesArray[i] = importSpritesArray[i].split('new Pseudo3D.Sprite(').join('[').split('])').join(']]');
            importSpritesArray[i] = JSON.parse(importSpritesArray[i]);

        }

        var spriteNums = {0: 'barrel'};
        spriteDict = {};

        console.log(importSpritesArray);

        for (let i = 0; i < importSpritesArray.length; i++) {
            var lowestSpriteDict = findLowestUnused(spriteDict);
            var lowestSpriteNums = findLowestUnused(spriteNums);

            // add sprite to spriteNums if it isn't already in the object
            if (!getKeyByValue(spriteNums, importSpritesArray[i][0])) {
                console.log('new sprite color');
                spriteNums[lowestSpriteNums] = importSpritesArray[i][0];
                spawnSpriteKeys(getKeyByValue(spriteNums, importSpritesArray[i][0]));
            }

            spriteDict[lowestSpriteDict] = [importSpritesArray[i][1][1] * cellSize, importSpritesArray[i][1][0] * cellSize, getKeyByValue(spriteNums, importSpritesArray[i][0])];
        }
    }
}

function drawFromArray() {
    for (let i = 0; i < rows; i++) {
        for (let m = 0; m < collumns; m++) {
            if (array[i][m] !== 0) {
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
    for (let i = 0; i < collumns; i++) {
        for (let m = 0; m < rows; m++) {
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
        spriteModeToolTip.style.display = 'none';
    } else {
        spriteModeToolTip.style.display = '';
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

    for (let i = 0; i < Object.keys(spriteDict).length; i++) {
        fill(setRandomColor(spriteDict[i][2] - 600));
        ellipse(spriteDict[i][0], spriteDict[i][1], spriteRadius * 2);

    }
    noFill();

}

function mouseReleased() {
    // place sprites on the screne here if in spritemode
    if (spriteMode && mouseX <= width - 1 && mouseX >= 0 && mouseY <= height - 1 && mouseY >= 0) {
        if (mouseButton === LEFT) {
            // ellipse(mouseX+spriteRadius, mouseY+spriteRadius, spriteRadius*2);
            var lowestSpriteDict = findLowestUnused(spriteDict);

            if (keyIsPressed && keyCode === CONTROL) {
                let same = false;

                for (let i = 0; i < Object.keys(spriteDict).length; i++) {
                    if (((Math.round((Math.floor(mouseX) - 10) / cellSize) * cellSize) + 10) == spriteDict[i][0] && ((Math.round((Math.floor(mouseY) - 10) / cellSize) * cellSize) + 10) == spriteDict[i][1]) {
                        same = true;
                        break;
                    }
                }

                if (!same) {
                    spriteDict[lowestSpriteDict] = [((Math.round((Math.floor(mouseX) - 10) / cellSize) * cellSize) + 10), ((Math.round((Math.floor(mouseY) - 10) / cellSize) * cellSize) + 10), getKeyByValue(spriteNums, selectedSprite)];
                    console.log('control');
                }
            } else {
                let same = false;

                for (let i = 0; i < Object.keys(spriteDict).length; i++) {
                    if (Math.floor(mouseX) == spriteDict[i][0] && Math.floor(mouseY) == spriteDict[i][1]) {
                        same = true;
                        break;
                    }
                }

                if (!same) {
                    spriteDict[lowestSpriteDict] = [Math.floor(mouseX), Math.floor(mouseY), getKeyByValue(spriteNums, selectedSprite)];
                }
            }

        } else if (mouseButton === RIGHT) {

            // loop through the existing sprites when right click is released
            for (let i = 0; i < Object.keys(spriteDict).length; i++) {

                // first sprite that is found to be within the threshold is removed
                let distance = sqrt(((spriteDict[i][0] - mouseX) ** 2) + ((spriteDict[i][1] - mouseY) ** 2))
                if (distance <= spriteRadius * 2) { // might wanna change this radius

                    // find the lowest empty slot on spriteDict and slide everything over by one
                    var lowestSpriteDict = findLowestUnused(spriteDict);

                    // delete the sprite which the loop is on
                    delete spriteDict[i];

                    // move each value over to take the place of the value that was deleted
                    for (let m = i; m < lowestSpriteDict - 1; m++) {
                        spriteDict[m] = spriteDict[m + 1];
                    }

                    // delete the final value that is left over from the shift
                    delete spriteDict[lowestSpriteDict - 1];

                }
            }

            /*
            // this is intended to remove colors when they are unused so as to fix color inconsistancies when importing, without the use of exporting color maps (but doesnt work as it is lmao)

            // no longer looping through the existing sprites -
            // init a variable to hold weather a sprite name is used by the existing sprites
            var usedColorDict = {};

            // loop thru the existing sprite names and set them to false in the usedColorDict dictionary
            for (let i = 0; i < Object.keys(spriteNums).length; i++) {

                // creates a key of the current sprite name, and then sets it to false
                usedColorDict[spriteNums[i]] = false;
            }

            // loops thru existing sprites and sets the sprite names that have been used to true
            for (let i = 0; i < Object.keys(spriteDict).length; i++) {
                    usedColorDict[spriteNums[spriteDict[i][2]]] = true; 
            }

            // gets the lowest empty slot in the spritNums dictionary
            var lowestSpriteNums = findLowestUnused(spriteNums);

            // the variable to be deleted; returns 
            var deletionVar = getKeyByValue(spriteNums, getKeyByValue(usedColorDict, false));
            console.log(deletionVar);

            // this makes me think i intended to have this be in the loop

            while (deletionVar) {
                delete spriteNums[deletionVar];
            }

            for (let i = deletionVar; i < lowestSpriteNums-1; i++) {
                spriteNums[i] = spriteNums[i+1];
            }

            delete spriteNums[lowestSpriteNums-1];
            */
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