// corebell-ui.js
export default class CorebellUI {
  constructor(engine) {
    this.engine = engine;
    this.toolbar = this.createToolbar();
    this.lightControls = this.createLightControls();
  }

  createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.style.position = 'absolute';
    toolbar.style.top = '10px';
    toolbar.style.left = '10px';
    toolbar.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toolbar.style.padding = '10px';
    toolbar.style.borderRadius = '5px';
    toolbar.style.color = 'white';

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

    // Move Object Button
    const moveButton = document.createElement('button');
    moveButton.innerText = 'Move';
    moveButton.onclick = () => {
      if (this.engine.selectedObject) {
        this.engine.selectedObject.body.position.x += 1; // Move right
      }
    };

    toolbar.appendChild(addCubeButton);
    toolbar.appendChild(addSphereButton);
    toolbar.appendChild(moveButton);
    document.body.appendChild(toolbar);

    return toolbar;
  }

  createLightControls() {
    const controls = document.createElement('div');
    controls.style.position = 'absolute';
    controls.style.top = '10px';
    controls.style.right = '10px';
    controls.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    controls.style.padding = '10px';
    controls.style.borderRadius = '5px';
    controls.style.color = 'white';

    // Light Intensity Slider
    const intensityLabel = document.createElement('label');
    intensityLabel.innerText = 'Light Intensity: ';
    const intensitySlider = document.createElement('input');
    intensitySlider.type = 'range';
    intensitySlider.min = 0;
    intensitySlider.max = 2;
    intensitySlider.step = 0.1;
    intensitySlider.value = 1;
    intensitySlider.oninput = (e) => {
      const light = this.engine.scene.children.find(child => child instanceof THREE.DirectionalLight);
      if (light) light.intensity = e.target.value;
    };

    controls.appendChild(intensityLabel);
    controls.appendChild(intensitySlider);
    document.body.appendChild(controls);

    return controls;
  }
}
