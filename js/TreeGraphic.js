let [xOffset, yOffset, zOffset] = [0, 500, 0];
let [treeWidth, treeLength] = [1000, -200];

let spherePlane = 0;
let activeNode = 0;
let nodePositions = [[xOffset, yOffset, zOffset]];

function makeTree(tree, features, branch = false, prevPos = 0, pos = 0, dir = 1) {

  console.log(tree);
  console.log(nodePositions.toString());
  let [posX, posY, posZ] = getPostion(spherePlane, pos, dir, prevPos);

  let startPos = nodePositions.slice(-1)[0];
  let endPos = [posX, posY, posZ];
  drawHelix(startPos, endPos);

  console.log(startPos, endPos);

  if (tree instanceof Leaf) {

    let text = Object.keys(tree.predictions).toString();
    let color = 0xff0000;

    let sphere = new Sphere(sphereRadius / 2, sphereSegments, sphereRings, [posX, posY, posZ],
      {material: null, text: text, textColor: color});
    refractSphereCamera.position = sphere.sphere.position;
    spheres.push(sphere);

    if (!branch) {
      spherePlane -= activeNode ? activeNode : 1;
      activeNode = 0;
      nodePositions.pop();
    } else {
      activeNode++;
    } 
  }

  else { 

    let text = `${features[tree.question.col]} >= ${tree.question.val}`;
    let color = 0xffffff;

    let sphere = new Sphere(sphereRadius, sphereSegments, sphereRings, [posX, posY, posZ],
      {material: null, text: text, textColor: color});
    refractSphereCamera.position = sphere.sphere.position;
    spheres.push(sphere);

    pos = ++spherePlane;
    
    if (!branch) { nodePositions.pop();}
    nodePositions.push([posX, posY, posZ]);

    makeTree(tree.trueBranch , features, branch = true , prevPos = posX, pos = pos, dir = -1)
    makeTree(tree.falseBranch, features, branch = false, prevPos = posX, pos = pos, dir = +1)

  }
}

function getPostion(xPlane, yPlane, dir, prevPos) {

  let posX, posY, posZ;

  if (xPlane > 0) {
    posX = xOffset + prevPos + dir * treeWidth / xPlane;
    posY = yOffset + treeLength * yPlane;
    posZ = zOffset;
  } else {
    [posX, posY, posZ] = [xOffset, yOffset, zOffset];
  }
  return [posX, posY, posZ];
}

function drawHelix(startPos, endPos) {

	for(let j = 0; j < 2; j++) {
    let helix = new Helix(helixRadius, helixWidth, numOfParticles, startPos, endPos,
      {helixOffset: helixOffset[j], color: helixColor[j]});
    helixes.push(helix);
  }

}