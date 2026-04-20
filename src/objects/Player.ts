import Phaser from 'phaser';
import {
  ASSET_KEYS,
  GRAVITY,
  PLAYER_SCALE,
  PLAYER_FRAME_WIDTH,
  PLAYER_FRAME_HEIGHT,
  PLAYER_FRAME_COUNT,
  PLAYER_ANIM_FRAME_RATE,
} from '../constants';

const ANIM_KEYS = {
  RUN: 'player_run',
} as const;

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSET_KEYS.PLAYER);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(PLAYER_SCALE);
    this.setGravityY(GRAVITY);

    scene.anims.create({
      key: ANIM_KEYS.RUN,
      frames: scene.anims.generateFrameNumbers(ASSET_KEYS.PLAYER, {
        start: 0,
        end: PLAYER_FRAME_COUNT - 1,
      }),
      frameRate: PLAYER_ANIM_FRAME_RATE,
      repeat: -1,
    });

    this.anims.play(ANIM_KEYS.RUN);
  }
}
