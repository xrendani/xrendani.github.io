// corebell-ui.js
class CorebellUI {
  constructor(engine) {
    this.engine = engine;
    this.toolbar = this.createToolbar();
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

    const addCubeButton = document.createElement('button');
    addCubeButton.innerText = 'Add Cube';
    addCubeButton.onclick = () => {
      const cube = ObjectLibrary.createCube();
      this.engine.addObject(cube);
    };

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
}

export default CorebellUI;
