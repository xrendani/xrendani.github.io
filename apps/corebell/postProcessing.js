class PostProcessing {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.initPostProcessing();
  }

  initPostProcessing() {
    this.composer = new THREE.EffectComposer(this.sceneManager.renderer);

    const renderPass = new THREE.RenderPass(this.sceneManager.scene, this.sceneManager.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new THREE.BloomPass(1.5, 25, 4, 256);
    this.composer.addPass(bloomPass);

    const ssaoPass = new THREE.SSAOPass(this.sceneManager.scene, this.sceneManager.camera, window.innerWidth, window.innerHeight);
    ssaoPass.kernelRadius = 1.0;
    ssaoPass.minDistance = 0.001;
    ssaoPass.maxDistance = 0.1;
    this.composer.addPass(ssaoPass);
  }

  render() {
    this.composer.render();
  }
}

export default PostProcessing;
