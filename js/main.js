let mouse = {
	x: 0,
	y: 0
};
// Follows the mouse event
function onMouseMove(event) {
	document.addEventListener('keyup', () => {
		if (event.shiftKey) {
			shiftPress = false;
		}
	})
	if (!shiftPress) {
		return
	}
	// Update the mouse letiable
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	// Make the sphere follow the mouse
	let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
	vector.unproject(camera);
	let dir = vector.sub(camera.position).normalize();
	let distance = -camera.position.z / dir.z;
	let pos = camera.position.clone().add(dir.multiplyScalar(distance));
	//mouseMesh.position.copy(pos);

	light.position.copy(pos);
};

let shiftPress = false;
document.addEventListener('keydown', () => {
	if (event.shiftKey) {
		shiftPress = true;
		document.addEventListener("mousemove", onMouseMove, false);
	}
})



let spheres = [];
let numOfSpheres = 0;
let [sphereRadius, sphereSegments, sphereRings] = [100, 32, 32];

for (let i = 0; i < numOfSpheres; i++) {
	let sphere = new Sphere(sphereRadius, sphereSegments, sphereRings, [400*i, -200*i, 300*i],
		{material: null, text: 'Root Node ' + i, textColor: 0x00ffff});
	refractSphereCamera.position = sphere.sphere.position;
	spheres.push(sphere);
}


let helixes = [];
let numOfHelixes = 0;
let [helixRadius, helixWidth, numOfParticles] = [40, 100, 100];
let helixOffset = [0, Math.PI];
let helixColor = [0x0000ff, 0x00ff00]

for (let i = 0; i < numOfHelixes; i++) {

	for(let j = 0; j < 2; j++) {
		let helix = new Helix(helixRadius, helixWidth, numOfParticles, [400*i, -200*i, 300*i], [400*(i+1), -200*(i+1), 300*(i+1)],
			{helixOffset: helixOffset[j], color: helixColor[j]});
		helixes.push(helix);
	}
}


let csvFile = 'data/iris.csv';
let delimiter = ",";
let features, csvData;

(async () => {
	await readTextFile(csvFile, delimiter);
})()


let clock = new THREE.Clock();

controls = new THREE.OrbitControls(camera, renderer.domElement);

let animate = function() {
	requestAnimationFrame(animate);

	refractSphereCamera.update( renderer, scene );
	renderer.render(scene, camera);

  helixes.forEach( (helix) => {
    helix.animate();
  })

	spheres.forEach( (sphere) => {
		if(sphere.text_mesh) {
		sphere.text_mesh.lookAt(camera.position);
		// sphere.rotation.y -= 0.05;
		}
	})

	controls.update();
};

animate();


function start() {
	let tree = initiate(csvData, features);
	makeTree(tree, features);
}


