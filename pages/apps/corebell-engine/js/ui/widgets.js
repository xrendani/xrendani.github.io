// widgets.js
class WidgetManager {
    constructor() {
        this.widgets = document.querySelectorAll('.widget');
        this.setupWidgets();
    }

    setupWidgets() {
        this.widgets.forEach(widget => {
            this.makeWidgetDraggable(widget);
            this.setupWidgetControls(widget);
        });
    }

    makeWidgetDraggable(widget) {
        const header = widget.querySelector('.widget-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === header) {
                isDragging = true;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                widget.style.transform = 
                    `translate(${currentX}px, ${currentY}px)`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    setupWidgetControls(widget) {
        const minimizeBtn = widget.querySelector('.widget-minimize');
        const closeBtn = widget.querySelector('.widget-close');

        minimizeBtn.addEventListener('click', () => {
            widget.classList.toggle('minimized');
        });

        closeBtn.addEventListener('click', () => {
            widget.style.display = 'none';
        });
    }
}

// fileLoader.js
class FileLoader {
    constructor() {
        this.setupFileLoading();
    }

    setupFileLoading() {
        const loadModelBtn = document.getElementById('load-model');
        const modelInput = document.getElementById('model-input');
        const saveSceneBtn = document.getElementById('save-scene');

        loadModelBtn.addEventListener('click', () => {
            modelInput.click();
        });

        modelInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadModel(file);
            }
        });

        saveSceneBtn.addEventListener('click', () => {
            this.saveScene();
        });
    }

    loadModel(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const extension = file.name.split('.').pop().toLowerCase();
            switch (extension) {
                case 'obj':
                    this.loadOBJModel(e.target.result);
                    break;
                case 'gltf':
                case 'glb':
                    this.loadGLTFModel(e.target.result);
                    break;
                default:
                    console.error('Unsupported file format');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    loadOBJModel(data) {
        // Implementation for OBJ loading
    }

    loadGLTFModel(data) {
        // Implementation for GLTF loading
    }

    saveScene() {
        // Implementation for scene saving
        const sceneData = {
            objects: scene.children.map(obj => ({
                type: obj.type,
                position: obj.position,
                rotation: obj.rotation,
                scale: obj.scale
            }))
        };

        const blob = new Blob([JSON.stringify(sceneData)], 
            {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scene.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const widgetManager = new WidgetManager();
    const fileLoader = new FileLoader();
});
