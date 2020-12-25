import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  AnimationMixer,
  Group,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

import SkeletonModel from '../models/skeletonModel';

import pirouette from '../assets/motion/elena.bvh';

const bvhScene = () => {
  const clock = new Clock();
  const loader = new BVHLoader();

  let camera: PerspectiveCamera;
  let scene: Scene;
  let renderer: WebGLRenderer;
  let controls: OrbitControls;

  let mixer: AnimationMixer;

  let skeletonModel: SkeletonModel;

  let composer : EffectComposer;
  let afterImagePass : AfterimagePass;

  loader.load(pirouette, (result) => {
    skeletonModel = new SkeletonModel(result.skeleton.bones[0]);
    (skeletonModel as any).skeleton = result.skeleton;

    const boneContainer = new Group();
    boneContainer.add(result.skeleton.bones[0]);

    scene.add(skeletonModel);
    scene.add(boneContainer);

    mixer = new AnimationMixer(skeletonModel);
    mixer.clipAction(result.clip).setEffectiveWeight(1.0).play();
  });

  const init = () => {
    camera = new PerspectiveCamera(60,
      window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 500, 700);

    scene = new Scene();

    // renderer
    renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClearColor = true;
    document.body.appendChild(renderer.domElement);

    // controls

    controls = new OrbitControls(camera, renderer.domElement);

    controls.minDistance = 900;
    controls.maxDistance = 900;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 0;

    // postprocessing

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    afterImagePass = new AfterimagePass(0.98);
    composer.addPass(afterImagePass);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) {
      mixer.update(delta);
    }
    composer.render();
  };

  return {
    init,
    animate,
  };
};

export default bvhScene;
