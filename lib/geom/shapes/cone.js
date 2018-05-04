let generateConeData = function(diameter = 1.0, length = 1, slices = 72) {
	
	let diskAngle = 360 / slices
	
	let positionalVertices = []
	let indices = []
	let normals = []
	genConeAttributes(diameter / 2, length, positionalVertices, normals, indices, diskAngle)
	
	//As normals are not being added during the normal setup done in <code>genCylinderAttributes</code>
	//fill the array with the value 0.0 positionalVertices.length amount of times
	for (let i = 0; i < positionalVertices.length; i++)
		normals.push(0.0)
	
	return {
		index: indices,
		normal: normals,
		position: positionalVertices
	}
}

let genConeAttributes = function(radius, length, vertStorage, normStorage, indiceStorage, diskAngle) {
	
	let disk1centre = [0, 0, -length / 2]
	vertStorage.push(disk1centre[0])
	vertStorage.push(disk1centre[1])
	vertStorage.push(disk1centre[2])
	
	for (let i = 0; i <= (360 / diskAngle); i++) {
		let xPos = radius * Math.cos((diskAngle * i) * (Math.PI / 180))
		let yPos = radius * Math.sin((diskAngle * i) * (Math.PI / 180))
		let zPos = disk1centre[2]
		vertStorage.push(xPos)
		vertStorage.push(yPos)
		vertStorage.push(zPos)

		if (i > 0) {
			indiceStorage.push(0)
			indiceStorage.push(i)
			indiceStorage.push(i+1)
		}
	}
	
	let finalIndex = (vertStorage.length / 3)
	vertStorage.push(0)
	vertStorage.push(0)
	vertStorage.push(length / 2)
	
	
	for (let i = 1; i < finalIndex; i++) {
		indiceStorage.push(finalIndex)
		indiceStorage.push(i)
		indiceStorage.push(i+1)
	}
}