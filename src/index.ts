import {
  WebGLRenderer,
  Color,
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshLambertMaterial,
  Mesh,
  PointLight,
} from 'three';
import { resizeRenderer } from './util';

async function start() {
  const renderer = createRenderer();
  const camera = new PerspectiveCamera(75, 1, 0.1, 100);
  const scene = new Scene();

  camera.position.z = 5;

  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshLambertMaterial({ color: 0xff0000 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  const light = new PointLight();
  scene.add(light);

  const render = () => {
    resizeRenderer(renderer, camera);

    light.position.copy(camera.position);

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
