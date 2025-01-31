import SceneManager from './sceneManager.js';
import ControlsManager from './controlsManager.js';
import PostProcessing from './postProcessing.js';

class Corebell {
  constructor(containerId) {
    this.sceneManager = new SceneManager(containerId);
    this.controlsManager = new ControlsManager(this.sceneManager);
    this.postProcessing = new PostProcessing(this.sceneManager);

    this.animate = this.animate.bind(this);
    window.addEventListener("resize", () => this.sceneManager.onWindowResize());
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.postProcessing.render();
  }
}

// Initialize Corebell
document.addEventListener("DOMContentLoaded", () => {
  const engine = new Corebell("viewport");

  document.getElementById("addCube").addEventListener("click", () => engine.sceneManager.addObject("cube"));
  document.getElementById("addSphere").addEventListener("click", () => engine.sceneManager.addObject("sphere"));
  document.getElementById("addCylinder").addEventListener("click", () => engine.sceneManager.addObject("cylinder"));
  document.getElementById("addCone").addEventListener("click", () => engine.sceneManager.addObject("cone"));
  document.getElementById("addTorus").addEventListener("click", () => engine.sceneManager.addObject("torus"));
  document.getElementById("addIcosahedron").addEventListener("click", () => engine.sceneManager.addObject("icosahedron"));
  document.getElementById("addDodecahedron").addEventListener("click", () => engine.sceneManager.addObject("dodecahedron"));
  document.getElementById("addTetrahedron").addEventListener("click", () => engine.sceneManager.addObject("tetrahedron"));
  document.getElementById("toggleGrid").addEventListener("click", () => (engine.sceneManager.gridHelper.visible = !engine.sceneManager.gridHelper.visible));
  document.getElementById("deleteObject").addEventListener("click", () => engine.sceneManager.deleteSelectedObject());
  document.getElementById("lightIntensity").addEventListener("input", (e) => {
    engine.sceneManager.directionalLight.intensity = parseFloat(e.target.value);
  });

  // Save/Load functionality
  document.getElementById("saveScene").addEventListener("click", () => engine.sceneManager.saveScene());
  document.getElementById("loadSceneInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) engine.sceneManager.loadScene(file);
  });
});
