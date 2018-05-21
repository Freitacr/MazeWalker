var symbolToMaze = function(array, straightWallModel, elbowWallModel){
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
           if(array[i][j] === "eRD"){
               array[i][j] = new wallRenderer(elbowWallModel, 0);
           }
           else if(array[i][j] === "eLD"){
            array[i][j] = new wallRenderer(elbowWallModel, 3);
           }
           else if(array[i][j] === "eRU"){
            array[i][j] = new wallRenderer(elbowWallModel, 1);
           }
           else if(array[i][j] === "eLU"){
            array[i][j] = new wallRenderer(elbowWallModel, 2);
           }
           else if(array[i][j] === "wL" || array[i][j] === "wR"){
            array[i][j] = new wallRenderer(straightWallModel, 0);
           }
           else if(array[i][j] === "wU" || array[i][j] === "wD"){
            array[i][j] = new wallRenderer(straightWallModel, 1);
           }
        }
    }

}