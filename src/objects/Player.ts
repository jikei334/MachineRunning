import Phaser from 'phaser';
import { Chainsaw } from './Chainsaw';
import {
  ASSET_KEYS,
  CHAINSAW_COOLTIME,
  GRAVITY,
  PLAYER_SCALE,
  PLAYER_FRAME_WIDTH,
  PLAYER_FRAME_HEIGHT,
  PLAYER_FRAME_COUNT,
  PLAYER_ANIM_FRAME_RATE,
  PLAYER_JUMP_FORCE,
  PLAYER_JUMP_FRAMES,
} from '../constants';

const ANIM_KEYS = {
  RUN: 'player_run',
  JUMP: 'player_jump',
} as const;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private fireKey!: Phaser.Input.Keyboard.Key;
  private isJumping: boolean = false;
  private lastFiredTime: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSET_KEYS.PLAYER);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(PLAYER_SCALE);
    this.setGravityY(GRAVITY);

    this.jumpKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    scene.anims.create({
      key: ANIM_KEYS.RUN,
      frames: scene.anims.generateFrameNumbers(ASSET_KEYS.PLAYER, {
        start: 0,
        end: PLAYER_FRAME_COUNT - 1,
      }),
      frameRate: PLAYER_ANIM_FRAME_RATE,
      repeat: -1,
    });

    scene.anims.create({
      key: ANIM_KEYS.JUMP,
      frames: PLAYER_JUMP_FRAMES.map((frame) => ({ key: ASSET_KEYS.PLAYER, frame })),
      frameRate: PLAYER_ANIM_FRAME_RATE,
      repeat: 0,
    });

    this.anims.play(ANIM_KEYS.RUN);

    this.fireKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }

  update(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const isOnGround = body.touching.down || body.blocked.down;

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey) && isOnGround) {
      this.setVelocityY(-PLAYER_JUMP_FORCE);
      this.anims.play(ANIM_KEYS.JUMP);
      this.isJumping = true;
    }

    if (this.isJumping && isOnGround && this.anims.currentAnim?.key == ANIM_KEYS.JUMP && body!.velocity.y === 0) {
      this.anims.play(ANIM_KEYS.RUN);
      this.isJumping = false;
    }
  }

  fireChainsaw(): Chainsaw | null {
    if (!Phaser.Input.Keyboard.JustDown(this.fireKey)) return null;

    const now = this.scene.time.now;
    if (now - this.lastFiredTime < CHAINSAW_COOLTIME) return null;

    this.lastFiredTime = now;
    return new Chainsaw(this.scene, this.x, this.y);
  }
}
