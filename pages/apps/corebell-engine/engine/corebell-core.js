// corebell-core.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.min.js';

class CorebellEngine {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);

    this.objects = []; // Track all objects in the scene
  }

  addObject(object) {
    this.scene.add(object.mesh);
    if (object.body) this.world.addBody(object.body);
    this.objects.push(object);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

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

export default CorebellEngine;
