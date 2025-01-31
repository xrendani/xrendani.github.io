class Corebell {
  constructor(containerId) {
    this.canvas = document.getElementById(containerId);
    if (!this.canvas) {
      throw new Error(`Container with ID "${containerId}" not found.`);
    }

    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 1);

    this.initCamera();
    this.initLighting();
    this.initGrid();
    this.objects = [];
    this.selectedObject = null;

    window.addEventListener("resize", () => this.engine.resize());
    this.canvas.addEventListener("click", (event) => this.onClick(event));

    this.engine.runRenderLoop(() => this.scene.render());
  }

  initCamera() {
    this.camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 4,
      Math.PI / 3,
      10,
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    this.camera.attachControl(this.canvas, true);
  }

  initLighting() {
    this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
    this.light.intensity = 0.7;
  }

  initGrid() {
    this.grid = BABYLON.MeshBuilder.CreateGround("grid", { width: 20, height: 20 }, this.scene);
    this.grid.receiveShadows = true;
  }

  addObject(type) {
    let mesh;
    switch (type) {
      case "cube":
        mesh = BABYLON.MeshBuilder.CreateBox("cube", { size: 1 }, this.scene);
        break;
      case "sphere":
        mesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this.scene);
        break;
      case "cylinder":
        mesh = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 2, diameter: 1 }, this.scene);
        break;
      case "cone":
        mesh = BABYLON.MeshBuilder.CreateCylinder("cone", { height: 2, diameterTop: 0, diameterBottom: 1 }, this.scene);
        break;
      case "torus":
        mesh = BABYLON.MeshBuilder.CreateTorus("torus", { diameter: 1, thickness: 0.3 }, this.scene);
        break;
      default:
        console.error(`Unknown object type: ${type}`);
        return;
    }
    mesh.position.y = 1;
    mesh.material = new BABYLON.StandardMaterial("material", this.scene);
    mesh.material.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
    this.objects.push(mesh);
  }

  deleteSelectedObject() {
    if (!this.selectedObject) return;
    this.selectedObject.dispose();
    this.objects = this.objects.filter(obj => obj !== this.selectedObject);
    this.selectedObject = null;
  }

  onClick(event) {
    const pickResult = this.scene.pick(event.clientX, event.clientY);
    if (pickResult.hit) {
      this.selectedObject = pickResult.pickedMesh;
      console.log("Selected object:", this.selectedObject.name);
    }
  }
}

// Initialize Corebell
window.addEventListener("DOMContentLoaded", () => {
  const engine = new Corebell("viewport");

  document.getElementById("addCube").addEventListener("click", () => engine.addObject("cube"));
  document.getElementById("addSphere").addEventListener("click", () => engine.addObject("sphere"));
  document.getElementById("addCylinder").addEventListener("click", () => engine.addObject("cylinder"));
  document.getElementById("addCone").addEventListener("click", () => engine.addObject("cone"));
  document.getElementById("addTorus").addEventListener("click", () => engine.addObject("torus"));
  document.getElementById("deleteObject").addEventListener("click", () => engine.deleteSelectedObject());
});
