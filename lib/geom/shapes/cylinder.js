let generateCylinderData = function(diameter = 1.0, length = 1, slices = 72) {
	
	let diskAngle = 360 / slices
	
	
	let positionalVertices = []
	
	let indices = []
	let normals = []
	let tex = []
	genCylinderAttributes(diameter / 2, length, positionalVertices, normals, indices, diskAngle, tex)

	while (tex.length / 2 != positionalVertices.length / 3) {
		tex.push(0);
		tex.push(0);
	}
	
	
	return {
		index: indices,
		normal: normals,
		position: positionalVertices,
		texCoord: tex
	}
}

let addNorms = function(normStorage, value1, value2, value3) {
	let normie = vec3.fromValues(value1, value2, value3)
	vec3.normalize(normie, normie);
	normStorage.push(normie[0], normie[1], normie[2]);
}


let genCylinderAttributes = function(radius, length, vertStorage, normStorage, indiceStorage, diskAngle, texStorage) {
	//norm for disk 1's centre should be in the pos z direction
	//norm for disk 2's centre should be in the neg z direction
	//norms around the duplicated disk vertices need to face outward of their centres

	let disk1UVCenter = vec2.fromValues(0.24271844660194175, 0.24271844660194175);
	let disk2UVCenter = vec2.fromValues(0.7572815533980582, 0.24271844660194175);
	
	let disk1Verts = [];
	let disk2Verts = [];
	let indexCounter = 1;

	//Create top disk
	let disk1centre = [0, 0, length/2]
	vertStorage.push(disk1centre[0])
	vertStorage.push(disk1centre[1])
	vertStorage.push(disk1centre[2])
	
	normStorage.push(0);
	normStorage.push(0);
	normStorage.push(1);

	
	for (let i = 0; i <= (360 / diskAngle); i++) {
		let xPos = radius * Math.cos((diskAngle * i) * (Math.PI / 180))
		let yPos = radius * Math.sin((diskAngle * i) * (Math.PI / 180))
		let zPos = disk1centre[2]
		vertStorage.push(xPos)
		vertStorage.push(yPos)
		vertStorage.push(zPos)

		let posOffset = vec2.fromValues((xPos / radius), (yPos / radius));
		vec2.normalize(posOffset, posOffset);

		posOffset[0] = (posOffset[0] * disk1UVCenter[0]) + disk1UVCenter[0]
		posOffset[1] = (posOffset[1] * disk1UVCenter[1]) + disk1UVCenter[1]

		texStorage.push(posOffset[0])
		texStorage.push(posOffset[1])

		disk1Verts.push(xPos);
		disk1Verts.push(yPos);
		disk1Verts.push(zPos);

		indexCounter += 1;
		
		normStorage.push(0)
		normStorage.push(0)
		normStorage.push(1)

		//addDiskNorm(normStorage, 0)
		if (i > 0) {
			indiceStorage.push(0)
			indiceStorage.push(i)
			indiceStorage.push(i+1)
		}
	}
	let disk2centreIndex = Math.floor(360 / diskAngle);
	let disk2centre = [0, 0, -length / 2]

	vertStorage.push(disk2centre[0])
	vertStorage.push(disk2centre[1])
	vertStorage.push(disk2centre[2])

	indexCounter += 1;

	normStorage.push(0)
	normStorage.push(0)
	normStorage.push(-1)

	for (let i = disk2centreIndex; i <= (720 / diskAngle); i++) {
		let xPos = radius * Math.cos((diskAngle * i) * (Math.PI / 180))
		let yPos = radius * Math.sin((diskAngle * i) * (Math.PI / 180))
		let zPos = disk2centre[2]
		vertStorage.push(xPos)
		vertStorage.push(yPos)
		vertStorage.push(zPos)

		disk2Verts.push(xPos);
		disk2Verts.push(yPos);
		disk2Verts.push(zPos);

		indexCounter += 1;
		
		normStorage.push(0)
		normStorage.push(0)
		normStorage.push(-1)

		if (i > disk2centreIndex) {
			indiceStorage.push(disk2centreIndex + 2)
			indiceStorage.push((i) + 3)
			indiceStorage.push((i) + 2)
		}
	}

	vertStorage.push(disk1Verts[0]);
	vertStorage.push(disk1Verts[1]);
	vertStorage.push(disk1Verts[2]);

	//I'm leaning toward these normals being the ones that are creating the broken rectangle
	
	addNorms(normStorage, disk1Verts[0], disk1Verts[1], 0);

	vertStorage.push(disk2Verts[0]);
	vertStorage.push(disk2Verts[1]);
	vertStorage.push(disk2Verts[2]);

	addNorms(normStorage, disk2Verts[0], disk2Verts[1], 0);

	indexCounter += 2;

	for (let i = 0; i < (disk1Verts.length / 3) - 1; i++) {
		vertStorage.push(disk1Verts[( (i * 3) + 3)])
		vertStorage.push(disk1Verts[( (i * 3) + 3) + 1])
		vertStorage.push(disk1Verts[( (i * 3) + 3) + 2])

		addNorms(normStorage,
			disk1Verts[( (i * 3) + 3)],
			disk1Verts[( (i * 3) + 3)]+1, 
			0
		);

		//normStorage.push(disk1Verts[( (i * 3) + 3)])
		//normStorage.push(disk1Verts[( (i * 3) + 3)]+1)
		//normStorage.push(0)

		indexCounter += 1;
		
		indiceStorage.push(indexCounter-3)
		indiceStorage.push(indexCounter-2)
		indiceStorage.push(indexCounter-1)
		
		vertStorage.push(disk2Verts[( (i * 3)+3)])
		vertStorage.push(disk2Verts[( (i * 3)+3)+1])
		vertStorage.push(disk2Verts[( (i * 3)+3)+2])
		
		addNorms(normStorage,
			disk2Verts[( (i * 3) + 3)],
			disk2Verts[( (i * 3) + 3)]+1, 
			0
		);

		//normStorage.push(disk2Verts[((i * 3) + 3)])
		//normStorage.push(disk2Verts[((i * 3) + 3)]+1)
		//normStorage.push(0)
		
		indexCounter += 1;

		indiceStorage.push(indexCounter-3)
		indiceStorage.push(indexCounter-1);
		indiceStorage.push(indexCounter-2)
		
	}

	/*
	let rectStartIndex = vertStorage.length / 3 //returns as int so long as length % 3 === 0
	let finalIndex = (rectStartIndex * 2) - 1 //This returns as an int. Used when creating final disk.
	let currIndex = 1
	let cap = (vertStorage.length - 6) / 3
	
	//Begin creation of the rectangular portion of the cylinder
	//Push the first rectangle vertex into the storage
	vertStorage.push(vertStorage[3])
	vertStorage.push(vertStorage[4])
	vertStorage.push(vertStorage[5] - length)

	let tempNormVec = vec3.fromValues(vertStorage[3], vertStorage[4], vertStorage[5] - length);
	vec3.sub(tempNormVec, tempNormVec, vec3.fromValues(0,0,-length / 2));
	vec3.normalize(tempNormVec, tempNormVec);

	normStorage.push(tempNormVec[0]);
	normStorage.push(tempNormVec[1]);
	normStorage.push(tempNormVec[2]);
	
	//This, as long as the indexes are offset, should be an easy way to get the vertices needed to not redundently create vertices when
	//The disk already has them in the correct X and Y, but not Z.
	//Offset skips the centre of the disk, and the first vertex as it is manually added
	for (let i = 0; i < cap; i++) {
		//console.log(i)
		let xPos = vertStorage[(i * 3) + 6]
		let yPos = vertStorage[(i * 3) + 7]
		let zPos = vertStorage[(i * 3) + 8] - length
		vertStorage.push(xPos)
		vertStorage.push(yPos)
		vertStorage.push(zPos)

		let normVec = vec3.fromValues(xPos, yPos, -length / 2);
		vec3.sub(normVec, normVec, vec3.fromValues(0, 0, -length/2));
		vec3.normalize(normVec, normVec);
		normStorage.push(normVec[0])
		normStorage.push(normVec[1])
		normStorage.push(normVec[2])
		//Will always have enough for two new tris to be formed
		//First Triangle
		indiceStorage.push(rectStartIndex + (currIndex - 1))
		indiceStorage.push(currIndex)
		indiceStorage.push(currIndex + 1)
		//Second Triangle
		indiceStorage.push(rectStartIndex + currIndex)
		indiceStorage.push(rectStartIndex + (currIndex - 1))
		indiceStorage.push(currIndex + 1)
		currIndex += 1
		//addRectNorm(normStorage, i, diskAngle)
		
	}
	//Add centre of the lower disk
	vertStorage.push(0)
	vertStorage.push(0)
	vertStorage.push(-length/2)
	
	//Generate indices for lower disk's tris
	for (let i = rectStartIndex; i < finalIndex; i++) {
		indiceStorage.push(finalIndex)
		indiceStorage.push(i)
		indiceStorage.push(i+1)
	}

	normStorage.push(0);
	normStorage.push(0);
	normStorage.push(-1);
	*/
}