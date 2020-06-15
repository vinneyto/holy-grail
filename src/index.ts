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
  DirectionalLight,
} from 'three';
import { resizeRenderer, fetchGltf } from './util';
import { CameraController } from './CameraController';
import characterGltfSrc from './assets/knight_runnig/scene.gltf';

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

  const characterGltf = await fetchGltf(characterGltfSrc);
  characterGltf.scene.scale.set(0.5, 0.5, 0.5);
  scene.add(characterGltf.scene);

  const sun = createSun();
  sun.position.set(0, 1, 0);
  scene.add(sun);

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

function createSun() {
  const sun = new DirectionalLight('white');
  return sun;
}
