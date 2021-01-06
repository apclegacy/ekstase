import {
  LineSegments,
  LineBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute,
  Color,
} from 'three';

class Floor extends LineSegments {
  constructor(size: number, opacity: number) {
    const geometry = new BufferGeometry();

    const vertices = [
      size, 0, 0, -size, 0, 0,
      0, 0, size, 0, 0, -size,
      size, 0, size, -size, 0, -size,
      -size, 0, size, size, 0, -size,
    ];

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    const material = new LineBasicMaterial({
      vertexColors: false,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      transparent: true,
      opacity,
      color: new Color(0.05, 0.5, 0.6),
    });

    super(geometry, material);

    this.type = 'floorModel';
    this.matrixAutoUpdate = false;
  }

  updateMatrixWorld(force: any) {
    const { geometry } = this;
    geometry.rotateY(0.015);
    super.updateMatrixWorld(force);
  }
}

export default Floor;
