// Corebell Engine - Enhanced Version 2.0
class Corebell {
    constructor(containerId, options = {}) {
        this.options = {
            defaultColor: new BABYLON.Color4(0.1, 0.1, 0.1, 1),
            gravity: new BABYLON.Vector3(0, -9.81, 0),
            cameraPosition: new BABYLON.Vector3(0, 1, 0),
            ...options
        };

        this.initializeEngine(containerId);
        this.setupCore();
        this.setupEventListeners();
        this.startRenderLoop();
    }

    initializeEngine(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID "${containerId}" not found.`);
        }

        this.engine = new BABYLON.Engine(this.container, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = this.options.defaultColor;
    }

    setupCore() {
        this.objects = new Map();
        this.selectedObject = null;
        this.isGridVisible = false;
        
        this.initCamera();
        this.initLighting();
        this.initPhysics();
        this.initControls();
        this.initAudio();
        this.initGizmos();
    }

    initCamera() {
        this.camera = new BABYLON.ArcRotateCamera(
            "mainCamera",
            Math.PI / 4,
            Math.PI / 3,
            10,
            this.options.cameraPosition,
            this.scene
        );
        this.camera.attachControl(this.container, true);
        this.camera.wheelPrecision = 50;
        this.camera.pinchPrecision = 50;
        this.camera.lowerRadiusLimit = 2;
        this.camera.upperRadiusLimit = 50;
    }

    initLighting() {
        this.light = new BABYLON.HemisphericLight(
            "mainLight",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        this.light.intensity = 0.8;
        
        // Add shadows
        this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.light);
        this.shadowGenerator.useBlurExponentialShadowMap = true;
    }

    initPhysics() {
        const gravityVector = this.options.gravity;
        const physicsPlugin = new BABYLON.CannonJSPlugin();
        this.scene.enablePhysics(gravityVector, physicsPlugin);
    }

    initControls() {
        this.scene.onPointerDown = (evt) => {
            const pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
            if (pickResult.hit) {
                this.selectObject(pickResult.pickedMesh);
            } else {
                this.deselectObject();
            }
        };

        // Key bindings
        const keyBindings = new Map([
            ['Delete', () => this.deleteSelectedObject()],
            ['r', () => this.toggleRotateMode()],
            ['g', () => this.toggleGrid()],
            ['Escape', () => this.deselectObject()]
        ]);

        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        window.addEventListener("keydown", (evt) => {
            const action = keyBindings.get(evt.key);
            if (action) action();
        });
    }

    initGizmos() {
        this.gizmoManager = new BABYLON.GizmoManager(this.scene);
        this.gizmoManager.positionGizmoEnabled = true;
        this.gizmoManager.rotationGizmoEnabled = true;
        this.gizmoManager.scaleGizmoEnabled = true;
        this.gizmoManager.attachToMesh(null);
    }

    initAudio() {
        this.audioEngine = new BABYLON.AudioEngine();
        this.sounds = new Map();
    }

    addObject(type, options = {}) {
        const defaultOptions = {
            size: 1,
            position: new BABYLON.Vector3(0, 1, 0),
            material: new BABYLON.StandardMaterial(`material_${Date.now()}`, this.scene)
        };

        const finalOptions = { ...defaultOptions, ...options };
        let mesh;

        const meshBuilders = {
            cube: () => BABYLON.MeshBuilder.CreateBox("box", { size: finalOptions.size }, this.scene),
            sphere: () => BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: finalOptions.size }, this.scene),
            cylinder: () => BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: finalOptions.size, diameter: finalOptions.size }, this.scene),
            plane: () => BABYLON.MeshBuilder.CreateGround("ground", { width: finalOptions.size * 5, height: finalOptions.size * 5 }, this.scene),
            torus: () => BABYLON.MeshBuilder.CreateTorus("torus", { diameter: finalOptions.size, thickness: finalOptions.size * 0.3 }, this.scene)
        };

        const builder = meshBuilders[type];
        if (!builder) {
            throw new Error(`Unknown object type: ${type}`);
        }

        mesh = builder();
        mesh.position = finalOptions.position;
        mesh.material = finalOptions.material;

        // Add physics
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1, restitution: 0.5 },
            this.scene
        );

        // Enable shadows
        mesh.receiveShadows = true;
        this.shadowGenerator.getShadowMap().renderList.push(mesh);

        this.objects.set(mesh.id, mesh);
        return mesh;
    }

    toggleGrid() {
        if (this.isGridVisible) {
            if (this.grid) {
                this.grid.dispose();
                this.grid = null;
            }
        } else {
            this.grid = BABYLON.MeshBuilder.CreateGround(
                "grid",
                { width: 20, height: 20, subdivisions: 20 },
                this.scene
            );
            const gridMaterial = new BABYLON.GridMaterial("gridMaterial", this.scene);
            gridMaterial.mainColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            gridMaterial.lineColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            this.grid.material = gridMaterial;
        }
        this.isGridVisible = !this.isGridVisible;
    }

    selectObject(mesh) {
        this.deselectObject();
        if (mesh && mesh !== this.grid) {
            this.selectedObject = mesh;
            this.gizmoManager.attachToMesh(mesh);
            mesh.showBoundingBox = true;
        }
    }

    deselectObject() {
        if (this.selectedObject) {
            this.selectedObject.showBoundingBox = false;
            this.selectedObject = null;
            this.gizmoManager.attachToMesh(null);
        }
    }

    deleteSelectedObject() {
        if (this.selectedObject) {
            this.objects.delete(this.selectedObject.id);
            this.selectedObject.dispose();
            this.deselectObject();
        }
    }

    setLightIntensity(value) {
        this.light.intensity = parseFloat(value);
    }

    async saveScene() {
        const serializedScene = BABYLON.SceneSerializer.Serialize(this.scene);
        const json = JSON.stringify(serializedScene, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'scene.json',
                types: [{
                    description: 'JSON Files',
                    accept: { 'application/json': ['.json'] },
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } catch (err) {
            // Fallback for browsers that don't support File System Access API
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "scene.json";
            link.click();
        }
    }

    async loadScene(file) {
        try {
            const content = await file.text();
            BABYLON.SceneLoader.Load("", "data:text/json," + content, this.engine, (scene) => {
                this.scene.dispose();
                this.scene = scene;
                this.setupCore();
            });
        } catch (err) {
            console.error("Error loading scene:", err);
            alert("Error loading scene. Please check the file format.");
        }
    }

    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    dispose() {
        this.engine.dispose();
        window.removeEventListener("resize", this.engine.resize);
    }
}
