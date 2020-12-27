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

  const dancerColor = new Color(1, 1, 1);
  const dancerOpacity = 0.2;
  const dancerBloom = 3;

  const {
    load: loadDancer,
    animate: animateDancer,
    dancer,
  } = Dancer(dancerColor, dancerOpacity);

  loadDancer(dancerMotion);

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

    // objects
    scene.add(dancer);

    // controls
    controls = new OrbitControls(camera, renderer.domElement);

    controls.minDistance = 900;
    controls.maxDistance = 900;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 0;

    // postprocessing
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    afterImagePass = new AfterimagePass(0.98075);
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
