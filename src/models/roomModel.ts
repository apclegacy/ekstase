import {
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  Group,
} from 'three';

const Room = (height: number, width: number, depth: number, thickness: number) => {
  const longWallGeometry = new BoxGeometry(width, height, thickness);
  const shortWallGeometry = new BoxGeometry(thickness, height, depth);
  const floorGeometry = new BoxGeometry(width, thickness, depth);
  const wallMaterial = new MeshPhongMaterial({
    color: 0x404040,
    transparent: false,
  });
  const floor = new Mesh(floorGeometry, wallMaterial);
  const longWallA = new Mesh(longWallGeometry, wallMaterial);
  const longWallB = new Mesh(longWallGeometry, wallMaterial);
  const shortWallA = new Mesh(shortWallGeometry, wallMaterial);
  const shortWallB = new Mesh(shortWallGeometry, wallMaterial);
  floor.position.setY(-100);
  longWallA.position.setY(-height / 2);
  longWallB.position.setY(-height / 2);
  shortWallA.position.setY(-height / 2);
  shortWallB.position.setY(-height / 2);
  longWallA.position.setZ(-depth / 2);
  longWallB.position.setZ(depth / 2);
  shortWallA.position.setX(-width / 2);
  shortWallB.position.setX(width / 2);
  const roomGroup = new Group();
  roomGroup.add(floor);
  roomGroup.add(longWallA);
  roomGroup.add(longWallB);
  roomGroup.add(shortWallA);
  roomGroup.add(shortWallB);

  return {
    room: roomGroup,
  };
};

export default Room;
