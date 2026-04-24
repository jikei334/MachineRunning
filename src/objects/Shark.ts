import Phaser from 'phaser';
import {
  ASSET_KEYS,
  SHARK,
} from '../constants';

const ANIM_KEYS = {
  FLY: 'shark_fly',
} as const;

export class Shark extends Phaser.Physics.Arcade.Sprite {
  private speed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, scrollSpeed: number) {
    super(scene, x, y, ASSET_KEYS.SHARK);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(SHARK.SCALE);
    this.setGravityY(-scene.physics.world.gravity.y);

    if (!scene.anims.exists(ANIM_KEYS.FLY)) {
      scene.anims.create({
        key: ANIM_KEYS.FLY,
        frames: scene.anims.generateFrameNumbers(ASSET_KEYS.SHARK, {
          start: 0,
          end: SHARK.FRAME.COUNT - 1,
        }),
        frameRate: SHARK.ANIM_FRAME_RATE,
        repeat: -1,
      });
    }

    this.speed = SHARK.SPEED + scrollSpeed * 60;

    this.anims.play(ANIM_KEYS.FLY);
  }

  update(_time: number, delta: number): void {
    this.x -= this.speed * (delta / 1000);
  }
}
