class FaceAvatar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.particles = null;
        this.initialY = 0;
        
        this.faceLength = 2.2;  // Scaled from 109.7mm
        this.faceWidth = 2.8;   // Scaled from 140.1mm
        
        this.init();
        this.createFace();
        this.animate();
    }

    init() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 6;

        // Handle window resize
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    createFace() {
        const particleCount = 8000;
        const particles = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const featureSelector = Math.random();
            
            if (featureSelector < 0.7) { // Main face shape
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                
                let x = Math.sin(phi) * Math.cos(theta) * (this.faceWidth / 2);
                let y = Math.sin(phi) * Math.sin(theta) * (this.faceLength / 2);
                let z = Math.cos(phi) * (this.faceWidth / 4);

                const contourFactor = Math.pow(Math.abs(y / (this.faceLength / 2)), 2);
                x *= (1 - contourFactor * 0.3);
                
                particles[i3] = x;
                particles[i3 + 1] = y;
                particles[i3 + 2] = z;
            } else if (featureSelector < 0.8) { // Eyes
                const side = Math.random() > 0.5 ? 1 : -1;
                particles[i3] = side * (this.faceWidth / 6) + (Math.random() - 0.5) * 0.2;
                particles[i3 + 1] = (this.faceLength / 8) + (Math.random() - 0.5) * 0.2;
                particles[i3 + 2] = (this.faceWidth / 4) + (Math.random() - 0.5) * 0.1;
            } else if (featureSelector < 0.85) { // Nose
                particles[i3] = (Math.random() - 0.5) * 0.3;
                particles[i3 + 1] = -(Math.random() * this.faceLength / 8);
                particles[i3 + 2] = (this.faceWidth / 4) + Math.random() * 0.5;
            } else if (featureSelector < 0.95) { // Mouth
                particles[i3] = (Math.random() - 0.5) * this.faceWidth / 3;
                particles[i3 + 1] = -(this.faceLength / 4) + (Math.random() - 0.5) * 0.2;
                particles[i3 + 2] = (this.faceWidth / 4) + (Math.random() - 0.5) * 0.1;
            } else { // Eyebrows
                const side = Math.random() > 0.5 ? 1 : -1;
                particles[i3] = side * (this.faceWidth / 6) + (Math.random() - 0.5) * 0.3;
                particles[i3 + 1] = (this.faceLength / 6) + (Math.random() - 0.5) * 0.1;
                particles[i3 + 2] = (this.faceWidth / 4) + (Math.random() - 0.5) * 0.1;
            }

            // Color gradient
            const depth = (particles[i3 + 2] + this.faceWidth / 2) / this.faceWidth;
            const color = new THREE.Color();
            color.setHSL(0.6, 0.8, 0.3 + depth * 0.4);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.particles) {
            // Hovering animation
            const time = Date.now() * 0.001;
            const hoverHeight = Math.sin(time) * 0.1;
            this.particles.position.y = this.initialY + hoverHeight;
            
            // Gentle rotation
            this.particles.rotation.y = Math.sin(time * 0.5) * 0.1;
            
            // Particle wave effect
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                positions[i + 2] += Math.sin(x * 2 + time) * 0.0005;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    pulse() {
        if (this.particles) {
            this.particles.material.opacity = 0.95;
            setTimeout(() => {
                this.particles.material.opacity = 0.8;
            }, 200);
        }
    }
}

// Initialize avatar when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.faceAvatar = new FaceAvatar('avatar-container');
});
