// controls.js
class Controls {
    constructor(engine) {
        this.engine = engine;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Scene controls
        document.getElementById('add-cube').addEventListener('click', () => {
            const position = {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8,
                z: (Math.random() - 0.5) * 8
            };
            const cube = this.engine.scene.addCube(position);
            this.updateObjectCount();
        });

        document.getElementById('add-sphere').addEventListener('click', () => {
            const position = {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8,
                z: (Math.random() - 0.5) * 8
            };
            const sphere = this.engine.scene.addSphere(position);
            this.updateObjectCount();
        });

        // Camera controls
        document.getElementById('orbit').addEventListener('click', () => {
            this.engine.controls.enableRotate = true;
            this.engine.controls.enablePan = false;
        });

        document.getElementById('pan').addEventListener('click', () => {
            this.engine.controls.enableRotate = false;
            this.engine.controls.enablePan = true;
        });

        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'delete':
                    // Delete selected object
                    if (this.engine.selectedObject) {
                        this.engine.scene.removeObject(this.engine.selectedObject);
                        this.engine.selectedObject = null;
                        this.updateObjectCount();
                    }
                    break;
                case 'c':
                    // Quick add cube
                    document.getElementById('add-cube').click();
                    break;
                case 's':
                    // Quick add sphere
                    document.getElementById('add-sphere').click();
                    break;
            }
        });
    }

    updateObjectCount() {
        let count = 0;
        this.engine.scene.traverse((object) => {
            if (object.isMesh) count++;
        });
        document.getElementById('object-count').textContent = count;
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    const engine = new Engine();
    const controls = new Controls(engine);
    const widgetManager = new WidgetManager();
    const modelLoader = new ModelLoader(engine.scene);
    const fileLoader = new FileLoader(engine, modelLoader);
});
