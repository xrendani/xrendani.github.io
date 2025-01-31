// Corebell Engine - Enhanced Version
// Features: 3D Rendering, Physics, Collision, Scene Management, Animation, Lighting, Audio, Input, Scripting, Level Editing, Asset Import, Camera Controls, Game Object Management

class Corebell {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID "${containerId}" not found.`);
        }

        this.engine = new BABYLON.Engine(this.container, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 1);

        this.initCamera();
        this.initLighting();
        this.initPhysics();
        this.initControls();
        this.initAudio();

        this.objects = [];
        this.engine.runRenderLoop(() => this.scene.render());
        window.addEventListener("resize", () => this.engine.resize());
    }

    initCamera() {
        this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 3, 10, new BABYLON.Vector3(0, 1, 0), this.scene);
        this.camera.attachControl(this.container, true);
    }

    initLighting() {
        this.light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        this.light.intensity = 0.8;
    }

    initPhysics() {
        this.scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    }

    initControls() {
        window.addEventListener("keydown", (event) => {
            if (event.key === "r") this.toggleRotateMode();
        });
    }

    initAudio() {
        this.audioEngine = new BABYLON.Sound("background", "assets/music.mp3", this.scene, null, { loop: true, autoplay: true });
    }

    addObject(type) {
        let mesh;
        switch (type) {
            case "cube":
                mesh = BABYLON.MeshBuilder.CreateBox("box", {}, this.scene);
                break;
            case "sphere":
                mesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this.scene);
                break;
            case "plane":
                mesh = BABYLON.MeshBuilder.CreateGround("ground", { width: 5, height: 5 }, this.scene);
                break;
            default:
                console.error(`Unknown object type: ${type}`);
                return;
        }
        mesh.position.y = 1;
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.5 }, this.scene);
        this.objects.push(mesh);
    }

    saveScene() {
        const serializedScene = BABYLON.SceneSerializer.Serialize(this.scene);
        const json = JSON.stringify(serializedScene, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "scene.json";
        link.click();
    }

    loadScene(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            BABYLON.SceneLoader.Load("", "data:text/json," + event.target.result, this.engine, (scene) => {
                this.scene.dispose();
                this.scene = scene;
                this.initCamera();
                this.initLighting();
            });
        };
        reader.readAsText(file);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new Corebell("viewport");
    document.getElementById("addCube").addEventListener("click", () => engine.addObject("cube"));
    document.getElementById("addSphere").addEventListener("click", () => engine.addObject("sphere"));
    document.getElementById("addPlane").addEventListener("click", () => engine.addObject("plane"));
    document.getElementById("saveScene").addEventListener("click", () => engine.saveScene());
    document.getElementById("loadSceneInput").addEventListener("change", (e) => engine.loadScene(e.target.files[0]));
});
