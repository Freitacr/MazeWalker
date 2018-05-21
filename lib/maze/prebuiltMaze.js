/* uUu:
    eRD, wR, eLD, wU, :, wU, eRD, wR, eLD

    walls:
        lower case defines sides and what is in front of it
        upper case only defines sides


    0,0 -> 1,1
    1,0 -> 4,1
    PathCentre = (num*3) + 1

*/

let printMazeArr = function(arr) {
    let printMazeSubArr = function(subArr) {
        let mazeStr = "[";
        for (let i =0; i < subArr.length; i++) {
            mazeStr = mazeStr.concat(",", subArr[i]);
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

let constructPrebuiltMaze = function(mazeDef) {
    let mazeSize = mazeDef.length;
    let finalMazeSize = mazeSize * 3;

    let mazeParsed = new Array();

    for (let i = 0; i < finalMazeSize; i++) {
        mazeParsed.push(new Array());
        for (let j = 0; j < finalMazeSize; j++) {
            mazeParsed[i].push(":");
        }
    }

    printMazeArr(mazeParsed);

    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            let currSymbol = mazeDef[i][j];
            let symbolLocationTY = (i * 3) + 1
            let symbolLocationTX = (j * 3) + 1
            //Paths defined in columns, left column, middle column, right column
            if (currSymbol === "U") {

                mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wU"
                mazeParsed[symbolLocationTY][symbolLocationTX-1] = "wU"
                mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wU"
                
                mazeParsed[symbolLocationTY-1][symbolLocationTX] = "p"
                mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
                mazeParsed[symbolLocationTY+1][symbolLocationTX] = "p"

                mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wU"
                mazeParsed[symbolLocationTY][symbolLocationTX+1] = "wU"
                mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wU"
                
            } else if (currSymbol === "u") {

                /*
                eLD WR eRD
                wU  P  wU
                wU  P  wU                
                */

                mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "eLD"
                mazeParsed[symbolLocationTY][symbolLocationTX-1] = "wU"
                mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wU"
                
                mazeParsed[symbolLocationTY-1][symbolLocationTX] = "wR"
                mazeParsed[symbolLocationTY][symbolLocationTX] = "pe"
                mazeParsed[symbolLocationTY+1][symbolLocationTX] = "p"

                mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "eRD"
                mazeParsed[symbolLocationTY][symbolLocationTX+1] = "wU"
                mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wU"

            } else if (currSymbol === "D") {

                /*
                wD  P  wD
                wD  P  wD
                wD  P  wD                
                */

                mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wD"
                mazeParsed[symbolLocationTY][symbolLocationTX-1] = "wD"
                mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wD"
                
                mazeParsed[symbolLocationTY-1][symbolLocationTX] = "p"
                mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
                mazeParsed[symbolLocationTY+1][symbolLocationTX] = "p"

                mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wD"
                mazeParsed[symbolLocationTY][symbolLocationTX+1] = "wD"
                mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wD"

            } else if (currSymbol === "d") {

                /*
                wD  P  wD
                wD  P  wD
                eLU wR eRU                
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wD"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "wD"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "eLU"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "pe"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "wR"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wD"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "wD"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "eRU"

            } else if (currSymbol === "L") {

                /*
                wL  wL wL
                P   P  P
                wL  wL wL                
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wL"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wL"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "wL"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "wL"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wL"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wL"

            } else if (currSymbol === "l") {

                /*
                eRD wL wL
                wD  P  P
                eLU wL wL                
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "eRD"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "wD"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "eLU"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "wL"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "pe"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "wL"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wL"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wL"

            } else if (currSymbol === "R") {

                /*
                wR  wR wR
                P   P  P
                wR  wR wR                
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wR"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "wR"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wR"

            } else if (currSymbol === "r") {

                /*
                wR  wR eLD
                P   P  wU
                wR  wR eRU                
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wR"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "pe"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "wR"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "eRD"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "eU"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "eRU"

            } else if (currSymbol === "eUR" || currSymbol === "eLD") {
                /*
                eLD wR wR
                wU  P  P
                wU  P  eLD
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "eLD"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "wU"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wU"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "p"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "eLD"

            } else if (currSymbol === "eDR" || currSymbol === "eLU") {
                
                /*
                wD  P  eLU
                wD  P  P
                eLU wR wR
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wD"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "wD"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "eLU"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "wR"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "eLU"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wR"

            } else if (currSymbol === "eRU" || currSymbol === "eDL") {
                
                /*
                eRU P  wU
                P   P  wU
                wR  wR eRU
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "eRU"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wR"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "wR"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wU"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "wU"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "eRU"

            } else if (currSymbol === "eRD" || currSymbol === "eUL") {

                /*
                wR  wR eRD
                P   P  wD
                eRD P  wD
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "eRD"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "p"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "eRD"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "wD"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wD"

            } else if (currSymbol === "jHU") {

                /*
                eRU P  eLU
                P   P  P
                wR  wR wR
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "eRU"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wR"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "wR"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "eLU"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wR"

            } else if (currSymbol === "jHD") {

                /*
                wR  wR wR
                P   P  P
                eRD P  eLD
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "eRD"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "p"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wR"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "eLD"

            } else if (currSymbol === "jVL") {

                /*
                eRU P wU
                P   P wU
                eRD P wU
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "eRU"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "eRD"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "p"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "wU"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "wU"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "wU"

            } else if (currSymbol === "jVR") {

                /*
                wU  P  eLU
                wU  P  P
                wU  P  eLD
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "wU"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "wU"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "wU"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "p"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "eLU"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "eLD"

            } else if (currSymbol === "jA" || currSymbol === "S") {
                /*
                eRU P eLU
                P   P P
                eRD P eLD
                */

               mazeParsed[symbolLocationTY-1][symbolLocationTX-1] = "eRU"
               mazeParsed[symbolLocationTY][symbolLocationTX-1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX-1] = "eRD"
               
               mazeParsed[symbolLocationTY-1][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY][symbolLocationTX] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX] = "p"

               mazeParsed[symbolLocationTY-1][symbolLocationTX+1] = "eLU"
               mazeParsed[symbolLocationTY][symbolLocationTX+1] = "p"
               mazeParsed[symbolLocationTY+1][symbolLocationTX+1] = "eLD"

            }
        }
    }


    printMazeArr(mazeParsed);


}