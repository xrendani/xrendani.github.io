// Corebell Engine - Advanced Version 3.0
class CoreBellEngine {
    constructor(containerId, options = {}) {
        this.options = {
            defaultColor: new BABYLON.Color4(0.1, 0.1, 0.1, 1),
            gravity: new BABYLON.Vector3(0, -9.81, 0),
            cameraPosition: new BABYLON.Vector3(0, 5, -10),
            ...options
        };

        // Core Systems
        this.renderingSystem = null;
        this.physicsSystem = null;
        this.collisionSystem = null;
        this.sceneManager = null;
        this.animationSystem = null;
        this.lightingSystem = null;
        this.audioSystem = null;
        this.inputSystem = null;
        this.scriptingSystem = null;
        this.assetManager = null;

        this.initialize(containerId);
    }

    async initialize(containerId) {
        // Initialize Core Engine
        await this.initializeEngine(containerId);
        
        // Initialize All Systems
        await this.initializeSystems();
        
        // Start Engine Loop
        this.startEngineLoop();
    }

    async initializeEngine(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with ID "${containerId}" not found.`);
        }

        // Initialize BABYLON Engine with WebGL 2
        this.engine = new BABYLON.Engine(this.container, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            engineOptions: {
                webGPU: true,
                adaptToDeviceRatio: true
            }
        });

        // Create Main Scene
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = this.options.defaultColor;
    }

    async initializeSystems() {
        // Initialize Rendering System
        this.renderingSystem = new RenderingSystem(this.scene, {
            shadows: true,
            postProcessing: true,
            particleSystem: true
        });

        // Initialize Physics System
        this.physicsSystem = new PhysicsSystem(this.scene, {
            gravity: this.options.gravity,
            plugin: new BABYLON.CannonJSPlugin()
        });

        // Initialize Collision System
        this.collisionSystem = new CollisionSystem(this.scene);

        // Initialize Scene Management
        this.sceneManager = new SceneManager(this.engine);

        // Initialize Animation System
        this.animationSystem = new AnimationSystem(this.scene);

        // Initialize Lighting System
        this.lightingSystem = new LightingSystem(this.scene);

        // Initialize Audio System
        this.audioSystem = new AudioSystem(this.scene);

        // Initialize Input System
        this.inputSystem = new InputSystem(this.scene);

        // Initialize Scripting System
        this.scriptingSystem = new ScriptingSystem();

        // Initialize Asset Manager
        this.assetManager = new AssetManager(this.scene);
    }
}

// Rendering System
class RenderingSystem {
    constructor(scene, options) {
        this.scene = scene;
        this.options = options;
        this.initialize();
    }

    initialize() {
        // Setup PBR Materials
        this.setupPBRMaterials();

        // Setup Shadow System
        if (this.options.shadows) {
            this.setupShadows();
        }

        // Setup Post Processing
        if (this.options.postProcessing) {
            this.setupPostProcessing();
        }

        // Setup Particle System
        if (this.options.particleSystem) {
            this.setupParticleSystem();
        }
    }

    setupPBRMaterials() {
        this.defaultMaterial = new BABYLON.PBRMaterial("default", this.scene);
        this.defaultMaterial.metallic = 0.1;
        this.defaultMaterial.roughness = 0.8;
    }

    setupShadows() {
        this.shadowGenerator = new BABYLON.ShadowGenerator(2048, this.scene.lights[0]);
        this.shadowGenerator.useBlurExponentialShadowMap = true;
        this.shadowGenerator.blurScale = 2;
    }

    setupPostProcessing() {
        const pipeline = new BABYLON.DefaultRenderingPipeline(
            "defaultPipeline", 
            true, 
            this.scene,
            this.scene.cameras
        );

        // Configure post-processing effects
        pipeline.bloomEnabled = true;
        pipeline.bloomThreshold = 0.8;
        pipeline.bloomWeight = 0.3;

        pipeline.chromaticAberrationEnabled = true;
        pipeline.chromaticAberration.aberrationAmount = 1;

        pipeline.sharpenEnabled = true;
        pipeline.sharpen.edgeAmount = 0.3;
    }

    setupParticleSystem() {
        this.particleSystem = new BABYLON.ParticleSystem("particles", 2000, this.scene);
        this.particleSystem.particleTexture = new BABYLON.Texture("assets/textures/flare.png", this.scene);
    }
}

// Physics System
class PhysicsSystem {
    constructor(scene, options) {
        this.scene = scene;
        this.options = options;
        this.initialize();
    }

    initialize() {
        this.scene.enablePhysics(this.options.gravity, this.options.plugin);
        this.setupPhysicsWorld();
    }

    setupPhysicsWorld() {
        // Create physics materials
        this.defaultMaterial = new BABYLON.PhysicsMaterial("default");
        this.defaultMaterial.friction = 0.5;
        this.defaultMaterial.restitution = 0.5;

        // Setup collision groups
        this.collisionGroups = {
            STATIC: 1,
            DYNAMIC: 2,
            TRIGGER: 4
        };
    }

    addBody(mesh, options = {}) {
        const impostor = new BABYLON.PhysicsImpostor(
            mesh,
            options.type || BABYLON.PhysicsImpostor.BoxImpostor,
            {
                mass: options.mass || 1,
                friction: options.friction || 0.5,
                restitution: options.restitution || 0.5
            },
            this.scene
        );

        return impostor;
    }
}

// Collision System
class CollisionSystem {
    constructor(scene) {
        this.scene = scene;
        this.colliders = new Map();
        this.initialize();
    }

    initialize() {
        this.scene.collisionsEnabled = true;
        this.setupCollisionGroups();
    }

    setupCollisionGroups() {
        this.groups = {
            NONE: 0,
            ENVIRONMENT: 1,
            PLAYER: 2,
            ENEMY: 4,
            PROJECTILE: 8,
            PICKUP: 16
        };
    }

    addCollider(mesh, group, callback) {
        mesh.checkCollisions = true;
        mesh.collisionGroup = group;
        
        if (callback) {
            mesh.actionManager = new BABYLON.ActionManager(this.scene);
            mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    callback
                )
            );
        }

        this.colliders.set(mesh.id, { mesh, group, callback });
    }
}

// Scene Manager
class SceneManager {
    constructor(engine) {
        this.engine = engine;
        this.scenes = new Map();
        this.activeScene = null;
    }

    async createScene(name, options = {}) {
        const scene = new BABYLON.Scene(this.engine);
        
        // Setup scene basics
        scene.clearColor = options.clearColor || new BABYLON.Color4(0, 0, 0, 1);
        scene.ambientColor = options.ambientColor || new BABYLON.Color3(0.3, 0.3, 0.3);
        
        // Add to scenes collection
        this.scenes.set(name, scene);
        return scene;
    }

    async loadScene(name, data) {
        return new Promise((resolve, reject) => {
            BABYLON.SceneLoader.Load("", data, this.engine, (scene) => {
                this.scenes.set(name, scene);
                resolve(scene);
            }, null, (scene, message) => {
                reject(new Error(`Failed to load scene: ${message}`));
            });
        });
    }
}

// Animation System
class AnimationSystem {
    constructor(scene) {
        this.scene = scene;
        this.animations = new Map();
        this.initialize();
    }

    initialize() {
        // Setup animation groups
        this.animationGroups = new Map();
        
        // Setup basic animation properties
        BABYLON.Animation.AllowMatricesInterpolation = true;
    }

    createAnimation(name, targetProperty, frameRate, dataType, loopMode) {
        const animation = new BABYLON.Animation(
            name,
            targetProperty,
            frameRate,
            dataType,
            loopMode || BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        this.animations.set(name, animation);
        return animation;
    }

    createAnimationGroup(name) {
        const group = new BABYLON.AnimationGroup(name);
        this.animationGroups.set(name, group);
        return group;
    }
}

// Lighting System
class LightingSystem {
    constructor(scene) {
        this.scene = scene;
        this.lights = new Map();
        this.initialize();
    }

    initialize() {
        // Setup default lighting environment
        this.setupDefaultLighting();
        
        // Setup environment
        this.setupEnvironment();
    }

    setupDefaultLighting() {
        // Add hemispheric light
        const hemiLight = new BABYLON.HemisphericLight(
            "hemiLight",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        hemiLight.intensity = 0.7;
        this.lights.set("hemiLight", hemiLight);

        // Add directional light for shadows
        const dirLight = new BABYLON.DirectionalLight(
            "dirLight",
            new BABYLON.Vector3(-1, -2, -1),
            this.scene
        );
        dirLight.intensity = 0.6;
        this.lights.set("dirLight", dirLight);
    }

    setupEnvironment() {
        // Create environment helper
        this.environmentHelper = new BABYLON.EnvironmentHelper({
            skyboxSize: 1000,
            groundColor: new BABYLON.Color3(0.5, 0.5, 0.5),
            createGround: true,
            createSkybox: true
        }, this.scene);
    }
}

// Audio System
class AudioSystem {
    constructor(scene) {
        this.scene = scene;
        this.sounds = new Map();
        this.initialize();
    }

    initialize() {
        // Initialize audio context
        this.audioEngine = new BABYLON.AudioEngine();
        
        // Setup audio categories
        this.categories = {
            MUSIC: "music",
            SFX: "sfx",
            VOICE: "voice",
            AMBIENT: "ambient"
        };
    }

    async loadSound(name, url, options = {}) {
        return new Promise((resolve, reject) => {
            const sound = new BABYLON.Sound(
                name,
                url,
                this.scene,
                () => resolve(sound),
                {
                    loop: options.loop || false,
                    autoplay: options.autoplay || false,
                    volume: options.volume || 1
                }
            );
            this.sounds.set(name, sound);
        });
    }
}

// Input System
class InputSystem {
    constructor(scene) {
        this.scene = scene;
        this.bindings = new Map();
        this.initialize();
    }

    initialize() {
        // Setup input mapping
        this.setupInputMap();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupInputMap() {
        this.inputMap = {
            keyboard: new Map(),
            mouse: new Map(),
            gamepad: new Map()
        };
    }

    setupEventListeners() {
        // Keyboard events
        window.addEventListener("keydown", (evt) => this.handleKeyDown(evt));
        window.addEventListener("keyup", (evt) => this.handleKeyUp(evt));
        
        // Mouse events
        this.scene.onPointerDown = (evt) => this.handlePointerDown(evt);
        this.scene.onPointerUp = (evt) => this.handlePointerUp(evt);
        this.scene.onPointerMove = (evt) => this.handlePointerMove(evt);
    }
}

// Scripting System
class ScriptingSystem {
    constructor() {
        this.scripts = new Map();
        this.initialize();
    }

    initialize() {
        // Setup script environment
        this.setupScriptEnvironment();
    }

    setupScriptEnvironment() {
        this.context = {
            global: {},
            scripts: this.scripts
        };
    }

    async loadScript(name, source) {
        try {
            const script = new Function('context', source);
            this.scripts.set(name, script);
            return script;
        } catch (error) {
            throw new Error(`Failed to load script ${name}: ${error.message}`);
        }
    }
}

// Asset Manager
class AssetManager {
    constructor(scene) {
        this.scene = scene;
        this.assets = new Map();
        this.initialize();
    }

    initialize() {
        this.assetsManager = new BABYLON.AssetsManager(this.scene);
        this.setupAssetTypes();
    }

    setupAssetTypes() {
        this.assetTypes = {
            MESH: "mesh",
            TEXTURE: "texture",
            MATERIAL: "material",
            SOUND: "sound",
            SCRIPT: "script"
        };
    }

    async loadAsset(type, name, url) {
        return new Promise((resolve, reject) => {
            let task;

            switch (type) {
                case this.assetTypes.MESH:
                    task = this.assetsManager.addMeshTask(name, "", "", url);
                    break;
                case this.assetTypes.TEXTURE:
                    task = this.assetsManager.addTextureTask(name, url);
                    break;
                default:
                    reject(new Error(`Unknown asset type: ${type}`));
                    return;
            }

            task.onSuccess = (task) => {
                this.assets.set(name, task.loadedAsset);
                resolve(task.loadedAsset);
            };

            task.onError = (task, message) => {
                reject(new Error(`Failed to load asset ${name}: ${message}`));
            };

            this.assetsManager.load();
        });
    }
}

export default CoreBellEngine;
