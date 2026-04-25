import Phaser from 'phaser';
import {
  ASSET_KEYS,
  DEATH,
  GAME_HEIGHT,
  GRAVITY,
  PLAYER,
} from '../constants';

const ANIM_KEYS = {
  RUN: 'player_run',
  JUMP: 'player_jump',
} as const;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private isJumping: boolean = false;
  private isDying: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSET_KEYS.PLAYER);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(PLAYER.SCALE);
    this.setGravityY(GRAVITY);

    scene.anims.create({
      key: ANIM_KEYS.RUN,
      frames: scene.anims.generateFrameNumbers(ASSET_KEYS.PLAYER, {
        start: 0,
        end: PLAYER.FRAME.COUNT - 1,
      }),
      frameRate: PLAYER.ANIM_FRAME_RATE,
      repeat: -1,
    });

    scene.anims.create({
      key: ANIM_KEYS.JUMP,
      frames: PLAYER.JUMP.FRAMES.map((frame) => ({ key: ASSET_KEYS.PLAYER, frame })),
      frameRate: PLAYER.ANIM_FRAME_RATE,
      repeat: 0,
    });

    this.anims.play(ANIM_KEYS.RUN);
  }

  update(_time: number, _delta: number, jump: boolean): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const isOnGround = body.touching.down || body.blocked.down;

    if (jump && isOnGround) {
      this.setVelocityY(-PLAYER.JUMP.FORCE);
      this.anims.play(ANIM_KEYS.JUMP);
      this.isJumping = true;
    }

    if (this.isJumping && isOnGround && this.anims.currentAnim?.key == ANIM_KEYS.JUMP && body!.velocity.y === 0) {
      this.anims.play(ANIM_KEYS.RUN);
      this.isJumping = false;
    }
  }

  getIsDying(): boolean {
    return this.isDying;
  }

  isOutOfBounds(): boolean {
    return !this.isDying && this.y > GAME_HEIGHT;
  }

  dieWithHitStop(onComplete: () => void): void {
    if (this.isDying) return;
    this.isDying = true;
    this.setActive(false);

    this.setVelocity(0, 0);
    (this.body as Phaser.Physics.Arcade.Body).enable = false;

    this.setTintFill(DEATH.FLASH_COLOR);
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

  dieWithFall(onComplete: () => void): void {
    if (this.isDying) return;
    this.isDying = true;
    this.setActive(false);

    this.setVelocityX(-50);
    this.setVelocityY(-1600);

    this.scene.tweens.add({
      targets: this,
      angle: 360,
      alpha: 0,
      duration: 800,
      ease: 'Linear',
      onComplete: () => {
        onComplete();
        this.destroy();
      },
    });
  }
}
