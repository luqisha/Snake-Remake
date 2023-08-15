import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();

const platformHeight = 0.5;
const platformWidth = 5;
const platformDepth = 5;

const snakeUnit = 0.5; // snake size big 
const movementSpeed = 0.015;

var snakeDir = 'right';
var previousSnakeDir  = 'right';   // to store previous movement 
var Score = 0;
var coordinateFood=0 ;
let font; 

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



// Creating the platform
const platformGeometry = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
const platformTexture = new THREE.TextureLoader().load('./images/grass.jpg');
const platformMaterial = new THREE.MeshBasicMaterial({
  map: platformTexture
});

const platform = new THREE.Mesh(platformGeometry, platformMaterial);
scene.add(platform);

// Creating the snake object





const snakeGeometry = new THREE.BoxGeometry(snakeUnit, snakeUnit, snakeUnit);
const snakeMaterial = new THREE.MeshBasicMaterial({ color: 0x567AFF });
const snake = new THREE.Mesh(snakeGeometry, snakeMaterial);
snake.position.set(0, platformHeight/2, 0); 
scene.add(snake);

// Creating the food object
const foodGeometry = new THREE.CircleGeometry(snakeUnit/1.5, 200);
const foodMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
const food = new THREE.Mesh(foodGeometry, foodMaterial);


// Getting random coordinates for the food object
var randomCoord = getRandomCoord();
console.log(randomCoord);
var foodX = randomCoord.x;
var foodZ = randomCoord.z;
food.position.set(foodX, snake.position.y, foodZ);
scene.add(food);


// Creating text object for showing score
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
        console.log('left');
        break;
      case 68: // D Key
        snakeDir = 'right';
        console.log('right');
        break;
      case 87: // W Key
        snakeDir = 'up';
        console.log('up');
        break;
      case 83: // S Key
        snakeDir = 'down';
        console.log('down');
        break;
    }
};

document.addEventListener('keydown', onKeyDown, false);

var coordinateFood=4 ;
// Function to get random coordinates from the platform
function getRandomCoord() {
  var value = (Math.random()*10);
  var coordinateFood=Math.ceil(value) ;                               // random value generate for different cordinates 
  if (coordinateFood % 4 == 0){
    var X = (Math.random() * (platformWidth/2)) - (platformWidth/2);
    var Y = (Math.random() * (platformHeight/2)) - (platformHeight/2);
    var Z = (Math.random() * (platformDepth/2)) - (platformDepth/2);
  }
  else if (coordinateFood % 4 == 1){
    var X = -((Math.random() * (platformWidth/2)) - (platformWidth/2));
    var Y = (Math.random() * (platformHeight/2)) - (platformHeight/2);
    var Z = (Math.random() * (platformDepth/2)) - (platformDepth/2);
  }
  else if (coordinateFood % 4 == 2){
    var X = (-Math.random() * (platformWidth/2)) + (platformWidth/2);
    var Y = (-Math.random() * (platformHeight/2)) + (platformHeight/2);
    var Z = (-Math.random() * (platformDepth/2)) + (platformDepth/2);
  }
  else if (coordinateFood % 4 == 3){
    var X = (Math.random() * (platformWidth/2)) - (platformWidth/2);
    var Y = -(Math.random() * (platformHeight/2)) + (platformHeight/2);
    var Z = -(Math.random() * (platformDepth/2)) + (platformDepth/2);
  }
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


// const fontLoader = new THREE.FontLoader();
// const fontUrl = './fonts/Nasalization Rg_Regular.json';

// fontLoader.load(fontUrl, (loadedFont) => {
//   font = loadedFont;
// });

  

// Rendering the scene continuously
function animate() {
    requestAnimationFrame(animate);
 
    if(snakeDir == 'right' && previousSnakeDir != 'left'){
        snake.position.x += movementSpeed;
        previousSnakeDir = 'right';
    }
    else if(previousSnakeDir == 'right' && snakeDir == 'left'){
        snake.position.x += movementSpeed;
        previousSnakeDir = 'right';
    }
    else if(snakeDir == 'left' && previousSnakeDir != 'right'){
        snake.position.x -= movementSpeed;
        previousSnakeDir = 'left';
    }
    else if(previousSnakeDir == 'left' && snakeDir == 'right'){
      snake.position.x -= movementSpeed;
      previousSnakeDir = 'left';
    }
    else if(snakeDir == 'up' && previousSnakeDir != 'down' ){
        snake.position.z -= movementSpeed;
        previousSnakeDir = 'up';
    }
    else if(previousSnakeDir == 'up' && snakeDir == 'down'){
        snake.position.z -= movementSpeed;
        previousSnakeDir = 'up';
    }
    else if(snakeDir == 'down' && previousSnakeDir != 'up' ){
        snake.position.z += movementSpeed;
        previousSnakeDir = 'down';
    }
    else if(previousSnakeDir == 'down' && snakeDir == 'up'){
        snake.position.z += movementSpeed;
        previousSnakeDir = 'down';
    }


    if(checkCollision(snake, food)){

        
        randomCoord = getRandomCoord(); 
        
        console.log(randomCoord);
        foodX = randomCoord.x;
        foodZ = randomCoord.z;
        food.position.set(foodX, snake.position.y, foodZ);
        Score += 1;
        console.log(Score);
    }

    renderer.render(scene, camera);
};

animate();

