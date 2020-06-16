import { Object3D, Vector3, Matrix4, AnimationAction } from 'three';

const VELOCITY = 2;
const CONE_HEIGHT = 1;

class Movement {
  private readonly timeToGo: number;
  private passedTime: number;
  private from: Vector3;
  private to: Vector3;

  constructor(from: Vector3, to: Vector3) {
    const distance = to.distanceTo(from);
    this.timeToGo = distance / VELOCITY;
    this.passedTime = 0;
    this.from = from.clone();
    this.to = to.clone();
  }

  update(delta: number) {
    this.passedTime += delta;
  }

  isFinished() {
    return this.passedTime >= this.timeToGo;
  }

  getPosition() {
    const alpha = Math.min(this.passedTime / this.timeToGo, 1);
    return new Vector3().lerpVectors(this.from, this.to, alpha);
  }
}

export class CharacterController {
  private movement?: Movement;

  constructor(
    private readonly character: Object3D,
    private readonly runActions: AnimationAction,
    private readonly marker: Object3D
  ) {
    marker.visible = false;
  }

  startMovement(to: Vector3) {
    const m = new Matrix4().lookAt(
      to,
      this.character.position,
      new Vector3(0, 1, 0)
    );
    this.character.rotation.setFromRotationMatrix(m);

    this.movement = new Movement(this.character.position, to);
    this.runActions.play();

    this.marker.visible = true;
    this.marker.position.set(to.x, CONE_HEIGHT / 2, to.z);
  }

  update(delta: number) {
    if (this.movement !== undefined) {
      this.movement.update(delta);

      this.character.position.copy(this.movement.getPosition());

      if (this.movement.isFinished()) {
        this.movement = undefined;
        this.runActions.stop();
        this.marker.visible = false;
      }
    }
  }
}
