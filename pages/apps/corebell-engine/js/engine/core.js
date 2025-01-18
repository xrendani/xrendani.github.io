// core.js
class Engine {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        this.objects = [];
        this.frameCount = 0;
        this.lastTime = 0;
        this.init();
    }

    init() {
        // Initialize core components
        this.scene = new Scene();
        this.renderer = new Renderer();
        
        // Set up camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 5);
        this.camera.lookAt(0, 0, 0);

        // Set up orbit controls
        this.controls = new THREE.OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Start render loop
        this.animate();

        // Hide loading screen
        setTimeout(() => {
            document.querySelector('.loading-screen').classList.add('hidden');
        }, 1000);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateFPS() {
        const now = performance.now();
        this.frameCount++;

        if (now - this.lastTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            document.getElementById('fps').textContent = fps;
            
            // Update memory usage if available
            if (window.performance && window.performance.memory) {
                const memoryUsage = Math.round(window.performance.memory.usedJSHeapSize / 1048576);
                document.getElementById('memory-usage').textContent = memoryUsage;
            }
            
            this.frameCount = 0;
            this.lastTime = now;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Update controls
        this.controls.update();
        
        // Update all objects
        this.scene.updateObjects(delta);
        
        // Update stats
        this.updateFPS();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}
