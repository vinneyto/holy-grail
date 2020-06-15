import {
  WebGLRenderer,
  Color,
  PerspectiveCamera,
  Scene,
  AxesHelper,
  PlaneGeometry,
  MeshLambertMaterial,
  Mesh,
  DoubleSide,
} from 'three';
import { resizeRenderer } from './util';
import { CameraController } from './CameraController';

async function start() {
  const renderer = createRenderer();
  const camera = new PerspectiveCamera(75, 1, 0.1, 100);
  const cameraController = new CameraController(4, 0.01);
  cameraController.setRotation(Math.PI / 8, 0);
  const scene = new Scene();

  const axes = new AxesHelper(2);
  scene.add(axes);

  const ground = createGround();
  scene.add(ground);

  const render = () => {
    resizeRenderer(renderer, camera);

    cameraController.update(camera);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();
}

start();

export function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new Color('white'));

  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  return renderer;
}

function createGround() {
  const geometry = new PlaneGeometry(100, 100);
  const material = new MeshLambertMaterial({ color: 'gray', side: DoubleSide });
  const ground = new Mesh(geometry, material);
  ground.rotation.x = Math.PI / 2;
  return ground;
}
