import {
  LineSegments,
  Matrix4,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Float32BufferAttribute,
  Bone,
  Color,
} from 'three';

const vector = new Vector3();
const boneMatrix = new Matrix4();
const matrixWorldInv = new Matrix4();

const getBoneList = (bone: any) => {
  const boneList = [] as Bone[];

  if (bone && bone.isBone) {
    boneList.push(bone);
  }

  for (let i = 0; i < bone.children.length; i += 1) {
    const recBoneList = getBoneList(bone.children[i]);
    boneList.push(...recBoneList);
  }

  return boneList;
};

class SkeletonModel extends LineSegments {
  root: Bone;

  bones: Bone[];

  constructor(bone: Bone) {
    const bones = getBoneList(bone);

    const geometry = new BufferGeometry();

    const color = new Color(1, 1, 1);

    const vertices = [];
    const colors = [];

    for (let i = 0; i < bones.length; i += 1) {
      const b = bones[i];

      if (b.parent && (b.parent as any).isBone) {
        vertices.push(0, 0, 0);
        vertices.push(0, 0, 0);
        colors.push(color.r, color.g, color.b);
        colors.push(color.r, color.g, color.b);
      }
    }

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

    const material = new LineBasicMaterial({
      vertexColors: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      transparent: true,
      opacity: 0.4,
    });

    super(geometry, material);

    this.type = 'SkeletonHelper';

    this.root = bone;
    this.bones = bones;

    this.matrix = bone.matrixWorld;
    this.matrixAutoUpdate = false;
  }

  updateMatrixWorld(force: any) {
    const { bones } = this;

    const { geometry } = this;

    const position = (geometry as any).getAttribute('position');

    matrixWorldInv.copy(this.root.matrixWorld).invert();

    for (let i = 0, j = 0; i < bones.length; i += 1) {
      const bone = bones[i];

      if (bone.parent && (bone.parent as any).isBone) {
        boneMatrix.multiplyMatrices(matrixWorldInv, bone.matrixWorld);
        vector.setFromMatrixPosition(boneMatrix);
        position.setXYZ(j, vector.x, vector.y, vector.z);

        boneMatrix.multiplyMatrices(matrixWorldInv, bone.parent.matrixWorld);
        vector.setFromMatrixPosition(boneMatrix);
        position.setXYZ(j + 1, vector.x, vector.y, vector.z);

        j += 2;
      }
    }

    (geometry as any).getAttribute('position').needsUpdate = true;

    super.updateMatrixWorld(force);
  }
}

export default SkeletonModel;
