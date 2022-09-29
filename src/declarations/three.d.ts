import 'three';

declare module 'three' {
  export class Box3 {
    setFromObject: (object: Object3D) => this;
    center: (vector: Vector3) => this;
  }
}
