import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import Snake from './snake.js';
// import one from './images/1.png';
// import two from './images/2.png';
// import three from './images/3.png';
// import four from './images/4.png';
// import five from './images/5.png';
// import six from './images/6.png';



const scene = new THREE.Scene();

const platformHeight = 0.5;
const platformWidth = 5;
const platformDepth = 5;

const wallThickness = 0.01; 
const wallHeight = platformHeight + 0.1;
const wallColor = 0x00FF00;
const wallOpacity = 0.2;

const boundaryLeft = -platformWidth / 2 - wallThickness / 2;
const boundaryRight = platformWidth / 2 + wallThickness / 2;
const boundaryTop = platformDepth / 2 + wallThickness / 2;
const boundaryBottom = -platformDepth / 2 - wallThickness / 2;

const snakeUnitSize = 0.1;
var movementSpeed = 0.015;

var snakeDir = 'right';
var score = 0;
var teleport = false;

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



// // Creating the snake object
// const snakeGeometry = new THREE.BoxGeometry(snakeUnitSize, snakeUnitSize, snakeUnitSize);
// const snakeMaterial = new THREE.MeshBasicMaterial({ color: 0x567AFF });
// const snake = new THREE.Mesh(snakeGeometry, snakeMaterial);
// snake.position.set(0, platformHeight/2, 0); 
// scene.add(snake);
const snake = new Snake(snakeUnitSize, 0, platformHeight/2, 0, movementSpeed, scene);



// Creating the food object
// const foodGeometry = new THREE.SphereGeometry(snakeUnitSize/1.5, 200, 200);
// const foodMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
// const food = new THREE.Mesh(foodGeometry, foodMaterial);


const textureLoader = new THREE.TextureLoader();
const foodGeometry = new THREE.BoxGeometry(0.1,0.2,0.1);
const foodMaterial =[
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./images/sideView.png') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./images/sideView.png') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./images/topView.jpg') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./images/sideView.png') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./images/sideView.png') }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load('./images/sideView.png') })
];
const food = new THREE.Mesh(foodGeometry, foodMaterial);


// const foodGeometry = new THREE.BoxGeometry(snakeUnitSize/1.5, 200, 200);
// const foodMaterial = [
//     new THREE.MeshStandardMaterial({ map: textureLoader.load('./images/1.png') }),
//     new THREE.MeshStandardMaterial({ map: textureLoader.load('./images/2.png') }),
//     new THREE.MeshStandardMaterial({ map: textureLoader.load('./images/3.png') }),
//     new THREE.MeshStandardMaterial({ map: textureLoader.load('./images/4.png') }),
//     new THREE.MeshStandardMaterial({ map: textureLoader.load('./images/5.png') }),
//     new THREE.MeshStandardMaterial({ map: textureLoader.load('./images/6.png') })
// ];
// const food = new THREE.Mesh(foodGeometry, foodMaterial);


// Getting random coordinates for the food object
var randomCoord = getRandomCoord();
var foodX = randomCoord.x;
var foodZ = randomCoord.z;
food.position.set(foodX, platformHeight/2, foodZ);
scene.add(food);


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
    // score = 0 ;
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
    leftWall.material.color.set(0x00FF00);
    rightWall.material.color.set(0x00FF00);
    topWall.material.color.set(0x00FF00);
    bottomWall.material.color.set(0x00FF00);
  }, 1000);
  
}


function GameOver(score) {
  cancelAnimationFrame(animate);
  scene.visible = false;

  const gameOverScreen = document.getElementById('game-over-screen');
  const gameOverScore = document.getElementById('game-over-score');

  if(score < 0){
    gameOverScore.textContent = `Score:${score} 😭`;
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

  snake.move()
  // console.log(snake.children.length)
  

  if(teleport == true){
    resetWallColor();
  }


  if(snakeDir == 'right'){
    // snake.head.position.x += movementSpeed;
    if (snake.direction[0]==0) snake.direction = [1, 0]
  }
  else if(snakeDir == 'left'){
    // snake.head.position.x -= movementSpeed;
    if (snake.direction[0]==0) snake.direction = [-1, 0]
  }
  else if(snakeDir == 'up'){
    // snake.head.position.z -= movementSpeed;
    if (snake.direction[1]==0) snake.direction = [0, -1]
  }
  else if(snakeDir == 'down'){
    // snake.head.position.z += movementSpeed;
    if (snake.direction[1]==0) snake.direction = [0, 1]
  }


  if (checkCollision(snake.head, leftWall)) {
    teleport = true;
    leftWall.material.color.set(0xFF0000);  
    snake.head.position.x = boundaryRight - snakeUnitSize / 2;
  } 
  else if (checkCollision(snake.head, rightWall)) {
    teleport = true;
    rightWall.material.color.set(0xFF0000);
    snake.head.position.x = boundaryLeft + snakeUnitSize / 2;
  } 
  else if (checkCollision(snake.head, topWall)) {
    teleport = true;
    topWall.material.color.set(0xFF0000);
    snake.head.position.z = boundaryBottom + snakeUnitSize / 2;
  } 
  else if (checkCollision(snake.head, bottomWall)) {
    teleport = true;
    topWall.material.color.set(0xFF0000);
    snake.head.position.z = boundaryTop - snakeUnitSize / 2;
  }
  else
  {
    teleport = false;
  }
    

  if(checkCollision(snake.head, food)){
      randomCoord = getRandomCoord(); 
      foodX = randomCoord.x;
      foodZ = randomCoord.z;
      food.position.set(foodX, platformHeight/2, foodZ);

      score += 1;  
      snake.grow();  
  }
  
  renderer.render(scene, camera);
};

animate();

