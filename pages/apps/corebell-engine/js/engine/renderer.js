// renderer.js
class Renderer extends THREE.WebGLRenderer {
    constructor() {
        super({
            antialias: true,
            powerPreference: "high-performance",
            alpha: false // Disable alpha for performance
        });

        this.setupRenderer();
    }

    setupRenderer() {
        this.setSize(window.innerWidth, window.innerHeight);
        this.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
        this.setClearColor(0x1a1a1a, 1);
        
        // Only enable shadows if needed
        this.shadowMap.enabled = false;
        
        document.getElementById('canvas-container').appendChild(this.domElement);
    }

    dispose() {
        this.dispose();
        this.domElement.remove();
    }
}
