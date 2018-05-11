let printMazeArr = function(arr) {
    let printMazeSubArr = function(subArr) {
        let mazeStr = "[";
        for (let i =0; i < subArr.length; i++) {
            mazeStr = mazeStr.concat("", subArr[i]);
        }
        mazeStr = mazeStr.concat("", "]");
        return mazeStr;
    }
    let mazeStr = "";
    for (let i = 0; i < arr.length; i++) {
        mazeStr = mazeStr.concat("\n", printMazeSubArr(arr[i]))
    }

    console.log(mazeStr);
}

let createMaze = function(size) {

    complexity = Math.floor(Math.sqrt(size))
    startingPoint = Math.floor(size / 2);

    let mazeDef = new Array();
    for (let i = 0; i < size; i++) {
        mazeDef.push(new Array());
        for (let j = 0; j < size; j++) {
            mazeDef[i].push(":");
        }
    }

    mazeDef[startingPoint][startingPoint] = "S"

    let endingPointX = -1
    let endingPointY = -1

    let endingPointRow = Math.floor(Math.random() * (size))
    let endingPointColumn = -1
    if (!(endingPointRow == 0) || endingPointRow == size-1) {
        endingPointColumn = Math.floor(Math.random() * 2)
        endingPointColumn = endingPointColumn == 1 ? size - 1 : 0

    } else {
        endingPointColumn = Math.floor(Math.random() * size);
    }

    console.log(endingPointColumn)
    console.log(endingPointRow)

    mazeDef[endingPointRow][endingPointColumn] = "E"

    let currX = startingPoint
    let currY = startingPoint

    let currentStep = 0;
    let prevDir = -1;

    let forceX = false;
    let forceY = false;

    while (!(currX == endingPointX && currY == endingPointY)) {
        let usePrevDir = Math.floor(Math.random() * 4);
        let dir = -1;
        if (usePrevDir == 0) {
            dir = Math.floor(Math.random() * 4);
        } else {
            dir = prevDir
        }

        let correctionPercentage = (Math.pow(currentStep, 3) / (size * 3)) / 100
        if (Math.random() < correctionPercentage) {
            let diffX = endingPointColumn - currX
            let diffY = endingPointRow - currY
            diffX = Math.abs(diffX)
            diffY = Math.abs(diffY)
            if (diffX > diffY || forceX) {
                let dirPrime = endingPointColumn - currX
                dir = dirPrime > 0 ? 1 : 0;
                if (prevDir == 0 && dir == 1) {
                    forceY = true;
                } else if (prevDir == 1 && dir == 0) {
                    forceX = true;
                }
                if(forceX)
                    forceX = false;
            } else if (diffY > diffX || forceY) {
                let dirPrime = endingPointRow - currY
                dir = dirPrime > 0 ? 3 : 2
                if (prevDir == 2 && dir == 3) {
                    forceY = true;
                } else if (prevDir == 3 && dir == 2) {
                    forceX = true;
                }
                if (forceY)
                    forceY = false
            } else {
                forceX = true;
            }
            console.log("Cruise Control Activated")
        } 
        
        //currentStep += 1
        //let correctionPercentage = Math.log(currentStep) / Math.log(1.2);
        let updatePrevDir = false
        console.log(correctionPercentage)        
        
        if (! ( (prevDir == 0 && dir == 1) || (prevDir == 1 && dir == 0) || (prevDir == 2 && dir == 3) || prevDir == 3 && dir == 2 )) {
            updatePrevDir = true
            if (dir == 0) {
                currX -= 1;
                if (currX == -1) {
                    currX += 1
                }
            } else if (dir == 1) {
                currX += 1;
                if (currX == size) {
                    currX -= 1
                }
            } else if (dir == 2) {
                currY -= 1;
                if (currY == -1) {
                    currY += 1
                }
            } else {
                currY += 1;
                if (currY == size) {
                    currY -= 1
                }
            }
        }
        mazeDef[currY][currX] = "S"
        if (updatePrevDir) {
            prevDir = dir;
            currentStep += 1
        }

        if (currentStep == 40) {
            break;
        }
        printMazeArr(mazeDef);
    }

    mazeDef[endingPointRow][endingPointColumn] = "E"


    printMazeArr(mazeDef);

    return mazeDef;
}