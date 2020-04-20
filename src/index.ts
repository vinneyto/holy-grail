import {
  createRenderer,
  resizeRenderer,
  fetchGltf,
  fetchTexture,
} from './util';
import {
  PerspectiveCamera,
  Scene,
  Mesh,
  PlaneGeometry,
  DirectionalLight,
  MeshLambertMaterial,
  AmbientLight,
  Texture,
  RepeatWrapping,
  Color,
  BoxGeometry,
  AxesHelper,
} from 'three';
import { CameraController } from './CameraController';
import knightRunnigUrl from './assets/knight_runnig/scene.gltf';
import grassUrl from './assets/grass.jpg';

async function start() {
  const knightGltf = await fetchGltf(knightRunnigUrl);
  const grassTexture = await fetchTexture(grassUrl);
  grassTexture.repeat.set(4, 4);
  grassTexture.wrapS = RepeatWrapping;
  grassTexture.wrapT = RepeatWrapping;
  grassTexture.anisotropy = 4;

  const renderer = createRenderer();
  renderer.setClearColor(new Color(135 / 255, 206 / 255, 235 / 255));
  renderer.shadowMap.enabled = true;

  const camera = new PerspectiveCamera(75, 1, 0.1, 100);
  const cameraController = new CameraController(10, 0.01);
  cameraController.setRotation(0.8, -2.7);
  const scene = new Scene();

  const axes = new AxesHelper(2);
  scene.add(axes);

  const box = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshLambertMaterial({ color: 'red' })
  );
  box.receiveShadow = true;
  box.castShadow = true;
  box.position.set(2, 0.5, 0);
  scene.add(box);

  const ground = createGround(grassTexture);
  ground.castShadow = false;
  ground.receiveShadow = true;
  scene.add(ground);

  knightGltf.scene.traverse((obj) => {
    if (obj.name === 'Guard03_Mesh_Guard_03_0' && obj instanceof Mesh) {
      obj.castShadow = true;
    }
  });

  knightGltf.scene.scale.set(0.6, 0.6, 0.6);
  scene.add(knightGltf.scene);

  const ambientLight = new AmbientLight('white');
  ambientLight.intensity = 0.7;
  scene.add(ambientLight);

  const sun = new DirectionalLight('white');
  const shadowCameraSize = 10;
  sun.castShadow = true;
  sun.shadow.camera.near = -shadowCameraSize;
  sun.shadow.camera.far = shadowCameraSize;
  sun.shadow.camera.left = -shadowCameraSize;
  sun.shadow.camera.right = shadowCameraSize;
  sun.shadow.camera.top = shadowCameraSize;
  sun.shadow.camera.bottom = -shadowCameraSize;

  sun.position.set(0.5, 1, 0.5).normalize();
  scene.add(sun);

  // scene.add(new CameraHelper(sun.shadow.camera));

  const render = () => {
    resizeRenderer(renderer, camera);

    cameraController.update(camera);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();
}

start();

function createGround(map: Texture) {
  const geometry = new PlaneGeometry(100, 100);
  const material = new MeshLambertMaterial({ map });
  geometry.rotateX(-Math.PI / 2);
  return new Mesh(geometry, material);
}
