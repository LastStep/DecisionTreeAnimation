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


// Reflective Material
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