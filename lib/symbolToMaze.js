var symbolToMaze = function(array, model){
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
           if(array[i][j] == 0){
               array[i][j] = new wallRenderer(model, "Right-Down");
           }
           else if(array[i][j] == 1){
            array[i][j] = new wallRenderer(model, "Left-Down");
           }
           else if(array[i][j] == 2){
            array[i][j] = new wallRenderer(model, "Right-Up");
           }
           else if(array[i][j] == 3){
            array[i][j] = new wallRenderer(model, "Left-Up");
           }
           else if(array[i][j] == 00){
            array[i][j] = new wallRenderer(model, "Right/Left");
           }
           else if(array[i][j] == 11){
            array[i][j] = new wallRenderer(model, "Up/Down");
           }
        }
    }

}