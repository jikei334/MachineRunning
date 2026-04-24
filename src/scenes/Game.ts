import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Shark } from '../objects/Shark';
import { Chainsaw } from '../objects/Chainsaw';
import { CooltimeGauge } from '../ui/CooltimeGauge';
import {
  ASSET_KEYS,
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_HEIGHT,
  GROUND_WIDTH,
  GROUND_SCALE,
  GROUND_Y,
  PLATFORM_MAX_Y,
  PLATFORM_MIN_Y,
  PLATFORM_SCALE,
  PLATFORM_MAX_TILES,
  PLATFORM_MIN_TILES,
  PLATFORM_SPAWN_INTERVAL_MAX,
  PLATFORM_SPAWN_INTERVAL_MIN,
  PLAYER_SCALE,
  PLAYER_FRAME_WIDTH,
  PLAYER_FRAME_HEIGHT,
  SCENE_KEYS,
  SHARK_SPAWN_INTERVAL,
  SHARK_MIN_Y,
  SHARK_MAX_Y,
  SHARK_FRAME_WIDTH,
  SHAKR_FRAME_HEIGHT,
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
  private sharks!: Phaser.Physics.Arcade.Group;
  private chainsaws!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cooltimeGauge!: CooltimeGauge;
  private nextPlatformX!: number;

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
    this.load.spritesheet(ASSET_KEYS.SHARK, 'assets/shark_animation.png', {
      frameWidth: SHARK_FRAME_WIDTH,
      frameHeight: SHAKR_FRAME_HEIGHT,
    });
    this.load.image(ASSET_KEYS.CHAINSAW, 'assets/chainsaw.png');
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

    this.platforms = this.physics.add.staticGroup();
    this.nextPlatformX = GAME_WIDTH + 200;

    this.physics.add.collider(
      this.player,
      this.platforms,
      undefined,
      (player, platform) => {
        const playerBody = (player as Player).body as Phaser.Physics.Arcade.Body;
        const platformSprite = (platform as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.StaticBody;
        return (
          playerBody.velocity.y >= 0 &&
            playerBody.bottom <= platformSprite.top + 10
        );
      },
      this
    );

    this.sharks = this.physics.add.group();

    this.time.addEvent({
      delay: SHARK_SPAWN_INTERVAL,
      callback: this.spawnShark,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(
      this.player,
      this.sharks,
      () => {
        this.scene.start(SCENE_KEYS.GAMEOVER);
      },
      undefined,
      this
    );

    this.chainsaws = this.physics.add.group();

    this.physics.add.overlap(
      this.chainsaws,
      this.sharks,
      (chainsaw, shark) => {
        (chainsaw as Chainsaw).destroy();
        (shark as Shark).destroy();
      },
      undefined,
      this
    );

    this.cooltimeGauge = new CooltimeGauge(this);
  }

  update(time: number, delta: number): void {
    this.player.update();
    this.scrollX += SCROLL_SPEED;

    this.chainsaws.getChildren().forEach((c) => {
      const chainsaw = c as Chainsaw;
      chainsaw.update(time, delta);
      if (chainsaw.x > GAME_WIDTH + 100) {
        chainsaw.destroy();
      }
    });

    const chainsaw = this.player.fireChainsaw();
    if (chainsaw != null) {
      this.chainsaws.add(chainsaw);
    }

    if (this.player.y > GAME_HEIGHT) {
      this.scene.start(SCENE_KEYS.GAMEOVER);
    }

    this.updateGround();
    this.updatePlatforms();

    this.sharks.getChildren().forEach((shark) => {
      const s = shark as Shark;
      s.update(time, delta);
      if (s.x < -100) {
        s.destroy();
      }
    });

    this.cooltimeGauge.update(this.player.getCooldownProgress());
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

  private updateGround(): void {
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

  private updatePlatforms(): void {
    this.platforms.getChildren().forEach((platform) => {
      const tile = platform as Phaser.Physics.Arcade.Sprite;
      tile.x = Math.round(tile.getData('initialX') - this.scrollX);
      tile.refreshBody();

      if (tile.x < -GROUND_WIDTH) {
        tile.destroy();
      }
    });

    if (this.nextPlatformX - this.scrollX < GAME_WIDTH + 200) {
      this.spawnPlatform(this.nextPlatformX);
      this.nextPlatformX += Phaser.Math.Between(PLATFORM_SPAWN_INTERVAL_MIN, PLATFORM_SPAWN_INTERVAL_MAX);
    }
  }

  private spawnPlatform(startX: number): void {
    const tileCount = Phaser.Math.Between(PLATFORM_MIN_TILES, PLATFORM_MAX_TILES);
    const y = Phaser.Math.Between(PLATFORM_MIN_Y, PLATFORM_MAX_Y);
    const tileWidth = GROUND_WIDTH * PLATFORM_SCALE;

    for (let i = 0; i < tileCount; i++) {
      const x = startX + i * tileWidth;
      const tile = this.platforms.create(
        x, y, ASSET_KEYS.Ground
      ) as Phaser.Physics.Arcade.Sprite;
      tile.setScale(PLATFORM_SCALE);
      tile.setData('initialX', x);
      tile.refreshBody();
    }
  }

  private spawnShark(): void {
    const y = Phaser.Math.Between(SHARK_MIN_Y, SHARK_MAX_Y);
    const shark = new Shark(this, GAME_WIDTH + 100, y);
    this.sharks.add(shark);
  }
}
