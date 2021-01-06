import {
  LineSegments,
  Matrix4,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Float32BufferAttribute,
  Bone,
  Color,
  Group,
  AnimationMixer,
} from 'three';

import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';

const loader = new BVHLoader();

const vector = new Vector3();
const boneMatrix = new Matrix4();
const matrixWorldInv = new Matrix4();

const colors = [
  'white',
];

let color = 0; // represents colors index

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

class DancerModel extends LineSegments {
  root: Bone;

  bones: Bone[];

  constructor(bone: Bone, color: Color, opacity: number) {
    const bones = getBoneList(bone);

    const geometry = new BufferGeometry();

    const vertices = [];

    for (let i = 0; i < bones.length; i += 1) {
      const b = bones[i];

      if (b.parent && (b.parent as any).isBone) {
        vertices.push(0, 0, 0);
        vertices.push(0, 0, 0);
      }
    }

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    const material = new LineBasicMaterial({
      vertexColors: false,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      transparent: true,
      opacity,
    });

    super(geometry, material);

    this.type = 'SkeletonModel';

    this.root = bone;
    this.bones = bones;

    this.matrix = bone.matrixWorld;
    this.matrixAutoUpdate = false;
  }

  updateMatrixWorld(force: any) {
    const { bones } = this;

    const { geometry } = this;

    const { material } = this;

    (material as any).color = new Color(colors[color]);
    color += 1;
    color = color === (colors.length) ? 0 : color;

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

const Dancer = (color: Color, opacity: number) => {
  let dancerModel: DancerModel;
  let mixer: AnimationMixer;
  const dancerGroup = new Group();

  const load = (bvh: any) => {
    loader.load(bvh, (result) => {
      dancerModel = new DancerModel(result.skeleton.bones[0], color, opacity);
      (dancerModel as any).skeleton = result.skeleton;

      const boneContainer = new Group();
      boneContainer.add(result.skeleton.bones[0]);

      dancerGroup.add(dancerModel);
      dancerGroup.add(boneContainer);

      mixer = new AnimationMixer(dancerModel);
      mixer.clipAction(result.clip).setEffectiveWeight(1.0).play();
    });
  };

  const animate = (delta: number) => {
    if (mixer) {
      mixer.update(delta);
    }
  };

  return {
    load,
    animate,
    dancer: dancerGroup,
  };
};

export default Dancer;
