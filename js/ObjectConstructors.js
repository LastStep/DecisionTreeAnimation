class Sphere {

	constructor(radius, segments, rings, position, {
		color = 0xffffff,
		material = null,
		text = '',
		textColor = 0xffffff
	} = {}) {

		this.geometry = new THREE.SphereGeometry(radius, segments, rings);
		if (!material) {
			this.material = new THREE.MeshBasicMaterial({
				color: color,
				wireframe: true,
				transparent: true,
				opacity: 0.1
			});
		} else {
			this.material = material;
		}
		this.sphere = new THREE.Mesh(this.geometry, this.material);
		this.sphere.position.set(...position);
		this.text_mesh = generateTextMesh(text, textColor, this, this.sphere);

		scene.add(this.sphere);

	}

}

class Helix {

	constructor(helixRadius, helixWidth, numberOfParticles, startPos, endPos, {
		color = 0xff0000,
		size = 2,
		particleMaterial = null,
		spread = 2 * Math.PI,
		helixOffset = 0,
	} = {}) {

		this.startPos = new THREE.Vector3(...startPos);
		this.endPos = new THREE.Vector3(...endPos);
		this.axis = this.endPos.clone().sub(this.startPos);
		this.axisUnit = this.axis.clone().normalize();
		this.axisU = this.axisUnit.clone().cross(new THREE.Vector3(1, 0, 0));
		this.axisV = this.axisU.clone().cross(this.axisUnit);

		this.helixRadius = helixRadius;
		this.helixWidth = helixWidth;
		this.distance = this.startPos.distanceTo(this.endPos);
		this.frequency = this.distance / ( spread * this.helixWidth);
	
		this.helixOffset = helixOffset;
		this.numberOfParticles = numberOfParticles;
		this.clock = new THREE.Clock();
		this.customCount = this.frequency * spread;

		this.particleGeometry = new THREE.Geometry();
		for (var i = 0; i < numberOfParticles; i++) {
			this.particleGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
		}

		this.particleTexture = new THREE.TextureLoader().load('images/disc.png');
		this.particleUniforms = {
			time: { type: "f", value: 1.0 },
			texture: { type: "t", value: this.particleTexture },
		};
		this.particleAttributes = {
			customColor: { type: 'c', value: [] },
			customOffset: { type: 'f', value: [] },
		};

		for (var v = 0; v < this.numberOfParticles; v++) {
			this.particleAttributes.customColor.value[v] = new THREE.Color().setHSL(1 - v / this.numberOfParticles, 1.0, 0.5);
			this.particleAttributes.customOffset.value[v] = this.customCount * (v / this.numberOfParticles);
		}

		if (!particleMaterial) {
			this.particleMaterial = new THREE.PointsMaterial({ color: color, size: size });
		} else {
			this.particleMaterial = particleMaterial;
		}

		this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);

		this.particles.position.set(...this.startPos.toArray());
		this.particles.dynamic = true;
		this.particles.sortParticles = true;

		scene.add(this.particles);
	}

	helixPosition(t) {
		let x0 = this.helixRadius * Math.cos(this.helixOffset + t);
		let y0 = this.helixRadius * Math.sin(this.helixOffset + t);
		let z0 = this.helixWidth  * t;

		let position = new THREE.Vector3(
			x0 * this.axisU.x + y0 * this.axisV.x + z0 * this.axisUnit.x,
			x0 * this.axisU.y + y0 * this.axisV.y + z0 * this.axisUnit.y,
			x0 * this.axisU.z + y0 * this.axisV.z + z0 * this.axisUnit.z
		)
		
		return position
	}

	animate() {
		let t0 = this.clock.getElapsedTime();
		this.particleUniforms.time.value = 0.125 * t0;
		let v0 = this.customCount * ((this.numberOfParticles - 1) / this.numberOfParticles);
		for (var v = 0; v < this.particleGeometry.vertices.length; v++) {
			let timeOffset = this.particleUniforms.time.value + this.particleAttributes.customOffset.value[v];
			if (timeOffset > v0) {
				timeOffset = timeOffset - Math.floor(timeOffset / v0) * v0;
			}
			this.particleGeometry.vertices[v] = this.helixPosition(timeOffset);

		}
		this.particles.geometry.verticesNeedUpdate = true;
	}

}


function generateTextMesh(text, textColor, obj, objectMesh) {

	new THREE.FontLoader().load('fonts/helvetiker_regular.typeface.json', function(font) {

		let text_geo = new THREE.TextGeometry(text, {
			font: font,
			size: 20,
			height: 0.5,
			curveSegments: 20,
			bevelEnabled: false,
			bevelThickness: 0.05,
			bevelSize: 0.1,
			bevelSegments: 0.1
		});
		text_geo.center();
		let text_mat = new THREE.MeshPhongMaterial({ color: textColor });
		text_mesh = new THREE.Mesh(text_geo, text_mat);
		let vector = new THREE.Vector3();
		text_mesh.position.copy(vector.setFromMatrixPosition(objectMesh.matrixWorld));

		scene.add(text_mesh);
		obj.text_mesh = text_mesh;

	});

}
