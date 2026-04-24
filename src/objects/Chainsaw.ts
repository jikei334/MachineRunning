import Phaser from 'phaser';
import {
  ASSET_KEYS,
  CHAINSAW_SPEED,
  CHAINSAW_SCALE,
} from '../constants';

export class Chainsaw extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSET_KEYS.CHAINSAW);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(CHAINSAW_SCALE);
    this.setGravityY(-scene.physics.world.gravity.y); // 重力無効
  }

  update(_timer: number, delta: number): void {
    this.x += CHAINSAW_SPEED * (delta / 1000);
  }
}
