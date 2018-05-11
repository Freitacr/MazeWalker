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

    while (!(currX == endingPointColumn && currY == endingPointRow)) {
        let usePrevDir = Math.floor(Math.random() * 4);
        let dir = -1;
        if (usePrevDir != 0) {
            dir = Math.floor(Math.random() * 4);
        } else {
            dir = prevDir
        }

        let correctionPercentage = (Math.pow(currentStep, 3) / (size * 3)) / 100

        let dirLeftChance = -1
        let dirRightChance = -1
        let dirDownChance = -1
        let dirUpChance = -1

        let diffX = endingPointColumn - currX
        let diffY = endingPointRow - currY

        let validColDir = diffX > 0 ? 1 : 0 //1 is right, 0 is left
        let validRowDir = diffY > 0 ? 1 : 0 //1 is down, 0 is up

        let invColDir = !validColDir
        let invRowDir = !validRowDir

        //Make percentage chances in order of left, right, down, up

        if (!usePrevDir) {
            if (correctionPercentage > 0.25) {
                let currPercentage = 0

                if (diffX == 0) {
                    if (validColDir) {
                        dirRightChance = 0

                    } else {
                        dirLeftChance = 0
                    }
                    if (validRowDir) {
                        dirDownChance = correctionPercentage
                    } else {
                        dirUpChance = correctionPercentage
                    }
                    currPercentage += correctionPercentage
                } else if (diffY == 0) {
                    if (validRowDir) {
                        dirDownChance = 0
                    } else {
                        dirUpChance = 0
                    }
                    if (validColDir) {
                        dirRightChance = correctionPercentage
                    } else {
                        dirLeftChance = correctionPercentage
                    }
                    currPercentage += correctionPercentage
                } else {
                    let proportion = diffX / diffY
                    let validColChance = proportion * (correctionPercentage / 2)
                    let validRowChance = correctionPercentage - validColChance
                    if (validColDir)
                        dirRightChance = validColChance
                    else
                        dirLeftChance = validColChance
                    if (validRowDir)
                        dirDownChance = validRowChance
                    else
                        dirUpChance = validRowChance
                    currPercentage += correctionPercentage
                }

                let remainingPercentage = 1 - currPercentage
                if (remainingPercentage > 0) {
                    if (invColDir)
                        dirRightChance = remainingPercentage / 2
                    else
                        dirLeftChance = remainingPercentage / 2
                    if (invRowDir)
                        dirDownChance = remainingPercentage / 2
                    else 
                        dirUpChance = remainingPercentage / 2
                } else {
                    if (invColDir)
                        dirRightChance = 0
                    else
                        dirLeftChance = 0
                    if (invRowDir)
                        dirDownChance = 0
                    else 
                        dirUpChance = 0
                }

                let dirSel = Math.random()
                dirLeftChance = dirRightChance + dirLeftChance
                dirDownChance = dirLeftChance + dirDownChance
                dirUpChance = dirDownChance + dirUpChance
                if (dirSel < dirRightChance) {
                    dir = 1
                } else if (dirSel < dirLeftChance) {
                    dir = 0
                } else if (dirSel < dirDownChance) {
                    dir = 3
                } else {
                    dir = 2
                }

            } else {
                dir = Math.floor(Math.random() * 4)
            }
        }

        /*
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
        */
        
        //currentStep += 1
        //let correctionPercentage = Math.log(currentStep) / Math.log(1.2);
        let updatePrevDir = false
        console.log(correctionPercentage)        
        console.log("Current Intended Direction: ", dir)
        
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
        
        printMazeArr(mazeDef);
    }

    mazeDef[endingPointRow][endingPointColumn] = "E"


    printMazeArr(mazeDef);

    return mazeDef;
}