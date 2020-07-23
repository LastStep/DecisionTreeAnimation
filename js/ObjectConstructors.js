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

	constructor(helixRadius, helixWidth, numberOfParticles, {
		color = 0xff0000,
		size = 2,
		particleMaterial = null
	} = {}) {

		this.helixRadius = helixRadius;
		this.helixWidth = helixWidth;
		this.numberOfParticles = numberOfParticles;
		this.clock = new THREE.Clock();
		this.customCount = 2 * 6.282;

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
		this.particleCount = this.particleGeometry.vertices.length

		for (var v = 0; v < this.particleCount; v++) {
			this.particleAttributes.customColor.value[v] = new THREE.Color().setHSL(1 - v / this.particleCount, 1.0, 0.5);
			this.particleAttributes.customOffset.value[v] = this.customCount * (v / this.particleCount);
		}

		if (!particleMaterial) {
			this.particleMaterial = new THREE.PointsMaterial({ color: color, size: size });
		} else {
			this.particleMaterial = particleMaterial;
		}

		this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);

		scene.add(this.particles);

	}

	helixPosition(helixRadius, t, helixWidth) {
		let position = new THREE.Vector3(
			helixRadius * Math.cos(t),
			helixRadius * Math.sin(t),
			helixWidth * t);
		return position;
	}

	animateHelix() {
		// let t = this.clock.getElapsedTime();
		// let pos = this.helixPosition(helixRadius, t, helixWidth);
		// return pos;

		let t0 = this.clock.getElapsedTime();
		this.particleUniforms.time.value = 0.125 * t0;
		let v0 = this.customCount * ((this.particleCount - 1) / this.particleCount);
		for (var v = 0; v < this.particleGeometry.vertices.length; v++) {
			let timeOffset = this.particleUniforms.time.value + this.particleAttributes.customOffset.value[v];
			if (timeOffset > v0) {
				timeOffset = timeOffset - Math.floor(timeOffset / v0) * v0;
			}
			this.particleGeometry.vertices[v] = helix.helixPosition(this.helixRadius, timeOffset, this.helixWidth);
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
