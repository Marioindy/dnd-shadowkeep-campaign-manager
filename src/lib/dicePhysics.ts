import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { DiceType } from '@/types';

export interface DicePhysicsBody {
  body: CANNON.Body;
  mesh: THREE.Mesh;
  diceType: DiceType;
}

export class DicePhysicsWorld {
  public world: CANNON.World;
  public dice: DicePhysicsBody[] = [];
  private groundBody: CANNON.Body;

  constructor() {
    // Initialize physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, -30, 0); // Stronger gravity for dramatic effect
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.defaultContactMaterial.restitution = 0.3; // Bounciness

    // Create ground plane
    const groundShape = new CANNON.Plane();
    this.groundBody = new CANNON.Body({ mass: 0 });
    this.groundBody.addShape(groundShape);
    this.groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    this.world.addBody(this.groundBody);

    // Create walls to contain dice
    this.createWalls();
  }

  private createWalls() {
    const wallDistance = 5;
    const wallHeight = 10;

    // Back wall
    const backWall = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    backWall.position.set(0, 0, -wallDistance);
    this.world.addBody(backWall);

    // Front wall
    const frontWall = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    frontWall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI);
    frontWall.position.set(0, 0, wallDistance);
    this.world.addBody(frontWall);

    // Left wall
    const leftWall = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    leftWall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    leftWall.position.set(-wallDistance, 0, 0);
    this.world.addBody(leftWall);

    // Right wall
    const rightWall = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    rightWall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
    rightWall.position.set(wallDistance, 0, 0);
    this.world.addBody(rightWall);
  }

  public createDiceBody(
    diceType: DiceType,
    mesh: THREE.Mesh
  ): DicePhysicsBody {
    let shape: CANNON.Shape;
    let mass = 300; // Weight affects rolling dynamics

    // Create appropriate physics shape for each dice type
    switch (diceType) {
      case 'd4':
        // Tetrahedron - use convex hull or sphere approximation
        shape = new CANNON.Sphere(0.5);
        mass = 200;
        break;
      case 'd6':
        // Cube
        shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        break;
      case 'd8':
        // Octahedron - use sphere approximation
        shape = new CANNON.Sphere(0.55);
        mass = 250;
        break;
      case 'd10':
      case 'd100':
        // Pentagonal trapezohedron - use sphere approximation
        shape = new CANNON.Sphere(0.55);
        mass = 250;
        break;
      case 'd12':
        // Dodecahedron - use sphere approximation
        shape = new CANNON.Sphere(0.6);
        mass = 280;
        break;
      case 'd20':
        // Icosahedron - use sphere approximation
        shape = new CANNON.Sphere(0.6);
        mass = 300;
        break;
      default:
        shape = new CANNON.Sphere(0.5);
    }

    const body = new CANNON.Body({
      mass,
      shape,
      linearDamping: 0.1,
      angularDamping: 0.1,
    });

    const diceBody: DicePhysicsBody = {
      body,
      mesh,
      diceType,
    };

    this.dice.push(diceBody);
    this.world.addBody(body);

    return diceBody;
  }

  public throwDice(diceBody: DicePhysicsBody, position?: THREE.Vector3) {
    const { body } = diceBody;

    // Set initial position (above the ground)
    const startPosition = position || new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      5 + Math.random() * 2,
      (Math.random() - 0.5) * 2
    );

    body.position.set(startPosition.x, startPosition.y, startPosition.z);

    // Random initial rotation
    body.quaternion.setFromEuler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    // Apply random throw velocity
    const throwStrength = 8 + Math.random() * 4;
    body.velocity.set(
      (Math.random() - 0.5) * throwStrength,
      -throwStrength * 0.5,
      (Math.random() - 0.5) * throwStrength
    );

    // Apply random angular velocity for spinning
    body.angularVelocity.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
  }

  public step(deltaTime: number) {
    this.world.step(1 / 60, deltaTime, 3);

    // Update mesh positions and rotations based on physics
    this.dice.forEach((diceBody) => {
      diceBody.mesh.position.copy(diceBody.body.position as any);
      diceBody.mesh.quaternion.copy(diceBody.body.quaternion as any);
    });
  }

  public isDiceSettled(): boolean {
    return this.dice.every((diceBody) => {
      const velocity = diceBody.body.velocity.length();
      const angularVelocity = diceBody.body.angularVelocity.length();
      return velocity < 0.1 && angularVelocity < 0.1;
    });
  }

  public getDiceResult(diceBody: DicePhysicsBody): number {
    const { diceType, mesh } = diceBody;

    // Get the upward-facing normal vector
    const upVector = new THREE.Vector3(0, 1, 0);

    // For each face, check which is pointing most upward
    // This is a simplified version - in production, you'd use actual face normals
    const geometry = mesh.geometry;

    // Calculate result based on dice type and orientation
    switch (diceType) {
      case 'd4':
        return this.getTetrahedronResult(mesh);
      case 'd6':
        return this.getCubeResult(mesh);
      case 'd8':
        return this.getOctahedronResult(mesh);
      case 'd10':
        return this.getD10Result(mesh);
      case 'd12':
        return this.getDodecahedronResult(mesh);
      case 'd20':
        return this.getIcosahedronResult(mesh);
      case 'd100':
        return this.getD10Result(mesh) * 10;
      default:
        return 1;
    }
  }

  private getTetrahedronResult(mesh: THREE.Mesh): number {
    // D4: Find which face is pointing down
    const downVector = new THREE.Vector3(0, -1, 0);
    let closestFace = 1;
    let maxDot = -1;

    // Check each face normal
    const faceNormals = [
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0.816, -0.333, 0.471),
      new THREE.Vector3(-0.816, -0.333, 0.471),
      new THREE.Vector3(0, -0.333, -0.943),
    ];

    faceNormals.forEach((normal, index) => {
      const worldNormal = normal.clone().applyQuaternion(mesh.quaternion);
      const dot = worldNormal.dot(downVector);
      if (dot > maxDot) {
        maxDot = dot;
        closestFace = index + 1;
      }
    });

    return closestFace;
  }

  private getCubeResult(mesh: THREE.Mesh): number {
    // D6: Find which face is pointing up
    const upVector = new THREE.Vector3(0, 1, 0);
    const faceNormals = [
      new THREE.Vector3(0, 1, 0),  // Top - 6
      new THREE.Vector3(0, -1, 0), // Bottom - 1
      new THREE.Vector3(1, 0, 0),  // Right - 3
      new THREE.Vector3(-1, 0, 0), // Left - 4
      new THREE.Vector3(0, 0, 1),  // Front - 2
      new THREE.Vector3(0, 0, -1), // Back - 5
    ];

    const faceValues = [6, 1, 3, 4, 2, 5];

    let closestFace = 0;
    let maxDot = -1;

    faceNormals.forEach((normal, index) => {
      const worldNormal = normal.clone().applyQuaternion(mesh.quaternion);
      const dot = worldNormal.dot(upVector);
      if (dot > maxDot) {
        maxDot = dot;
        closestFace = index;
      }
    });

    return faceValues[closestFace];
  }

  private getOctahedronResult(mesh: THREE.Mesh): number {
    // Simplified - random for now, would need proper face detection
    return Math.floor(Math.random() * 8) + 1;
  }

  private getD10Result(mesh: THREE.Mesh): number {
    // Simplified - random for now
    return Math.floor(Math.random() * 10) + 1;
  }

  private getDodecahedronResult(mesh: THREE.Mesh): number {
    // Simplified - random for now
    return Math.floor(Math.random() * 12) + 1;
  }

  private getIcosahedronResult(mesh: THREE.Mesh): number {
    // Simplified - random for now
    return Math.floor(Math.random() * 20) + 1;
  }

  public removeDice(diceBody: DicePhysicsBody) {
    this.world.removeBody(diceBody.body);
    this.dice = this.dice.filter((d) => d !== diceBody);
  }

  public clearAllDice() {
    this.dice.forEach((diceBody) => {
      this.world.removeBody(diceBody.body);
    });
    this.dice = [];
  }

  public destroy() {
    this.clearAllDice();
  }
}
