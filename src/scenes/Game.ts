import Phaser from 'phaser';
import { Player } from '../objects/Player';
import {
  ASSET_KEYS,
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_HEIGHT,
  GROUND_WIDTH,
  GROUND_SCALE,
  GROUND_Y,
  PLAYER_SCALE,
  PLAYER_FRAME_WIDTH,
  PLAYER_FRAME_HEIGHT,
  SCENE_KEYS,
} from '../constants';

const SCROLL_SPEED = 3;
const GROUND_HOLE_CHANCE = 0.2;
const GROUND_TILE_COUNT = Math.ceil(GAME_WIDTH / GROUND_WIDTH) + 2;
const PLAYER_X = GAME_WIDTH / 4;
const PLAYER_Y = -100;

export class Game extends Phaser.Scene {
  private grounds!: Phaser.Physics.Arcade.StaticGroup;
  private nextGroundX!: number;
  private scrollX: number = 0;
  private lastWasHole: boolean = false;
  private player!: Player;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  preload(): void {
    this.load.image(ASSET_KEYS.BackGround, './assets/Background.png');
    this.load.image(ASSET_KEYS.Ground, 'assets/Ground.png');
    this.load.spritesheet(ASSET_KEYS.PLAYER, 'assets/renji_animation.png', {
      frameWidth: PLAYER_FRAME_WIDTH,
      frameHeight: PLAYER_FRAME_HEIGHT,
    });
  }

  create(): void {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, ASSET_KEYS.BackGround);

    this.grounds = this.physics.add.staticGroup();

    for (let i = 0; i < GROUND_TILE_COUNT; i++) {
      this.spawnGround(i * GROUND_WIDTH + GROUND_WIDTH / 2, false);
    }

    this.nextGroundX = GROUND_TILE_COUNT * GROUND_WIDTH;

    this.player = new Player(this, PLAYER_X, PLAYER_Y);
    this.physics.add.collider(this.player, this.grounds);
  }

  update(): void {
    this.player.update();
    this.scrollX += SCROLL_SPEED;

    this.grounds.getChildren().forEach((ground) => {
      const tile = ground as Phaser.Physics.Arcade.Sprite;
      tile.x = Math.round(tile.getData('initialX') - this.scrollX);
      tile.refreshBody();

      if (tile.x < -GROUND_WIDTH) {
        tile.destroy();
      }
    });

    if (this.nextGroundX - this.scrollX < GAME_WIDTH + GROUND_WIDTH) {
      this.spawnGround(this.nextGroundX + GROUND_WIDTH / 2, true);
      this.nextGroundX += GROUND_WIDTH;
    }
  }

  private spawnGround(x: number, withHole: boolean = true): void {
    if (withHole && !this.lastWasHole && Math.random() < GROUND_HOLE_CHANCE) {
      this.lastWasHole = true;
      return;
    }

    this.lastWasHole = false;
    const tile = this.grounds.create(x, GROUND_Y, ASSET_KEYS.Ground) as Phaser.Physics.Arcade.Sprite;
    tile.setScale(GROUND_SCALE);
    tile.setData('initialX', x);
    tile.refreshBody();
  }
}
