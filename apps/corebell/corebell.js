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

    // Gizmo Manager for transform controls
    this.gizmoManager = new BABYLON.GizmoManager(this.scene);
    this.gizmoManager.positionGizmoEnabled = true;
    this.gizmoManager.rotationGizmoEnabled = false;
    this.gizmoManager.scaleGizmoEnabled = false;
    this.currentGizmoMode = "translate";

    // Arrays for objects and selection
    this.objects = [];
    this.selectedObject = null;

    // Pointer event for selecting objects
    this.scene.onPointerObservable.add((evt) => {
      if (evt.type === BABYLON.PointerEventTypes.POINTERPICK) {
        const pickResult = evt.pickInfo;
        if (pickResult.hit && pickResult.pickedMesh && this.objects.includes(pickResult.pickedMesh)) {
          this.selectObject(pickResult.pickedMesh);
        }
      }
    });

    // Keyboard shortcuts for gizmo modes
    window.addEventListener("keydown", (evt) => {
      if (evt.key === "t" || evt.key === "T") {
        this.setGizmoMode("translate");
      } else if (evt.key === "r" || evt.key === "R") {
        this.setGizmoMode("rotate");
      } else if (evt.key === "s" || evt.key === "S") {
        this.setGizmoMode("scale");
      } else if (evt.key === "Delete") {
        this.deleteSelectedObject();
      }
    });

    // Render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    // Handle browser resize
    window.addEventListener("resize", () => this.engine.resize());
  }

  createGround() {
    this.ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, this.scene);
    const groundMat = new BABYLON.StandardMaterial("groundMat", this.scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    this.ground.material = groundMat;
  }

  createGrid() {
    const size = 20;
    const divisions = 20;
    const lines = [];
    const half = size / 2;
    const step = size / divisions;

    for (let i = 0; i <= divisions; i++) {
      let p = -half + i * step;
      lines.push([
        new BABYLON.Vector3(p, 0.02, -half),
        new BABYLON.Vector3(p, 0.02, half)
      ]);
      lines.push([
        new BABYLON.Vector3(-half, 0.02, p),
        new BABYLON.Vector3(half, 0.02, p)
      ]);
    }

    this.gridLines = [];
    lines.forEach((pts, idx) => {
      const line = BABYLON.MeshBuilder.CreateLines("gridLine" + idx, { points: pts }, this.scene);
      line.color = new BABYLON.Color3(0.5, 0.5, 0.5);
      this.gridLines.push(line);
    });
    this.gridVisible = true;
  }

  toggleGrid() {
    this.gridVisible = !this.gridVisible;
    this.gridLines.forEach(line => line.setEnabled(this.gridVisible));
  }

  setGizmoMode(mode) {
    this.currentGizmoMode = mode;
    this.gizmoManager.positionGizmoEnabled = mode === "translate";
    this.gizmoManager.rotationGizmoEnabled = mode === "rotate";
    this.gizmoManager.scaleGizmoEnabled = mode === "scale";
  }

  addObject(type) {
    let mesh;
    if (type === "cube") {
      mesh = BABYLON.MeshBuilder.CreateBox("cube", { size: 1 }, this.scene);
    } else if (type === "sphere") {
      mesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this.scene);
    }
    if (mesh) {
      mesh.position.y = 0.5;
      this.objects.push(mesh);
      this.selectObject(mesh);
    }
  }

  selectObject(mesh) {
    this.selectedObject = mesh;
    this.gizmoManager.attachToMesh(mesh);
  }

  deleteSelectedObject() {
    if (!this.selectedObject) return;
    this.selectedObject.dispose();
    this.objects = this.objects.filter(obj => obj !== this.selectedObject);
    this.selectedObject = null;
    this.gizmoManager.attachToMesh(null);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.engine = new Corebell("renderCanvas");
});
