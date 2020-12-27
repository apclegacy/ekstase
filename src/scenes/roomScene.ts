import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  GridHelper,
  Color,
  DirectionalLight,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Room from '../models/roomModel';

const roomScene = () => {
  let camera: PerspectiveCamera;
  let scene: Scene;
  let renderer: WebGLRenderer;
  let controls: OrbitControls;

  const { room } = Room(100, 300, 186, 10);

  const init = () => {
    camera = new PerspectiveCamera(60,
      window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 500, 700);

    scene = new Scene();
    scene.background = new Color(0xeeeeee);

    scene.add(new GridHelper(400, 10));

    scene.add(room);

    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    // renderer
    renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClearColor = true;
    document.body.appendChild(renderer.domElement);

    // controls

    controls = new OrbitControls(camera, renderer.domElement);

    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = 0;
  };

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  return {
    init,
    animate,
  };
};

export default roomScene;
