// corebell-utils.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.module.js';

class RaycasterHelper {
  constructor(engine) {
    this.engine = engine;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener('click', (event) => this.onClick(event));
  }

  onClick(event) {
    // Convert mouse position to normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast from the camera
    this.raycaster.setFromCamera(this.mouse, this.engine.camera);
    const intersects = this.raycaster.intersectObjects(this.engine.scene.children);

    if (intersects.length > 0) {
      console.log('Clicked on:', intersects[0].object);
    }
  }
}

export { RaycasterHelper };
