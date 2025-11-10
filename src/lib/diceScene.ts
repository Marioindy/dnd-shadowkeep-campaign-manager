import * as THREE from 'three';
import { DiceType } from '@/types';

export class DiceSceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 15);
    this.camera.lookAt(0, 0, 0);

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.directionalLight.position.set(5, 10, 5);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(this.directionalLight);

    // Add ground plane
    this.createGround();
  }

  private createGround() {
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d2d44,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Add a subtle grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x444466, 0x333344);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);
  }

  public createDiceMesh(diceType: DiceType, color?: number): THREE.Mesh {
    let geometry: THREE.BufferGeometry;
    const diceColor = color || this.getDiceColor(diceType);

    switch (diceType) {
      case 'd4':
        geometry = new THREE.TetrahedronGeometry(1);
        break;
      case 'd6':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'd8':
        geometry = new THREE.OctahedronGeometry(1);
        break;
      case 'd10':
      case 'd100':
        geometry = this.createD10Geometry();
        break;
      case 'd12':
        geometry = new THREE.DodecahedronGeometry(1);
        break;
      case 'd20':
        geometry = new THREE.IcosahedronGeometry(1);
        break;
      default:
        geometry = new THREE.IcosahedronGeometry(1);
    }

    // Create material with some shine
    const material = new THREE.MeshStandardMaterial({
      color: diceColor,
      roughness: 0.3,
      metalness: 0.5,
      emissive: diceColor,
      emissiveIntensity: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Add numbers to the dice
    this.addDiceNumbers(mesh, diceType);

    this.scene.add(mesh);
    return mesh;
  }

  private createD10Geometry(): THREE.BufferGeometry {
    // Create a pentagonal trapezohedron (d10 shape)
    // For simplicity, using an octahedron with stretched vertices
    const geometry = new THREE.OctahedronGeometry(1);
    const positions = geometry.attributes.position;

    // Stretch vertices to create d10 shape
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      positions.setY(i, y * 1.2);
    }

    return geometry;
  }

  private getDiceColor(diceType: DiceType): number {
    // Different colors for different dice types
    const colors: Record<DiceType, number> = {
      d4: 0xff6b6b,    // Red
      d6: 0x4ecdc4,    // Cyan
      d8: 0xffe66d,    // Yellow
      d10: 0xa8e6cf,   // Green
      d12: 0xffd93d,   // Gold
      d20: 0x8b5cf6,   // Purple (matches theme)
      d100: 0xff6fb5,  // Pink
    };

    return colors[diceType] || 0x8b5cf6;
  }

  private addDiceNumbers(mesh: THREE.Mesh, diceType: DiceType) {
    // Create a canvas for the texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Draw number on canvas
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Get max number for this dice type
    const maxNumber = parseInt(diceType.substring(1));

    // For now, just add the max number
    // In production, you'd create textures for all faces
    ctx.fillText(maxNumber.toString(), 128, 128);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Add as a decal or second material (simplified version)
    // In production, you'd use proper UV mapping or decals
  }

  public removeDiceMesh(mesh: THREE.Mesh) {
    this.scene.remove(mesh);
    mesh.geometry.dispose();
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => material.dispose());
    } else {
      mesh.material.dispose();
    }
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose() {
    this.renderer.dispose();
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
}
