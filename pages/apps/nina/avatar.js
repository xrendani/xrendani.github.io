class FaceAvatar {
    constructor(containerId, options = {}) {
        this.options = {
            particleCount: options.particleCount || 8000,
            colorScheme: options.colorScheme || { hue: 0.6, saturation: 0.8, minLightness: 0.3, maxLightness: 0.7 },
            size: options.size || { width: 2.8, length: 2.2, depth: 0.7 },
            particleSize: options.particleSize || 0.03,
            animationSpeed: options.animationSpeed || 1,
            responsiveness: options.responsiveness || 0.5,
            ...options
        };

        // Initialize core components
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        
        // State management
        this.particles = null;
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };
        this.isAnimating = true;
        this.lastUpdate = Date.now();
        
        this.init();
        this.createFace();
        this.setupInteractivity();
        this.startAnimation();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Position camera
        this.camera.position.z = 6;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 2);
        this.scene.add(ambientLight, directionalLight);

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    createFace() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        // Generate face particles
        for (let i = 0; i < this.options.particleCount; i++) {
            const { position, color } = this.generateParticle();
            vertices.push(position.x, position.y, position.z);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: this.options.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthTest: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    generateParticle() {
        const { size, colorScheme } = this.options;
        const featureType = Math.random();
        let position, color;

        if (featureType < 0.7) {
            // Face shape
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            let x = Math.sin(phi) * Math.cos(theta) * (size.width / 2);
            let y = Math.sin(phi) * Math.sin(theta) * (size.length / 2);
            let z = Math.cos(phi) * (size.width / 4);

            const contourFactor = Math.pow(Math.abs(y / (size.length / 2)), 2);
            x *= (1 - contourFactor * 0.3);
            
            position = { x, y, z };
        } else if (featureType < 0.8) {
            // Eyes
            const side = Math.random() > 0.5 ? 1 : -1;
            position = {
                x: side * (size.width / 6) + (Math.random() - 0.5) * 0.2,
                y: (size.length / 8) + (Math.random() - 0.5) * 0.2,
                z: (size.width / 4) + (Math.random() - 0.5) * 0.1
            };
        } else if (featureType < 0.85) {
            // Nose
            position = {
                x: (Math.random() - 0.5) * 0.3,
                y: -(Math.random() * size.length / 8),
                z: (size.width / 4) + Math.random() * 0.5
            };
        } else if (featureType < 0.95) {
            // Mouth
            position = {
                x: (Math.random() - 0.5) * size.width / 3,
                y: -(size.length / 4) + (Math.random() - 0.5) * 0.2,
                z: (size.width / 4) + (Math.random() - 0.5) * 0.1
            };
        } else {
            // Eyebrows
            const side = Math.random() > 0.5 ? 1 : -1;
            position = {
                x: side * (size.width / 6) + (Math.random() - 0.5) * 0.3,
                y: (size.length / 6) + (Math.random() - 0.5) * 0.1,
                z: (size.width / 4) + (Math.random() - 0.5) * 0.1
            };
        }

        // Generate color based on depth
        const depth = (position.z + size.width / 2) / size.width;
        const hue = colorScheme.hue;
        const saturation = colorScheme.saturation;
        const lightness = colorScheme.minLightness + depth * (colorScheme.maxLightness - colorScheme.minLightness);
        
        color = new THREE.Color().setHSL(hue, saturation, lightness);

        return { position, color };
    }

    setupInteractivity() {
        const handleMouseMove = (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mousePos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mousePos.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.targetRotation.y = this.mousePos.x * Math.PI * 0.25;
            this.targetRotation.x = this.mousePos.y * Math.PI * 0.15;
        };

        const handleTouchMove = (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            const rect = this.container.getBoundingClientRect();
            
            this.mousePos.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mousePos.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.targetRotation.y = this.mousePos.x * Math.PI * 0.25;
            this.targetRotation.x = this.mousePos.y * Math.PI * 0.15;
        };

        // Add event listeners
        this.container.addEventListener('mousemove', handleMouseMove);
        this.container.addEventListener('touchmove', handleTouchMove, { passive: false });
        this.container.addEventListener('mouseleave', () => {
            this.targetRotation.x = 0;
            this.targetRotation.y = 0;
        });
    }

    startAnimation() {
        if (!this.isAnimating) return;

        const animate = () => {
            if (!this.isAnimating) return;
            
            requestAnimationFrame(animate);
            
            const now = Date.now();
            const delta = (now - this.lastUpdate) / 16.67; // Normalize to 60fps
            this.lastUpdate = now;

            if (this.particles) {
                // Smooth rotation
                const rotationSpeed = this.options.responsiveness * delta;
                this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * rotationSpeed;
                this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * rotationSpeed;
                
                this.particles.rotation.x = this.currentRotation.x;
                this.particles.rotation.y = this.currentRotation.y;

                // Breathing animation
                const time = now * 0.001;
                this.particles.position.y = Math.sin(time) * 0.1;
                
                // Update particle positions for wave effect
                const positions = this.particles.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    const x = positions[i];
                    positions[i + 2] += Math.sin(x * 2 + time) * 0.0005;
                }
                this.particles.geometry.attributes.position.needsUpdate = true;
            }
            
            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    setColorScheme(newColorScheme) {
        Object.assign(this.options.colorScheme, newColorScheme);
        if (this.particles) {
            const colors = this.particles.geometry.attributes.color;
            const positions = this.particles.geometry.attributes.position;
            
            for (let i = 0; i < colors.array.length; i += 3) {
                const depth = (positions.array[i + 2] + this.options.size.width / 2) / this.options.size.width;
                const color = new THREE.Color().setHSL(
                    this.options.colorScheme.hue,
                    this.options.colorScheme.saturation,
                    this.options.colorScheme.minLightness + depth * (this.options.colorScheme.maxLightness - this.options.colorScheme.minLightness)
                );
                colors.array[i] = color.r;
                colors.array[i + 1] = color.g;
                colors.array[i + 2] = color.b;
            }
            colors.needsUpdate = true;
        }
    }

    dispose() {
        this.isAnimating = false;
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
        this.renderer.dispose();
    }
}

// Initialize avatar
document.addEventListener('DOMContentLoaded', () => {
    window.faceAvatar = new FaceAvatar('avatar-container', {
        colorScheme: {
            hue: 0.6,
            saturation: 0.8,
            minLightness: 0.3,
            maxLightness: 0.7
        },
        particleCount: 8000,
        responsiveness: 0.5
    });
});
