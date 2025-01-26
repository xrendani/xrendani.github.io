// corebell-core.js
class CorebellEngine {
  constructor(viewport) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    viewport.appendChild(this.renderer.domElement);

    // Add OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Smooth camera movement
    this.controls.dampingFactor = 0.05;

    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);

    this.objects = []; // Track all objects in the scene
    this.selectedObject = null; // Currently selected object
  }

  addObject(object) {
    this.scene.add(object.mesh);
    if (object.body) this.world.addBody(object.body);
    this.objects.push(object);
  }

  selectObject(object) {
    if (this.selectedObject) {
      this.selectedObject.mesh.material.color.set(0x00ff00); // Reset color
    }
    this.selectedObject = object;
    if (this.selectedObject) {
      this.selectedObject.mesh.material.color.set(0xff0000); // Highlight selected object
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update OrbitControls
    this.controls.update();

    // Update physics
    this.world.step(1 / 60);

    // Sync physics and rendering
    this.objects.forEach(obj => {
      if (obj.body && obj.mesh) {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}
