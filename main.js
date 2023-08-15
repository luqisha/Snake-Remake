import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const platformHeight = 0.5;
const platformWidth = 5;
const platformDepth = 5;


const wallThickness = 0.01; 
const wallHeight = platformHeight + 0.1;
const wallColor = 0x00ff00;
const wallOpacity = 0.2;

const boundaryLeft = -platformWidth / 2 - wallThickness / 2;
const boundaryRight = platformWidth / 2 + wallThickness / 2;
const boundaryTop = platformDepth / 2 + wallThickness / 2;
const boundaryBottom = -platformDepth / 2 - wallThickness / 2;


const snakeUnit = 0.1;
var movementSpeed = 0.015;

var snakeDir = 'right';
var score = 0;
var teleport = false;
let font; 

const scoreObject = document.querySelector('#score');

// Creating the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000000, 1);
renderer.clear();

// Creating the camera
// THREE.PerspectiveCamera(FOV, viewAspectRatio, zNear, zFar)
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 4);
camera.lookAt(scene.position);

// Creating the control for the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.05;
controls.enableDamping = true;
// controls.enableZoom = true;



// Creating the platform
const platformGeometry = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
const platformTexture = new THREE.TextureLoader().load('./images/grass.jpg');
const platformMaterial = new THREE.MeshBasicMaterial({
  map: platformTexture
});

const platform = new THREE.Mesh(platformGeometry, platformMaterial);
scene.add(platform);


// Creating the walls around the platform
// Left wall
const leftWallMaterial = new THREE.MeshBasicMaterial({ color: wallColor, transparent: true, opacity: wallOpacity });

const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, platformDepth);
const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
leftWall.position.set(-platformWidth / 2 - wallThickness / 2, 0.1, 0);
scene.add(leftWall);

// Right wall
const rightWallMaterial = new THREE.MeshBasicMaterial({ color: wallColor, transparent: true, opacity: wallOpacity });
const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, platformDepth);
const rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
rightWall.position.set(platformWidth / 2 + wallThickness / 2, 0.1, 0);
scene.add(rightWall);

// Top wall
const topWallMaterial = new THREE.MeshBasicMaterial({ color: wallColor, transparent: true, opacity: wallOpacity });
const topWallGeometry = new THREE.BoxGeometry(platformWidth + 2 * wallThickness, wallHeight, wallThickness);
const topWall = new THREE.Mesh(topWallGeometry, topWallMaterial);
topWall.position.set(0, 0.1, platformDepth / 2 + wallThickness / 2);
scene.add(topWall);

// Bottom wall
const bottomWallMaterial = new THREE.MeshBasicMaterial({ color: wallColor, transparent: true, opacity: wallOpacity });
const bottomWallGeometry = new THREE.BoxGeometry(platformWidth + 2 * wallThickness, wallHeight, wallThickness);
const bottomWall = new THREE.Mesh(bottomWallGeometry, bottomWallMaterial);
bottomWall.position.set(0, 0.1, -platformDepth / 2 - wallThickness / 2);
scene.add(bottomWall);



// Creating the snake object
const snakeGeometry = new THREE.BoxGeometry(snakeUnit, snakeUnit, snakeUnit);
const snakeMaterial = new THREE.MeshBasicMaterial({ color: 0x567AFF });
const snake = new THREE.Mesh(snakeGeometry, snakeMaterial);
snake.position.set(0, platformHeight/2, 0); 
scene.add(snake);

// Creating the food object
const foodGeometry = new THREE.SphereGeometry(snakeUnit/1.5, 200, 200);
const foodMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
const food = new THREE.Mesh(foodGeometry, foodMaterial);


// Getting random coordinates for the food object
var randomCoord = getRandomCoord();
console.log(randomCoord);
var foodX = randomCoord.x;
var foodZ = randomCoord.z;
food.position.set(foodX, snake.position.y + snakeUnit/1.5/2, foodZ);
scene.add(food);


// Creating text object for showing score
// const fontLoader = new FontLoader();
// const fontPath = './fonts/Nasalization Rg_Regular.json';

// fontLoader.load(fontPath, (loadedFont) => {
//   font = loadedFont;
// });

// var textString = '0';
// var textGeometry = new TextGeometry(textString, {
//   font: font,
//   size: 1, 
//   height: 0.1,
//   curveSegments: 10, 
// });
// const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// var textMesh = new THREE.Mesh(textGeometry, textMaterial);
// textMesh.position.set(-5, -5, 0); 
// textMesh.scale.set(1, 1, 1);
// scene.add(textMesh);


// Rendering the initial scene
renderer.render(scene, camera);


// Defining key press events
function onKeyDown(event) {
  switch (event.keyCode) {
    case 65: // A Key
      snakeDir = 'left';
      break;
    case 68: // D Key
      snakeDir = 'right';
      break;
    case 87: // W Key
      snakeDir = 'up';
      break;
    case 83: // S Key
      snakeDir = 'down';
      break;
  }
};

document.addEventListener('keydown', onKeyDown, false);


function updateScore(){
  if(score < 0){
    scoreObject.style.display = 'none';
    GameOver(score);
  }
  else
  {
    scoreObject.innerHTML = `
    points: ${score}`

    if(score > 10 && score < 20){
      movementSpeed = movementSpeed*1.5;
    }
    else if(score > 20 && score < 30){
      movementSpeed = movementSpeed*2;
    }
    else if(score > 30 ){
      movementSpeed = movementSpeed*2.5;
    }

  }
}

// Function to get random coordinates from the platform
function getRandomCoord() {
  var X = (Math.random() * platformWidth) - platformWidth/2;
  var Y = (Math.random() * platformHeight/2) + platformHeight/4;
  var Z = (Math.random() * platformDepth) - platformDepth/2;

  return { x: X, y: Y, z: Z };
};


// Function to check collision
function checkCollision(object1, object2) {
  const box1 = new THREE.Box3().setFromObject(object1);
  const box2 = new THREE.Box3().setFromObject(object2);

  return box1.intersectsBox(box2);
};
  

// Function to destroy objects
function destroyObject(object) {
  if (object.parent) {
    object.parent.remove(object);
  }

  if (object.material) {
    object.material.dispose();

    if (object.material.map) {
      object.material.map.dispose();
    }
  }

  if (object.geometry) {
    object.geometry.dispose();
  }

  object = null;
};



function resetWallColor(){
  score -= 1;
  setTimeout(() => {
    leftWall.material.color.set(0x00ff00);
    rightWall.material.color.set(0x00ff00);
    topWall.material.color.set(0x00ff00);
    bottomWall.material.color.set(0x00ff00);
  }, 1000);
  
}

function GameOver(score) {
  cancelAnimationFrame(animate);
  scene.visible = false;

  const gameOverScreen = document.getElementById('game-over-screen');
  const gameOverScore = document.getElementById('game-over-score');

  if(score < 0){
    gameOverScore.textContent = `Score: 😭`;
  }
  else
  {
    gameOverScore.textContent = `Score: ${score}`;
  }
  gameOverScreen.style.display = 'block';
}
  

// Rendering the scene continuously
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateScore();

  if(teleport == true){
    resetWallColor();
  }

  if(snakeDir == 'right'){
    snake.position.x += movementSpeed;
  }
  else if(snakeDir == 'left'){
    snake.position.x -= movementSpeed;
  }
  else if(snakeDir == 'up'){
    snake.position.z -= movementSpeed;
  }
  else if(snakeDir == 'down'){
    snake.position.z += movementSpeed;
  }


  if (checkCollision(snake, leftWall)) {
    teleport = true;
    leftWall.material.color.set(0xff0000);  
    snake.position.x = boundaryRight - snakeUnit / 2;
  } 
  else if (checkCollision(snake, rightWall)) {
    teleport = true;
    rightWall.material.color.set(0xff0000);
    snake.position.x = boundaryLeft + snakeUnit / 2;
  } 
  else if (checkCollision(snake, topWall)) {
    teleport = true;
    topWall.material.color.set(0xff0000);
    snake.position.z = boundaryBottom + snakeUnit / 2;
  } 
  else if (checkCollision(snake, bottomWall)) {
    teleport = true;
    topWall.material.color.set(0xff0000);
    snake.position.z = boundaryTop - snakeUnit / 2;
  }
  else
  {
    teleport = false;
  }
    

  if(checkCollision(snake, food)){
      randomCoord = getRandomCoord(); 
      
      console.log(randomCoord);
      foodX = randomCoord.x;
      foodZ = randomCoord.z;
      food.position.set(foodX, snake.position.y, foodZ);
      score += 1;    
  }
  
  
  renderer.render(scene, camera);
};

animate();

