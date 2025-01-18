
// scene.js
class Scene extends THREE.Scene {
    constructor() {
        super();
        this.objectsToUpdate = new Set();
        this.setupBasicEnvironment();
    }

    setupBasicEnvironment() {
        // Simpler initial setup
        this.add(new THREE.AmbientLight(0x404040));
        
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        this.add(light);

        // Minimal grid
        this.add(new THREE.GridHelper(10, 10, 0x444444, 0x222222));
    }

    addCube(position = { x: 0, y: 0, z: 0 }) {
        // Reuse geometry and material
        if (!this.cubeGeometry) {
            this.cubeGeometry = new THREE.BoxGeometry();
            this.cubeMaterial = new THREE.MeshPhongMaterial({
                color: 0x00ff9d,
                shininess: 30
            });
        }
        
        const cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial.clone());
        cube.position.set(position.x, position.y, position.z);
        cube.userData.type = 'cube';
        this.add(cube);
        this.objectsToUpdate.add(cube);
        return cube;
    }

    addSphere(position = { x: 0, y: 0, z: 0 }) {
        // Reuse geometry and material
        if (!this.sphereGeometry) {
            this.sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
            this.sphereMaterial = new THREE.MeshPhongMaterial({
                color: 0x00ff9d,
                shininess: 30
            });
        }
        
        const sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial.clone());
        sphere.position.set(position.x, position.y, position.z);
        sphere.userData.type = 'sphere';
        this.add(sphere);
        this.objectsToUpdate.add(sphere);
        return sphere;
    }

    updateObjects(delta) {
        for (const object of this.objectsToUpdate) {
            object.rotation.x += delta * 0.5;
            object.rotation.y += delta * 0.5;
        }
    }

    dispose() {
        this.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
}
