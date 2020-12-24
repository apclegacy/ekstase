import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  GridHelper,
  Color,
  AnimationMixer,
  SkeletonHelper,
  Group,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';

import pirouette from '../assets/motion/olivia.bvh';

const bvhScene = () => {
  const clock = new Clock();
  const loader = new BVHLoader();

  let camera: PerspectiveCamera;
  let scene: Scene;
  let renderer: WebGLRenderer;
  let controls: OrbitControls;

  let mixer: AnimationMixer;
  let skeletonHelper: SkeletonHelper;

  loader.load(pirouette, (result) => {
    skeletonHelper = new SkeletonHelper(result.skeleton.bones[0]);
    (skeletonHelper as any).skeleton = result.skeleton;

    const boneContainer = new Group();
    boneContainer.add(result.skeleton.bones[0]);

    scene.add(skeletonHelper);
    scene.add(boneContainer);

    mixer = new AnimationMixer(skeletonHelper);
    mixer.clipAction(result.clip).setEffectiveWeight(1.0).play();
  });

  const init = () => {
    camera = new PerspectiveCamera(60,
      window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 200, 300);

    scene = new Scene();
    scene.background = new Color(0xeeeeee);

    // renderer
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 900;
    controls.maxDistance = 900;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 0;
  };

  const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) {
      mixer.update(delta);
    }
    renderer.render(scene, camera);
  };

  return {
    init,
    animate,
  };
};

export default bvhScene;
