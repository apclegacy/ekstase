import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  Vector2,
  Color,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import Dancer from '../models/dancerModel';
import Floor from '../models/floorModel';

import dancerMotion from '../assets/motion/olivia.bvh';

const bvhScene = () => {
  const clock = new Clock();

  let camera: PerspectiveCamera;
  let scene: Scene;
  let renderer: WebGLRenderer;
  let controls: OrbitControls;

  let composer : EffectComposer;
  let afterImagePass : AfterimagePass;
  let bloomPass : UnrealBloomPass;

  const floorRadius = 300;
  const floorOpacity = 0.7;

  const dancerColor = new Color(0.1, 0.3, 1);
  const dancerOpacity = 0.4;
  const dancerBloom = 2.5;

  const floor = new Floor(floorRadius, floorOpacity);

  const {
    load: loadDancer,
    animate: animateDancer,
    dancer,
  } = Dancer(dancerColor, dancerOpacity);

  loadDancer(dancerMotion);

  const init = () => {
    camera = new PerspectiveCamera(60,
      window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 700, 700);

    scene = new Scene();

    // renderer
    renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);

    // objects
    scene.add(floor);
    scene.add(dancer);

    // controls
    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableZoom = false;
    controls.enableRotate = true;
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2;
    controls.maxAzimuthAngle = 0;
    controls.minAzimuthAngle = 0;

    // postprocessing
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    afterImagePass = new AfterimagePass(0.9765);
    composer.addPass(afterImagePass);

    bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight),
      dancerBloom, 1, 0);
    composer.addPass(bloomPass);
    bloomPass.renderToScreen = true;
  };

  const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    animateDancer(delta);
    composer.render();
  };

  return {
    init,
    animate,
  };
};

export default bvhScene;
