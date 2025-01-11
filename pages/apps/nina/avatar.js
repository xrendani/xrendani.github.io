class FaceAvatar {
    constructor(containerId, options = {}) {
        this.options = {
            particleCount: options.particleCount || 8000,
            colorScheme: options.colorScheme || { hue: 0.6, saturation: 0.8, minLightness: 0.3, maxLightness: 0.7 },
            size: options.size || { width: 2.8, length: 2.2, depth: 0.7 },
            particleSize: options.particleSize || 0.03,
            animationSpeed: options.animationSpeed || 1,
            ...options
        };

        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true 
        });
        
        this.particles = null;
        this.initialY = 0;
        this.isAnimating = true;
        this.mousePosition = new THREE.Vector2();
        
        this.init();
        this.createFace();
        this.setupInteraction();
        this.animate();
    }

    init() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 6;

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Handle window resize
        const resizeObserver = new ResizeObserver(() => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
        resizeObserver.observe(this.container);
    }

    createFace() {
        const { particleCount, size, colorScheme } = this.options;
        const particles = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const initialPositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const featureSelector = Math.random();
            let particleSize = this.options.particleSize;
            
            if (featureSelector < 0.7) { // Main face shape
                const { position, size: pSize } = this.generateFaceParticle(size);
                particles[i3] = position.x;
                particles[i3 + 1] = position.y;
                particles[i3 + 2] = position.z;
                particleSize = pSize;
            } else {
                const { position, size: pSize } = this.generateFeatureParticle(featureSelector, size);
                particles[i3] = position.x;
                particles[i3 + 1] = position.y;
                particles[i3 + 2] = position.z;
                particleSize = pSize;
            }

            // Store initial positions for animation
            initialPositions[i3] = particles[i3];
            initialPositions[i3 + 1] = particles[i3 + 1];
            initialPositions[i3 + 2] = particles[i3 + 2];

            // Color gradient with depth
            const depth = (particles[i3 + 2] + size.width / 2) / size.width;
            const color = new THREE.Color();
            color.setHSL(
                colorScheme.hue,
                colorScheme.saturation,
                colorScheme.minLightness + depth * (colorScheme.maxLightness - colorScheme.minLightness)
            );
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = particleSize;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('initialPosition', new THREE.BufferAttribute(initialPositions, 3));

        // Custom shader material for better particle rendering
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mousePosition: { value: this.mousePosition },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                uniform float time;
                uniform vec2 mousePosition;
                attribute float size;
                attribute vec3 initialPosition;
                varying vec3 vColor;

                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Wave animation
                    float wave = sin(initialPosition.x * 2.0 + time) * 0.005;
                    pos.z += wave;

                    // Mouse interaction
                    float dist = length(mousePosition - vec2(pos.x, pos.y));
                    float influence = smoothstep(1.0, 0.0, dist);
                    pos.z += influence * 0.2;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
                    gl_FragColor = vec4(vColor, 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    generateFaceParticle(size) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        let x = Math.sin(phi) * Math.cos(theta) * (size.width / 2);
        let y = Math.sin(phi) * Math.sin(theta) * (size.length / 2);
        let z = Math.cos(phi) * (size.width / 4);

        const contourFactor = Math.pow(Math.abs(y / (size.length / 2)), 2);
        x *= (1 - contourFactor * 0.3);

        return {
            position: { x, y, z },
            size: this.options.particleSize
        };
    }

    generateFeatureParticle(selector, size) {
        let position = { x: 0, y: 0, z: 0 };
        let particleSize = this.options.particleSize;

        if (selector < 0.8) { // Eyes
            const side = Math.random() > 0.5 ? 1 : -1;
            position.x = side * (size.width / 6) + (Math.random() - 0.5) * 0.2;
            position.y = (size.length / 8) + (Math.random() - 0.5) * 0.2;
            position.z = (size.width / 4) + (Math.random() - 0.5) * 0.1;
            particleSize *= 0.8;
        } else if (selector < 0.85) { // Nose
            position.x = (Math.random() - 0.5) * 0.3;
            position.y = -(Math.random() * size.length / 8);
            position.z = (size.width / 4) + Math.random() * 0.5;
            particleSize *= 0.9;
        } else if (selector < 0.95) { // Mouth
            position.x = (Math.random() - 0.5) * size.width / 3;
            position.y = -(size.length / 4) + (Math.random() - 0.5) * 0.2;
            position.z = (size.width / 4) + (Math.random() - 0.5) * 0.1;
            particleSize *= 0.85;
        } else { // Eyebrows
            const side = Math.random() > 0.5 ? 1 : -1;
            position.x = side * (size.width / 6) + (Math.random() - 0.5) * 0.3;
            position.y = (size.length / 6) + (Math.random() - 0.5) * 0.1;
            position.z = (size.width / 4) + (Math.random() - 0.5) * 0.1;
            particleSize *= 0.95;
        }

        return { position, size: particleSize };
    }

    setupInteraction() {
        const raycaster = new THREE.Raycaster();
        let isMouseDown = false;

        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            if (isMouseDown) {
                this.particles.rotation.y = this.mousePosition.x * 0.5;
                this.particles.rotation.x = this.mousePosition.y * 0.3;
            }
        });

        this.container.addEventListener('mousedown', () => {
            isMouseDown = true;
        });

        window.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        // Touch events
        this.container.addEventListener('touchstart', (event) => {
            event.preventDefault();
            isMouseDown = true;
            const touch = event.touches[0];
            const rect = this.container.getBoundingClientRect();
            this.mousePosition.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mousePosition.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        });

        this.container.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            const rect = this.container.getBoundingClientRect();
            this.mousePosition.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mousePosition.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

            if (isMouseDown) {
                this.particles.rotation.y = this.mousePosition.x * 0.5;
                this.particles.rotation.x = this.mousePosition.y * 0.3;
            }
        });

        this.container.addEventListener('touchend', () => {
            isMouseDown = false;
        });
    }

    animate() {
        if (!this.isAnimating) return;

        requestAnimationFrame(() => this.animate());
        
        if (this.particles) {
            const time = Date.now() * 0.001 * this.options.animationSpeed;
            
            // Update shader uniforms
            this.particles.material.uniforms.time.value = time;
            
            // Hovering animation
            const hoverHeight = Math.sin(time) * 0.1;
            this.particles.position.y = this.initialY + hoverHeight;
            
            // Smooth rotation return to center when not interacting
            if (!this.isMouseDown) {
                this.particles.rotation.y *= 0.95;
                this.particles.rotation.x *= 0.95;
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    pulse(intensity = 1) {
        if (this.particles) {
            const originalOpacity = this.particles.material.uniforms.opacity?.value || 0.8;
            const pulseOpacity = Math.min(1, originalOpacity + 0.15 * intensity);
            
            gsap.to(this.particles.material.uniforms.opacity, {
                value: pulseOpacity,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
    }

    setColorScheme(colorScheme) {
        if (!this.particles) return;

        const colors = this.particles.geometry.attributes.color;
        const positions = this.particles.geometry.attributes.position;

        for (let i = 0; i < colors.array.length; i += 3) {
            const depth = (positions.array[i + 2] + this.options.size.width / 2) / this.options.size.width;
            const color = new THREE.Color();
            color.setHSL(
                colorScheme.hue,
                colorScheme.saturation,
                colorScheme.minLightness + depth * (colorScheme.maxLightness - colorScheme.minLightness)
            );
            colors.array[i] = color.r;
            colors.array[i + 1] = color.g;
            colors.array[i + 2] = color.b;
        }

        colors.needsUpdate = true;
        this.options.colorScheme = colorScheme;
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

    takeSnapshot() {
        return this.renderer.domElement.toDataURL('image/png');
    }
}

// Initialize avatar when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.faceAvatar = new FaceAvatar('avatar-container', {
        colorScheme: {
            hue: 0.6,
            saturation: 0.8,
            minLightness: 0.3,
            maxLightness: 0.7
        },
        particleCount: 8000,
        animationSpeed: 1
    });
});
