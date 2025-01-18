// core.js
class Engine {
    constructor() {
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        this.objects = new Set();
        this.isRunning = false;
        this.init();
    }

    async init() {
        // Initialize essential components first
        this.scene = new Scene();
        this.renderer = new Renderer();
        
        // Camera setup - optimized position
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(3, 3, 3); // Closer initial position
        this.camera.lookAt(0, 0, 0);

        // Lightweight controls initialization
        this.controls = new THREE.OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = false; // Disable pan by default for better performance

        // Event listener with throttle
        window.addEventListener('resize', this.throttle(() => this.onWindowResize(), 100));
        
        // Start render loop
        this.isRunning = true;
        this.animate();

        // Signal ready state
        return true;
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        if (!this.isRunning) return;
        
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        this.controls.update();
        this.scene.updateObjects(delta);
        this.renderer.render(this.scene, this.camera);
    }

    cleanup() {
        this.isRunning = false;
        this.objects.clear();
        this.scene.dispose();
        this.renderer.dispose();
    }
}
