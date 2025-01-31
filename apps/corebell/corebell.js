class Corebell {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas with ID "${canvasId}" not found.`);
    }

    // Initialize Babylon Engine and Scene
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 1);

    // Setup camera
    this.camera = new BABYLON.ArcRotateCamera(
      "Camera",
      Math.PI / 4,
      Math.PI / 3,
      10,
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    this.camera.attachControl(this.canvas, true);

    // Setup Hemispheric light
    this.light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
    this.light.intensity = 1;

    // Create ground and grid
    this.createGround();
    this.createGrid();

    // Array to store added objects
    this.objects = [];
    this.selectedObject = null;

    // Pointer event for selecting objects
    this.scene.onPointerObservable.add((evt) => {
      if (evt.type === BABYLON.PointerEventTypes.POINTERPICK) {
        const pickResult = evt.pickInfo;
        if (pickResult.hit && pickResult.pickedMesh && this.objects.includes(pickResult.pickedMesh)) {
          this.selectedObject = pickResult.pickedMesh;
          console.log("Selected object:", this.selectedObject.name);
        }
      }
    });

    // Run the render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // Handle browser resize
    window.addEventListener("resize", () => this.engine.resize());
  }

  createGround() {
    // Create a large ground plane
    this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, this.scene);
    const groundMat = new BABYLON.StandardMaterial("groundMat", this.scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    this.ground.material = groundMat;
  }

  createGrid() {
    // Create a simple grid using lines
    const size = 20;
    const divisions = 20;
    const lines = [];
    const half = size / 2;
    const step = size / divisions;

    for (let i = 0; i <= divisions; i++) {
      let p = -half + i * step;
      // Vertical line
      lines.push([
        new BABYLON.Vector3(p, 0.02, -half),
        new BABYLON.Vector3(p, 0.02, half)
      ]);
      // Horizontal line
      lines.push([
        new BABYLON.Vector3(-half, 0.02, p),
        new BABYLON.Vector3(half, 0.02, p)
      ]);
    }

    this.gridLines = [];
    lines.forEach((linePoints, index) => {
      let gridLine = BABYLON.MeshBuilder.CreateLines("gridLine" + index, { points: linePoints }, this.scene);
      gridLine.color = new BABYLON.Color3(0.5, 0.5, 0.5);
      this.gridLines.push(gridLine);
    });
    this.gridVisible = true;
  }

  toggleGrid() {
    // Toggle visibility of the grid lines
    this.gridVisible = !this.gridVisible;
    this.gridLines.forEach((line) => {
      line.setEnabled(this.gridVisible);
    });
  }

  setLightIntensity(value) {
    this.light.intensity = parseFloat(value);
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
        mesh = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 1.5, diameter: 1 }, this.scene);
        break;
      case "cone":
        mesh = BABYLON.MeshBuilder.CreateCylinder("cone", { height: 1.5, diameterTop: 0, diameterBottom: 1 }, this.scene);
        break;
      case "torus":
        mesh = BABYLON.MeshBuilder.CreateTorus("torus", { diameter: 1, thickness: 0.3 }, this.scene);
        break;
      default:
        console.error(`Unknown object type: ${type}`);
        return;
    }
    // Raise object slightly above the ground
    mesh.position.y = 0.5;

    // Apply a simple material
    const mat = new BABYLON.StandardMaterial("mat", this.scene);
    mat.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
    mesh.material = mat;

    this.objects.push(mesh);
  }

  deleteSelectedObject() {
    if (!this.selectedObject) return;
    this.selectedObject.dispose();
    this.objects = this.objects.filter((obj) => obj !== this.selectedObject);
    this.selectedObject = null;
  }

  saveScene() {
    // Save scene objects (only name, type, and position for simplicity)
    const sceneData = this.objects.map((mesh) => {
      return {
        type: mesh.name, // assuming the mesh name corresponds to the type
        position: mesh.position.asArray(),
      };
    });
    const json = JSON.stringify(sceneData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scene.json";
    a.click();
  }

  loadScene(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const sceneData = JSON.parse(event.target.result);
        // Clear current objects
        this.objects.forEach((mesh) => mesh.dispose());
        this.objects = [];
        // Load objects from scene data
        sceneData.forEach((item) => {
          this.addObject(item.type);
          const mesh = this.objects[this.objects.length - 1];
          mesh.position = BABYLON.Vector3.FromArray(item.position);
        });
      } catch (error) {
        console.error("Error loading scene:", error);
      }
    };
    reader.readAsText(file);
  }
}

// Initialize the engine when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  window.engine = new Corebell("renderCanvas");
});
