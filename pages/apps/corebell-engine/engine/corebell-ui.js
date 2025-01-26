// corebell-ui.js
class CorebellUI {
  constructor(engine) {
    this.engine = engine;
    this.toolbar = this.createToolbar();
    this.controls = this.createControls();
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

    toolbar.appendChild(addCubeButton);
    toolbar.appendChild(addSphereButton);
    document.body.appendChild(toolbar);

    return toolbar;
  }

  createControls() {
    const controls = document.createElement('div');
    controls.className = 'controls';

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
