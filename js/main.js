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

let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;

let scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff);

let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
let VIEW_ANGLE = 90, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 200000;
let camera = new THREE.PerspectiveCamera(VIEW_ANGLE, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR);
scene.add(camera);
camera.position.z = 5;
camera.position.set(0,150,1000);
camera.lookAt(scene.position);

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

// RENDERER
if ( Detector.webgl )
	renderer = new THREE.WebGLRenderer( {antialias:true} );
else
	renderer = new THREE.CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let light = new THREE.PointLight(0xffffff);
light.position.set(15, 15, 5);
camera.add(light);
// let lightAmb = new THREE.AmbientLight(0x000000);
// scene.add(lightAmb);

// FLOOR
let floorTexture = new THREE.TextureLoader().load( 'images/checkerboard.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 10, 10 );
let floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
let floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -50.5;
floor.rotation.x = Math.PI / 2;
// scene.add(floor);
// SKYBOX
let imagePrefix = "images/dawnmountain-";
let directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
let imageSuffix = ".png";
let skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );

let materialArray = [];
for (let i = 0; i < 6; i++) {
	materialArray.push( new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load(imagePrefix + directions[i] + imageSuffix),
		side: THREE.BackSide
	}));
}
let skyBox = new THREE.Mesh( skyGeometry, materialArray );
scene.add( skyBox );


let sphereRadius = 100;
let sphereSegments = 32;
let sphereRings = 32;

this.refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
scene.add( refractSphereCamera );
let fShader = THREE.FresnelShader;
let fresnelUniforms =
{
	"mRefractionRatio": { type: "f", value: 1.02 },
	"mFresnelBias": 	{ type: "f", value: 0.1 },
	"mFresnelPower": 	{ type: "f", value: 2.0 },
	"mFresnelScale": 	{ type: "f", value: 1.0 },
	"tCube": 			{ type: "t", value: refractSphereCamera.renderTarget } //  textureCube }
};
let customMaterial = new THREE.ShaderMaterial(
{
	uniforms: 		  fresnelUniforms,
	vertexShader:   fShader.vertexShader,
	fragmentShader: fShader.fragmentShader
} );


let spheres = [];
let numOfSpheres = 4;

for (let i = 0; i < numOfSpheres; i++) {

	let sphere = new Sphere(sphereRadius, sphereSegments, sphereRings, [400*i, -200*i, 300*i],
		{material: null, text: 'Root Node ' + i, textColor: 0x00ffff});
	refractSphereCamera.position = sphere.sphere.position;
	spheres.push(sphere);
}


// document.addEventListener('click', () => {console.log(event.clientX, event.clientY);});

// let testSphere = new Sphere(50, sphereSegments, sphereRings, [0,0,0], {text: ''});
// spheres.push(testSphere)


let helixes = [];
let numOfHelixes = 1;
let startPos = [[0, 0, 0], [100, 100, 0]]
let endPos = [[300, 300, 300], [400, 500, 600]]

for (let i = 0; i < numOfHelixes; i++) {

	let helixOffset = [0, Math.PI];
	let helixColor = [0x0000ff, 0x00ff00]

	for(let j = 0; j < 2; j++) {

		let helix = new Helix(40, 100, 100, [400*i, -200*i, 300*i], [400*(i+1), -200*(i+1), 300*(i+1)],
			{helixOffset: helixOffset[j], color: helixColor[j]});
		helixes.push(helix);
	}
}


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
		sphere.sphere.visible = false;
		sphere.sphere.visible = true;
		if(sphere.text_mesh) {
		sphere.text_mesh.lookAt(camera.position);
		}
	})

	controls.update();
};

animate();

let csvFile = 'data/iris.csv';
let delimiter = ",";
let Data;

(async () => {
	data = await readTextFile(csvFile, delimiter);
})()

