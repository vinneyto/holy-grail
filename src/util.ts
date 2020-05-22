import {
  WebGLRenderer,
  Color,
  PerspectiveCamera,
  TextureLoader,
  Texture,
  Vector2,
} from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

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

const sizeMap = new WeakMap<WebGLRenderer, Vector2>();

export function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
  const canvas = renderer.domElement;
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;

  let size = sizeMap.get(renderer);
  if (size === undefined) {
    size = new Vector2();
    sizeMap.set(renderer, size);
  }

  const newSizeX = width * window.devicePixelRatio;
  const newSizeY = height * window.devicePixelRatio;

  const needResize = newSizeX !== size.x || newSizeY !== size.y;
  if (needResize) {
    size.x = newSizeX;
    size.y = newSizeY;
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export function resizePerspectiveCamera(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera
) {
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

export function resizeRenderer(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera
) {
  if (resizeRendererToDisplaySize(renderer)) {
    resizePerspectiveCamera(renderer, camera);
  }
}

export async function fetchGltf(url: string) {
  const loader = new GLTFLoader();
  return new Promise<GLTF>((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf),
      () => {},
      () => reject(new Error(`unable to load gltf model ${url}`))
    );
  });
}

export async function fetchTexture(url: string) {
  const loader = new TextureLoader();
  return new Promise<Texture>((resolve, reject) => {
    loader.load(
      url,
      (texture) => resolve(texture),
      () => {},
      () => reject(new Error(`unable to load texture ${url}`))
    );
  });
}
