// scene.js
class Scene extends THREE.Scene {
    constructor() {
        super();
        this.setupEnvironment();
    }

    setupEnvironment() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.add(directionalLight);

        // Add grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        this.add(gridHelper);

        // Add axis helper
        const axisHelper = new THREE.AxesHelper(5);
        this.add(axisHelper);

        // Add environment fog
        this.fog = new THREE.FogExp2(0x1a1a1a, 0.02);
    }

    addCube(position = { x: 0, y: 0, z: 0 }) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shininess: 30,
            metalness: 0.5,
            roughness: 0.5
        });
        
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(position.x, position.y, position.z);
        cube.userData.type = 'cube';
        cube.userData.rotationSpeed = {
            x: Math.random() * 0.02,
            y: Math.random() * 0.02,
            z: Math.random() * 0.02
        };
        
        this.add(cube);
        return cube;
    }

    addSphere(position = { x: 0, y: 0, z: 0 }) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            shininess: 30,
            metalness: 0.5,
            roughness: 0.5
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(position.x, position.y, position.z);
        sphere.userData.type = 'sphere';
        sphere.userData.rotationSpeed = {
            x: Math.random() * 0.02,
            y: Math.random() * 0.02,
            z: Math.random() * 0.02
        };
        
        this.add(sphere);
        return sphere;
    }

    updateObjects(delta) {
        this.traverse((object) => {
            if (object.isMesh && object.userData.rotationSpeed) {
                object.rotation.x += object.userData.rotationSpeed.x;
                object.rotation.y += object.userData.rotationSpeed.y;
                object.rotation.z += object.userData.rotationSpeed.z;
            }
        });
    }

    removeObject(object) {
        this.remove(object);
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
    }
}
