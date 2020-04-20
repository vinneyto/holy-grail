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
    if (this.timeToGo === 0) {
      return;
    }

    this.passedTime += delta;
  }

  isRunning() {
    return this.passedTime < this.timeToGo;
  }

  getPosition() {
    const alpha = Math.min(this.passedTime / this.timeToGo, 1);
    return new Vector3().lerpVectors(this.from, this.to, alpha);
  }
}

export class GameController {
  private movement?: Movement;

  constructor(
    private readonly character: Object3D,
    private readonly cone: Object3D,
    private readonly runAnimationAction: AnimationAction
  ) {}

  moveCharacterTo(point: Vector3) {
    const m = new Matrix4().lookAt(
      point,
      this.character.position,
      new Vector3(0, 1, 0)
    );
    this.character.quaternion.setFromRotationMatrix(m);

    this.cone.visible = true;
    this.cone.position.set(point.x, CONE_HEIGHT / 2, point.z);
    this.runAnimationAction.play();

    this.movement = new Movement(this.character.position, point);
  }

  update(delta: number) {
    const { movement } = this;

    this.cone.visible = false;

    if (movement !== undefined) {
      movement.update(delta);

      this.character.position.copy(movement.getPosition());

      if (movement.isRunning()) {
        this.cone.visible = true;
      } else {
        this.movement = undefined;

        if (this.runAnimationAction.isRunning()) {
          this.runAnimationAction.stop();
        }
      }
    }
  }
}
