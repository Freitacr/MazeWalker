//Model is the obj model that should be associated with the wall renderer. 
//The model should already exist and be loaded, so this will need to be created
//in the promise itself. Only four of these should be created for each of the two model types 
//(straight and elbow walls), so they can be enumerated fairly easily
//Orientation is the orientation the wall should take, enumerated below:
/*
    Straight:
        0: Right/left
        1: Up/Down
    Elbow:
        0: Right-Down
        
        1: Left-Down 
        
        2: Right-Up I.E: _|

        3: Left-Up I.E: |_
*/

let wallRenderer = function(model, orientation) {

}

wallRenderer.prototype.render = function(gl, uni, material = null) {

}