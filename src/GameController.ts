import { Object3D, Vector3, Matrix4 } from 'three';

const VELOCITY = 0.001;
const CONE_HEIGHT = 1;

export class GameController {
  private readonly characterVelocity = new Vector3(0, 0, 0);
  private readonly destination = new Vector3(0, 0, 0);

  constructor(
    private readonly character: Object3D,
    private readonly cone: Object3D
  ) {}

  moveCharacterTo(point: Vector3) {
    this.destination.copy(point);
    const m = new Matrix4().lookAt(
      this.destination,
      this.character.position,
      new Vector3(0, 1, 0)
    );
    this.character.quaternion.setFromRotationMatrix(m);

    const direction = point.clone().sub(this.character.position).normalize();
    this.characterVelocity.copy(direction.multiplyScalar(VELOCITY));

    this.cone.visible = true;
    this.cone.position.set(point.x, CONE_HEIGHT / 2, point.z);
  }

  update(delta: number) {
    const distance = this.character.position.distanceTo(this.destination);

    if (distance < 0.5) {
      this.cone.visible = false;
    }

    if (distance < 0.01) {
      this.characterVelocity.set(0, 0, 0);
    }

    this.character.position.add(
      this.characterVelocity.clone().multiplyScalar(delta)
    );
  }
}
