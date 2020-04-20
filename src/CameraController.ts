import { Camera, Vector3, Vector2 } from 'three';
import { MouseEventType, getPointFromEvent } from './util';

export class CameraController {
  private azimuthalAngle = 0;
  private polarAngle = 0;
  public moving = false;

  constructor(
    public radius = 0.3,
    public sensitivity = 0.01,
    public center = new Vector3(0, 0, 0),
    public allowRotation = true
  ) {
    let lastCoords = new Vector2();

    const onMouseDown = (e: MouseEventType) => {
      lastCoords = getPointFromEvent(e);

      if (this.allowRotation) {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onMouseMove);
        document.addEventListener('touchend', onMouseUp);
      }
    };

    const onMouseMove = (e: MouseEventType) => {
      const coords = getPointFromEvent(e);
      const delta = coords.clone().sub(lastCoords);

      this.rotateDelta(delta);
      this.moving = true;

      lastCoords = coords;
    };

    const onMouseUp = (e: MouseEventType) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
      this.moving = false;
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('touchstart', onMouseDown);
  }

  update(camera: Camera) {
    const theta = this.polarAngle;
    const phi = this.azimuthalAngle;
    const r = this.radius;
    const { sin, cos, abs } = Math;

    const position = new Vector3(
      r * cos(abs(theta)) * sin(phi),
      r * sin(theta),
      r * cos(abs(theta)) * cos(phi)
    );

    camera.position.copy(position);
    camera.lookAt(0, 0, 0);
    camera.position.add(this.center);
  }

  rotateDelta(delta: Vector2) {
    const polarAngle = this.polarAngle + delta.y * this.sensitivity;
    const azimuthalAngle = this.azimuthalAngle - delta.x * this.sensitivity;

    this.setRotation(polarAngle, azimuthalAngle);
  }

  setRotation(polarAngle: number, azimuthalAngle: number) {
    const { PI } = Math;
    const round = PI * 2;
    const bound = Math.PI / 2;

    this.polarAngle = Math.min(bound, Math.max(-bound, polarAngle % round));
    this.azimuthalAngle = azimuthalAngle % round;
  }
}
