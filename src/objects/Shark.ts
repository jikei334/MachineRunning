import Phaser from 'phaser';
import {
  ASSET_KEYS,
  SHARK_SCALE,
  SHARK_FRAME_COUNT,
  SHARK_ANIM_FRAME_RATE,
  SHARK_SPEED,
} from '../constants';

const ANIM_KEYS = {
  FLY: 'shark_fly',
} as const;

export class Shark extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSET_KEYS.SHARK);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(SHARK_SCALE);
    this.setGravityY(-scene.physics.world.gravity.y);

    if (!scene.anims.exists(ANIM_KEYS.FLY)) {
      scene.anims.create({
        key: ANIM_KEYS.FLY,
        frames: scene.anims.generateFrameNumbers(ASSET_KEYS.SHARK, {
          start: 0,
          end: SHARK_FRAME_COUNT - 1,
        }),
        frameRate: SHARK_ANIM_FRAME_RATE,
        repeat: -1,
      });
    }

    this.anims.play(ANIM_KEYS.FLY);
  }

  update(_time: number, delta: number): void {
    this.x -= SHARK_SPEED * (delta / 1000);
  }
}
