// corebell-utils.js
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
