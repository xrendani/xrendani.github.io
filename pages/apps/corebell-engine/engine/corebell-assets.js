// corebell-assets.js
export class AssetLoader {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.gltfLoader = new THREE.GLTFLoader();
  }

  loadTexture(url) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(url, resolve, undefined, reject);
    });
  }

  loadModel(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(url, resolve, undefined, reject);
    });
  }
}

export class ObjectLibrary {
  static createCube(size = 1, color = 0x00ff00) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    const body = new CANNON.Body({ mass: 1 });
    body.addShape(new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2)));

    return { mesh, body };
  }

  static createSphere(radius = 1, color = 0xff0000) {
    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    const body = new CANNON.Body({ mass: 1 });
    body.addShape(new CANNON.Sphere(radius));

    return { mesh, body };
  }
}
