// api.js

// Load Three.js dynamically
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

// Load Three.js and Cannon-es
loadScript('https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.min.js', () => {
  loadScript('https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.min.js', () => {
    loadScript('https://cdn.jsdelivr.net/npm/three@0.146.0/examples/js/controls/OrbitControls.js', () => {
      console.log('All scripts loaded!');
      initializeEngine();
    });
  });
});

// Initialize the engine after scripts are loaded
function initializeEngine() {
  // Core Engine
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

      // Add a grid helper
      const gridHelper = new THREE.GridHelper(20, 20);
      this.scene.add(gridHelper);

      // Add axes helper
      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);

      // Add lighting
      this.light = new THREE.DirectionalLight(0xffffff, 1);
      this.light.position.set(5, 5, 5);
      this.scene.add(this.light);

      this.world = new CANNON.World();
      this.world.gravity.set(0, -9.82, 0);

      this.objects = new Map(); // Track all objects in the scene
      this.selectedObject = null; // Currently selected object
    }

    addObject(object) {
      this.scene.add(object.mesh);
      if (object.body) this.world.addBody(object.body);
      this.objects.set(object.mesh.uuid, object);
    }

    selectObject(uuid) {
      if (this.selectedObject) {
        this.selectedObject.mesh.material.color.set(0x00ff00); // Reset color
      }
      this.selectedObject = this.objects.get(uuid);
      if (this.selectedObject) {
        this.selectedObject.mesh.material.color.set(0xff0000); // Highlight selected object
      }
    }

    changeObjectColor(color) {
      if (this.selectedObject) {
        this.selectedObject.mesh.material.color.set(color);
      }
    }

    changeBackgroundColor(color) {
      this.renderer.setClearColor(color);
    }

    handleResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
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

    onUpdate(callback) {
      this.updateCallbacks = this.updateCallbacks || [];
      this.updateCallbacks.push(callback);
      this.animate = (() => {
        const originalAnimate = this.animate.bind(this);
        return () => {
          originalAnimate();
          this.updateCallbacks.forEach(cb => cb());
        };
      })();
    }
  }

  // Asset Loading and Object Creation
  class ObjectLibrary {
    static createCube(size = 1, options = {}) {
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshBasicMaterial({ color: options.color || 0x00ff00 });
      const mesh = new THREE.Mesh(geometry, material);

      const body = new CANNON.Body({ mass: options.mass || 1 });
      body.addShape(new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2)));

      return { mesh, body };
    }

    static createSphere(radius = 1, options = {}) {
      const geometry = new THREE.SphereGeometry(radius);
      const material = new THREE.MeshBasicMaterial({ color: options.color || 0xff0000 });
      const mesh = new THREE.Mesh(geometry, material);

      const body = new CANNON.Body({ mass: options.mass || 1 });
      body.addShape(new CANNON.Sphere(radius));

      return { mesh, body };
    }

    static createCylinder(radius = 1, height = 2, options = {}) {
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
      const material = new THREE.MeshBasicMaterial({ color: options.color || 0x0000ff });
      const mesh = new THREE.Mesh(geometry, material);

      const body = new CANNON.Body({ mass: options.mass || 1 });
      body.addShape(new CANNON.Cylinder(radius, radius, height, 32));

      return { mesh, body };
    }

    static createCone(radius = 1, height = 2, options = {}) {
      const geometry = new THREE.ConeGeometry(radius, height, 32);
      const material = new THREE.MeshBasicMaterial({ color: options.color || 0xffff00 });
      const mesh = new THREE.Mesh(geometry, material);

      const body = new CANNON.Body({ mass: options.mass || 1 });
      body.addShape(new CANNON.Cylinder(0, radius, height, 32)); // Cone is a special case of cylinder

      return { mesh, body };
    }

    static createTorus(radius = 1, tube = 0.4, options = {}) {
      const geometry = new THREE.TorusGeometry(radius, tube, 16, 100);
      const material = new THREE.MeshBasicMaterial({ color: options.color || 0xff00ff });
      const mesh = new THREE.Mesh(geometry, material);

      const body = new CANNON.Body({ mass: options.mass || 1 });
      // Torus physics shape is not natively supported in Cannon.js, so we approximate it with a sphere
      body.addShape(new CANNON.Sphere(radius));

      return { mesh, body };
    }
  }

  // Export the API
  window.CorebellEngine = CorebellEngine;
  window.ObjectLibrary = ObjectLibrary;
}
