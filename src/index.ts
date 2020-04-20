import {
  createRenderer,
  resizeRenderer,
  fetchGltf,
  fetchTexture,
  MouseEventType,
  getPointFromEvent,
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
  Vector2,
  Raycaster,
  Camera,
  Vector3,
  ConeGeometry,
  AnimationMixer,
  Clock,
} from 'three';
import { CameraController } from './CameraController';
import knightRunnigUrl from './assets/knight_runnig/scene.gltf';
import grassUrl from './assets/grass.jpg';
import { GameController } from './GameController';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

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
  cameraController.setRotation(0.9, -2.7);
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
  scene.add(ground);

  const character = getCharacter(knightGltf);
  scene.add(character);

  const mixer = new AnimationMixer(character);
  const runAction = mixer.clipAction(knightGltf.animations[0]);

  const cone = createCone();
  scene.add(cone);

  const ambientLight = new AmbientLight('white');
  ambientLight.intensity = 0.7;
  scene.add(ambientLight);

  const sun = createSun();
  sun.position.set(0.5, 1, 0.5).normalize();
  scene.add(sun);

  // scene.add(new CameraHelper(sun.shadow.camera));

  const gameController = new GameController(character, cone, runAction);

  subscribeGroundClick(scene, camera, (v: Vector3) => {
    if (!cameraController.moving) {
      gameController.moveCharacterTo(v);
    }
  });

  const clock = new Clock();

  const render = () => {
    resizeRenderer(renderer, camera);

    const delta = clock.getDelta();

    gameController.update(delta);

    mixer.update(delta);

    cameraController.center.copy(character.position);

    cameraController.update(camera);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();
}

start();

function getCharacter(gltf: GLTF) {
  const character = gltf.scene;
  character.traverse((obj) => {
    if (obj.name === 'Guard03_Mesh_Guard_03_0' && obj instanceof Mesh) {
      obj.castShadow = true;
    }
  });
  character.scale.set(0.6, 0.6, 0.6);
  return character;
}

function createGround(map: Texture) {
  const geometry = new PlaneGeometry(100, 100);
  const material = new MeshLambertMaterial({ map });
  geometry.rotateX(-Math.PI / 2);
  const ground = new Mesh(geometry, material);
  ground.name = 'ground';
  ground.castShadow = false;
  ground.receiveShadow = true;
  return ground;
}

function createSun() {
  const sun = new DirectionalLight('white');
  const shadowCameraSize = 10;
  sun.castShadow = true;
  sun.shadow.camera.near = -shadowCameraSize;
  sun.shadow.camera.far = shadowCameraSize;
  sun.shadow.camera.left = -shadowCameraSize;
  sun.shadow.camera.right = shadowCameraSize;
  sun.shadow.camera.top = shadowCameraSize;
  sun.shadow.camera.bottom = -shadowCameraSize;
  return sun;
}

function createCone() {
  const geometry = new ConeGeometry(0.2, 1);
  geometry.rotateX(Math.PI);
  const material = new MeshLambertMaterial({ color: 'blue' });
  const mesh = new Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}

function subscribeGroundClick(
  scene: Scene,
  camera: Camera,
  handler: (v: Vector3) => void
) {
  const handleDestination = (e: MouseEventType) => {
    const point = getPointFromEvent(e);
    const mouse = new Vector2(
      (point.x / window.innerWidth) * 2 - 1,
      -(point.y / window.innerHeight) * 2 + 1
    );
    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0 && intersects[0].object.name === 'ground') {
      handler(intersects[0].point);
    }
  };

  document.addEventListener('mouseup', handleDestination);
  document.addEventListener('touchend', handleDestination);
}
