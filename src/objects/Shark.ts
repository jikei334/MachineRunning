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
  private isDying: boolean = false;

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

  dieWithHitStop(onComplete: () => void): void {
    if (this.isDying) return;
    this.isDying = true;
    this.setActive(false);

    this.setVelocity(0, 0);
    (this.body as Phaser.Physics.Arcade.Body).enable = false;

    this.setTintFill(0xff0000);
    this.scene.tweens.add({
      targets: this,
      x: this.x + 5,
      duration: 50,
      yoyo: true,
      repeat: 3,
      ease: 'Linear',
      onComplete: () => {
        onComplete();
        this.destroy();
      },
    });
  }
}
