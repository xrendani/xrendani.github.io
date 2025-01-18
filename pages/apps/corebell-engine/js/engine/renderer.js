// renderer.js
class Renderer extends THREE.WebGLRenderer {
    constructor() {
        super({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        this.setupRenderer();
    }

    setupRenderer() {
        // Configure renderer
        this.setSize(window.innerWidth, window.innerHeight);
        this.setPixelRatio(window.devicePixelRatio);
        this.setClearColor(0x1a1a1a, 1);
        this.shadowMap.enabled = true;
        this.shadowMap.type = THREE.PCFSoftShadowMap;

        // Configure tone mapping
        this.toneMapping = THREE.ACESFilmicToneMapping;
        this.toneMappingExposure = 1;

        // Add to DOM
        document.getElementById('canvas-container').appendChild(this.domElement);
    }

    // Optional: Add post-processing effects
    setupPostProcessing(scene, camera) {
        const composer = new THREE.EffectComposer(this);
        const renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Add more post-processing passes here if needed
        return composer;
    }
}

// modelLoader.js (expanded)
class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.setupLoaders();
    }

    setupLoaders() {
        this.gltfLoader = new THREE.GLTFLoader();
        this.objLoader = new THREE.OBJLoader();
        this.textureLoader = new THREE.TextureLoader();
    }

    loadGLTF(url) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                (gltf) => {
                    const model = gltf.scene;
                    this.scene.add(model);
                    resolve(model);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.error('Error loading GLTF model:', error);
                    reject(error);
                }
            );
        });
    }

    loadOBJ(url) {
        return new Promise((resolve, reject) => {
            this.objLoader.load(
                url,
                (obj) => {
                    this.scene.add(obj);
                    resolve(obj);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.error('Error loading OBJ model:', error);
                    reject(error);
                }
            );
        });
    }

    loadTexture(url) {
        return this.textureLoader.load(url);
    }
}
