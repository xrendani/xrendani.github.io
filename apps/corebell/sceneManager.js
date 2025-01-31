class SceneManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with ID "${containerId}" not found.`);
    }

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLighting();
    this.initGrid();
    this.addGroundPlane();

    this.objects = [];
    this.selectedObjects = [];
    this.selectedObject = null;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1e1e1e);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(10, 10, 10);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
    this.pointLight.position.set(0, 10, 0);
    this.pointLight.castShadow = true;
    this.scene.add(this.pointLight);
  }

  initGrid() {
    this.gridHelper = new THREE.GridHelper(20, 20);
    this.scene.add(this.gridHelper);
  }

  addGroundPlane() {
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.5, roughness: 0.5 });
    this.groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);
  }

  addObject(type) {
    let geometry;
    const material = new THREE.MeshStandardMaterial({ color: 0x007bff });

    switch (type) {
      case "cube":
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case "cone":
        geometry = new THREE.ConeGeometry(0.5, 1, 32);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
        break;
      case "plane":
        geometry = new THREE.PlaneGeometry(2, 2);
        break;
      case "icosahedron":
        geometry = new THREE.IcosahedronGeometry(1, 0);
        break;
      case "dodecahedron":
        geometry = new THREE.DodecahedronGeometry(1, 0);
        break;
      case "tetrahedron":
        geometry = new THREE.TetrahedronGeometry(1, 0);
        break;
      default:
        console.error(`Unknown object type: ${type}`);
        return;
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.position.set(0, 1, 0);
    this.scene.add(mesh);

    this.objects.push(mesh);
    this.selectObject(mesh);
  }

  selectObject(object) {
    if (this.selectedObject) {
      this.selectedObject.material = this.selectedObject.originalMaterial; // Reset previous selection
    }

    this.selectedObject = object;
    this.selectedObjects = [object]; // Update selected objects array

    if (object) {
      object.originalMaterial = object.material; // Store original material
      const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, transparent: true, opacity: 0.5 });
      object.material = highlightMaterial;
    }
  }

  deleteSelectedObject() {
    if (!this.selectedObject) return;

    // Dispose of geometry and material to avoid memory leaks
    this.selectedObject.geometry.dispose();
    this.selectedObject.material.dispose();

    this.scene.remove(this.selectedObject);
    this.objects = this.objects.filter((obj) => obj !== this.selectedObject);
    this.selectedObject = null;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}

export default SceneManager;
