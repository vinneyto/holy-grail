import { Object3D, Vector3, Matrix4 } from 'three';

export class CharacterController {
  constructor(private readonly character: Object3D) {}

  startMovement(to: Vector3) {
    const m = new Matrix4().lookAt(
      to,
      this.character.position,
      new Vector3(0, 1, 0)
    );
    this.character.rotation.setFromRotationMatrix(m);
  }
}
