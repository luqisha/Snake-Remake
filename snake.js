import * as THREE from "three";

class Snake {
  constructor(snakeUnitSize, x, y, z, movementSpeed, scene) {
    this.snakeUnitSize = snakeUnitSize;
    this.x = x;
    this.y = y;
    this.z = z;
    this.movementSpeed = movementSpeed;
    this.scene = scene;
    this.lastPosition = [];
    this.direction = [1, 0];
    this.head = this.getCube(x, y, z, snakeUnitSize, scene);
    this.children = [];
    
    let currentX = x; 
    let currentZ = z; 
    
    for (let index = 0; index < 5; index++) {
      this.children.push(this.getCube(currentX, y, currentZ, snakeUnitSize, scene));
      this.lastPosition.push([currentX, currentZ]);
      
      currentX -= this.direction[0] * snakeUnitSize; 
      currentZ -= this.direction[1] * snakeUnitSize;
    }
    this.growPending = 0;
  }

  getCube(x, y, z, snakeUnitSize, scene) {
   
    const snakeGeometry = new THREE.BoxGeometry(snakeUnitSize, snakeUnitSize, snakeUnitSize);
    const snakeMaterial = new THREE.MeshBasicMaterial({ color: 0x567AFF});
    const snakeUnit = new THREE.Mesh(snakeGeometry, snakeMaterial);
    snakeUnit.position.set(x, y, z);

    scene.add(snakeUnit);
    return snakeUnit;
  }

  moveChildren() {
    for (let index = this.children.length ; index > 0; index--) {
      const nextPosition = this.lastPosition[index-1];
      this.children[index-1].position.set(nextPosition[0], this.y, nextPosition[1]);
      this.lastPosition[index-1] = [nextPosition[0], nextPosition[1]];
    }
    const headPosition = this.head.position.clone();
    this.lastPosition[0] = [headPosition.x,0, headPosition.z];
  }
   

  move() {
    this.lastPosition.push([this.x, this.z]);
    this.x += this.direction[0] * this.movementSpeed;
    this.z += this.direction[1] * this.movementSpeed;

    if (this.growPending > 0) {
      this.growPending--;
      const newSnakeUnit = this.getCube(
        this.x -= this.direction[0] * this.snakeUnitSize,
        this.y,
        this.z -= this.direction[1] * this.snakeUnitSize,
        this.snakeUnitSize,
        this.scene
      );
      this.children.push(newSnakeUnit);
      this.lastPosition.unshift([this.x, this.z]);
    } else if (this.lastPosition.length > this.children.length + 2) {
      this.lastPosition.shift();
    }
    this.lastPosition.shift();

    this.head.position.set(this.x, this.y, this.z);
    this.moveChildren();
  }

  grow() {
    console.log("Snake is growing");
    this.growPending++;
  }

}

export default Snake;
