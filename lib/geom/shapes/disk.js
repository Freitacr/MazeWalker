let generateDiskData = function(diameter, slices) {
	/*
	if ((diskAngle === 0) || !(360 % diskAngle <= 1e-12)) {
		console.error("Invalid disk disk angle, resetting to an accepted angle")
		console.log("Disk angle was " + diskAngle + " and the difference was " + (360 % diskAngle))
		diskAngle = 10
	}
	*/
	let diskAngle = 360 / slices
	
	let positionalVertices = []
	let indices = []
	let normals = []
	let tex = []
	genDiskAttributes(diameter / 2, positionalVertices, normals, tex, indices, diskAngle)
	
	//As normals are not being added during the normal setup done in <code>genCylinderAttributes</code>
	//fill the array with the value 0.0 positionalVertices.length amount of times
	//for (let i = 0; i < positionalVertices.length; i++)
	//	normals.push(0.0)
	
	return {
		index: indices,
		normal: normals,
		position: positionalVertices,
		texCoord: tex
	}
}

let genDiskAttributes = function(radius, vertStorage, normStorage, texStorage, indiceStorage, diskAngle) {
	
	//As the disk is created resting with centre at the origin,
	//And lying in the x-y plane, all of the normals should be pointing
	//In the positive z direction.

	let disk1centre = [0, 0, 0]
	vertStorage.push(disk1centre[0])
	vertStorage.push(disk1centre[1])
	vertStorage.push(disk1centre[2])

	texStorage.push(0.5)
	texStorage.push(0.5)

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

		vec2.scale(posOffset, posOffset, 0.5);

		//vec2.add(posOffset, posOffset, vec2.fromValues(0.5, 0.5));
		
		texStorage.push(posOffset[0] + 0.5);
		texStorage.push(posOffset[1] + 0.5);


		
		normStorage.push(0);
		normStorage.push(0);
		normStorage.push(1);
		if (i > 0) {
			indiceStorage.push(0)
			indiceStorage.push(i)
			indiceStorage.push(i+1)
		}
	}
}