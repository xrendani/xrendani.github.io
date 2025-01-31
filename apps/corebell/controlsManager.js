class ControlsManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.initControls();
  }

  initControls() {
    this.orbitControls = new THREE.OrbitControls(this.sceneManager.camera, this.sceneManager.renderer.domElement);
    this.orbitControls.enableDamping = true;

    this.transformControls = new THREE.TransformControls(this.sceneManager.camera, this.sceneManager.renderer.domElement);
    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.orbitControls.enabled = !event.value;
    });
    this.sceneManager.scene.add(this.transformControls);

    window.addEventListener("keydown", (event) => this.onKeyDown(event));
    this.sceneManager.container.addEventListener("click", (event) => this.onClick(event));
  }

  onClick(event) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.sceneManager.camera);

    const intersects = raycaster.intersectObjects(this.sceneManager.objects);
    if (intersects.length > 0) {
      const object = intersects[0].object;

      if (event.shiftKey) {
        // Add to selection
        if (!this.sceneManager.selectedObjects.includes(object)) {
          this.sceneManager.selectedObjects.push(object);
        }
      } else {
        // Single selection
        this.sceneManager.selectedObjects = [object];
      }

      this.sceneManager.selectObject(object);
    }
  }

  onKeyDown(event) {
    if (!this.sceneManager.selectedObject) return;

    switch (event.key) {
      case "t":
        this.transformControls.setMode("translate");
        break;
      case "r":
        this.transformControls.setMode("rotate");
        break;
      case "s":
        this.transformControls.setMode("scale");
        break;
      case "Delete":
        this.sceneManager.deleteSelectedObject();
        break;
    }
  }
}

export default ControlsManager;
