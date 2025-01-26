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

      // Post-processing
      this.composer = new THREE.EffectComposer(this.renderer);
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

      // Bloom effect
      const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
      this.composer.addPass(bloomPass);

      this.world = new CANNON.World();
      this.world.gravity.set(0, -9.82, 0);

      this.objects = []; // Track all objects in the scene
      this.selectedObject = null; // Currently selected object
      this.history = []; // Undo/redo history
    }

    addObject(object) {
      this.scene.add(object.mesh);
      if (object.body) this.world.addBody(object.body);
      this.objects.push(object);
      this.history.push({ type: 'add', object });
    }

    removeObject(object) {
      this.scene.remove(object.mesh);
      if (object.body) this.world.removeBody(object.body);
      this.objects = this.objects.filter(obj => obj !== object);
      this.history.push({ type: 'remove', object });
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

    undo() {
      const action = this.history.pop();
      if (action) {
        if (action.type === 'add') {
          this.removeObject(action.object);
        } else if (action.type === 'remove') {
          this.addObject(action.object);
        }
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

      // Render with post-processing
      this.composer.render();
    }
  }

  // Asset Loading and Object Creation
  class ObjectLibrary {
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

    static createCylinder(radius = 1, height = 2, color = 0x0000ff) {
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);

      const body = new CANNON.Body({ mass: 1 });
      body.addShape(new CANNON.Cylinder(radius, radius, height, 32));

      return { mesh, body };
    }

    static createCone(radius = 1, height = 2, color = 0xffff00) {
      const geometry = new THREE.ConeGeometry(radius, height, 32);
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);

      const body = new CANNON.Body({ mass: 1 });
      body.addShape(new CANNON.Cylinder(0, radius, height, 32)); // Cone is a special case of cylinder

      return { mesh, body };
    }

    static createTorus(radius = 1, tube = 0.4, color = 0xff00ff) {
      const geometry = new THREE.TorusGeometry(radius, tube, 16, 100);
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);

      const body = new CANNON.Body({ mass: 1 });
      // Torus physics shape is not natively supported in Cannon.js, so we approximate it with a sphere
      body.addShape(new CANNON.Sphere(radius));

      return { mesh, body };
    }
  }

  // UI Controls
  class CorebellUI {
    constructor(engine) {
      this.engine = engine;
      this.toolbar = this.createToolbar();
      this.controls = this.createControls();
      this.propertiesPanel = this.createPropertiesPanel();
    }

    createToolbar() {
      const toolbar = document.createElement('div');
      toolbar.className = 'toolbar';

      // Add Cube Button
      const addCubeButton = document.createElement('button');
      addCubeButton.innerText = 'Add Cube';
      addCubeButton.onclick = () => {
        const cube = ObjectLibrary.createCube();
        this.engine.addObject(cube);
      };

      // Add Sphere Button
      const addSphereButton = document.createElement('button');
      addSphereButton.innerText = 'Add Sphere';
      addSphereButton.onclick = () => {
        const sphere = ObjectLibrary.createSphere();
        this.engine.addObject(sphere);
      };

      // Add Cylinder Button
      const addCylinderButton = document.createElement('button');
      addCylinderButton.innerText = 'Add Cylinder';
      addCylinderButton.onclick = () => {
        const cylinder = ObjectLibrary.createCylinder();
        this.engine.addObject(cylinder);
      };

      // Add Cone Button
      const addConeButton = document.createElement('button');
      addConeButton.innerText = 'Add Cone';
      addConeButton.onclick = () => {
        const cone = ObjectLibrary.createCone();
        this.engine.addObject(cone);
      };

      // Add Torus Button
      const addTorusButton = document.createElement('button');
      addTorusButton.innerText = 'Add Torus';
      addTorusButton.onclick = () => {
        const torus = ObjectLibrary.createTorus();
        this.engine.addObject(torus);
      };

      toolbar.appendChild(addCubeButton);
      toolbar.appendChild(addSphereButton);
      toolbar.appendChild(addCylinderButton);
      toolbar.appendChild(addConeButton);
      toolbar.appendChild(addTorusButton);
      document.body.appendChild(toolbar);

      return toolbar;
    }

    createControls() {
      const controls = document.createElement('div');
      controls.className = 'controls';

      // Move Object Button
      const moveButton = document.createElement('button');
      moveButton.innerText = 'Move';
      moveButton.onclick = () => {
        if (this.engine.selectedObject) {
          this.engine.selectedObject.body.position.x += 1; // Move right
        }
      };

      // Rotate Object Button
      const rotateButton = document.createElement('button');
      rotateButton.innerText = 'Rotate';
      rotateButton.onclick = () => {
        if (this.engine.selectedObject) {
          this.engine.selectedObject.body.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0), // Rotate around Y-axis
            Math.PI / 4 // 45 degrees
          );
        }
      };

      // Scale Object Button
      const scaleButton = document.createElement('button');
      scaleButton.innerText = 'Scale';
      scaleButton.onclick = () => {
        if (this.engine.selectedObject) {
          this.engine.selectedObject.mesh.scale.set(1.5, 1.5, 1.5); // Scale up by 50%
        }
      };

      // Undo Button
      const undoButton = document.createElement('button');
      undoButton.innerText = 'Undo';
      undoButton.onclick = () => {
        this.engine.undo();
      };

      controls.appendChild(moveButton);
      controls.appendChild(rotateButton);
      controls.appendChild(scaleButton);
      controls.appendChild(undoButton);
      document.body.appendChild(controls);

      return controls;
    }

    createPropertiesPanel() {
      const panel = document.createElement('div');
      panel.className = 'properties-panel';
      panel.style.position = 'absolute';
      panel.style.top = '120px';
      panel.style.left = '10px';
      panel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      panel.style.padding = '10px';
      panel.style.borderRadius = '5px';
      panel.style.color = 'white';
      panel.style.zIndex = '1';

      const title = document.createElement('h3');
      title.innerText = 'Object Properties';
      panel.appendChild(title);

      const positionLabel = document.createElement('label');
      positionLabel.innerText = 'Position: ';
      panel.appendChild(positionLabel);

      const positionInput = document.createElement('input');
      positionInput.type = 'text';
      positionInput.disabled = true;
      panel.appendChild(positionInput);

      document.body.appendChild(panel);
      return panel;
    }
  }

  // Utilities (Raycasting)
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
        const selectedObject = this.engine.objects.find(obj => obj.mesh === intersects[0].object);
        this.engine.selectObject(selectedObject);
      } else {
        this.engine.selectObject(null); // Deselect if no object is clicked
      }
    }
  }

  // Export the API
  window.CorebellEngine = CorebellEngine;
  window.ObjectLibrary = ObjectLibrary;
  window.CorebellUI = CorebellUI;
  window.RaycasterHelper = RaycasterHelper;
}
