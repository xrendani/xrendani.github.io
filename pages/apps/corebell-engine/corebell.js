class Corebell {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with ID "${containerId}" not found.`);
    }

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initLighting();
    this.initGrid();

    this.objects = [];
    this.selectedObject = null;

    this.animate = this.animate.bind(this);
    window.addEventListener('resize', () => this.onWindowResize());

    this.animate();
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

  initControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement);
    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value;
    });
    this.scene.add(this.transformControls);

    window.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(10, 10, 10);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(this.directionalLight);
  }

  initGrid() {
    this.gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    this.scene.add(this.gridHelper);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onKeyDown(event) {
    if (!this.selectedObject) return;

    switch (event.key) {
      case 't': // Translate mode
        this.transformControls.setMode('translate');
        break;
      case 'r': // Rotate mode
        this.transformControls.setMode('rotate');
        break;
      case 's': // Scale mode
        this.transformControls.setMode('scale');
        break;
      case 'Delete': // Delete selected object
        this.deleteSelectedObject();
        break;
    }
  }

  addObject(type) {
    let geometry;
    const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });

    switch (type) {
      case 'cube':
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(0.5, 1, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
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
    this.selectedObject = object;
    this.transformControls.attach(object);
  }

  deleteSelectedObject() {
    if (!this.selectedObject) return;

    this.scene.remove(this.selectedObject);
    this.objects = this.objects.filter((obj) => obj !== this.selectedObject);
    this.transformControls.detach();
    this.selectedObject = null;
  }

  toggleGrid() {
    this.gridHelper.visible = !this.gridHelper.visible;
  }

  setLightIntensity(intensity) {
    this.directionalLight.intensity = intensity;
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize Corebell Engine
document.addEventListener('DOMContentLoaded', () => {
  const engine = new Corebell('viewport');

  // Sample UI interactions
  document.getElementById('addCube').addEventListener('click', () => engine.addObject('cube'));
  document.getElementById('addSphere').addEventListener('click', () => engine.addObject('sphere'));
  document.getElementById('toggleGrid').addEventListener('click', () => engine.toggleGrid());
  document.getElementById('setLight').addEventListener('input', (e) => engine.setLightIntensity(e.target.value));
});
