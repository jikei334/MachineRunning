import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Shark } from '../objects/Shark';
import { Chainsaw } from '../objects/Chainsaw';
import { CooltimeGauge } from '../ui/CooltimeGauge';
import {
  ASSET_KEYS,
  CHAINSAW,
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
  PLAYER,
  SCENE_KEYS,
  SCROLL,
  SHARK,
} from '../constants';

// const SCROLL_SPEED = 3;
const GROUND_HOLE_CHANCE = 0.2;
const GROUND_TILE_COUNT = Math.ceil(GAME_WIDTH / GROUND_WIDTH) + 2;

export class Game extends Phaser.Scene {
  private players: Player[] = [];
  private grounds!: Phaser.Physics.Arcade.StaticGroup;
  private nextGroundX!: number;
  private scrollX: number = 0;
  private lastWasHole: boolean = false;
  private sharks!: Phaser.Physics.Arcade.Group;
  private chainsaws!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cooltimeGauge!: CooltimeGauge;
  private nextPlatformX!: number;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private fireKey!: Phaser.Input.Keyboard.Key;
  private lastFiredTime: number = 0;
  private scrollSpeed: number = SCROLL.INITIAL_SPEED;

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  preload(): void {
    this.load.image(ASSET_KEYS.BackGround, './assets/Background.png');
    this.load.image(ASSET_KEYS.Ground, 'assets/Ground.png');
    this.load.spritesheet(ASSET_KEYS.PLAYER, 'assets/renji_animation.png', {
      frameWidth: PLAYER.FRAME.WIDTH,
      frameHeight: PLAYER.FRAME.HEIGHT,
    });
    this.load.spritesheet(ASSET_KEYS.SHARK, 'assets/shark_animation.png', {
      frameWidth: SHARK.FRAME.WIDTH,
      frameHeight: SHARK.FRAME.HEIGHT,
    });
    this.load.image(ASSET_KEYS.CHAINSAW, 'assets/chainsaw.png');
  }

  create(): void {
    this.scrollX = 0;
    this.lastWasHole = false;
    this.lastFiredTime = 0;
    this.players = [];
    this.nextPlatformX = GAME_WIDTH + 200;

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, ASSET_KEYS.BackGround);

    this.grounds = this.physics.add.staticGroup();
    for (let i = 0; i < GROUND_TILE_COUNT; i++) {
      this.spawnGround(i * GROUND_WIDTH + GROUND_WIDTH / 2, false);
    }
    this.nextGroundX = GROUND_TILE_COUNT * GROUND_WIDTH;

    this.platforms = this.physics.add.staticGroup();
    this.nextPlatformX = GAME_WIDTH + 200;
    this.sharks = this.physics.add.group();

    this.time.addEvent({
      delay: SHARK.SPAWN_INTERVAL,
      callback: this.spawnShark,
      callbackScope: this,
      loop: true,
    });

    this.chainsaws = this.physics.add.group();

    this.jumpKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.spawnPlayer();
    this.fireKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    );

    this.physics.add.overlap(
      this.chainsaws,
      this.sharks,
      (chainsaw, shark) => {
        (chainsaw as Chainsaw).destroy();
        (shark as Shark).destroy();
        this.spawnPlayer();
      },
      undefined,
      this
    );

    this.cooltimeGauge = new CooltimeGauge(this);
    this.scrollSpeed = SCROLL.INITIAL_SPEED;
  }

  update(time: number, delta: number): void {
    const jump = Phaser.Input.Keyboard.JustDown(this.jumpKey);
    // プレイヤー更新
    this.players.forEach((p) => p.update(time, delta, jump));

    this.players.forEach((p) => {
      if (p.isOutOfBounds()) {
        p.destroy();
      }
    });
    this.players = this.players.filter((p) => p.active);
    this.checkGameOver();

    if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
      this.fireChainsaw();
    }

    this.chainsaws.getChildren().forEach((c) => {
      const chainsaw = c as Chainsaw;
      chainsaw.update(time, delta);
      if (chainsaw.x > GAME_WIDTH + 100) {
        chainsaw.destroy();
      }
    });

    const elapsed = this.time.now - this.lastFiredTime;
    this.cooltimeGauge.update(Phaser.Math.Clamp(elapsed / CHAINSAW.COOLTIME, 0, 1));

    this.scrollSpeed = Math.min(
      SCROLL.MAX_SPEED,
      this.scrollSpeed + SCROLL.ACCELERATION * delta
    );
    this.scrollX += this.scrollSpeed;

    this.updateGround();
    this.updatePlatforms();

    this.sharks.getChildren().forEach((shark) => {
      const s = shark as Shark;
      s.update(time, delta);
      if (s.x < -100) {
        s.destroy();
      }
    });
  }

  private spawnPlayer(): void {
    const x = PLAYER.X + Phaser.Math.Between(
      -PLAYER.SPAWN_X_MARGIN,
      PLAYER.SPAWN_X_MARGIN
    );
    const player = new Player(this, x, PLAYER.START_Y);

    this.physics.add.collider(player, this.grounds);
    this.physics.add.collider(
      player,
      this.platforms,
      undefined,
      (_player, platform) => {
        const playerBody = (_player as Player).body as Phaser.Physics.Arcade.Body;
        const platformBody = (platform as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.StaticBody;
        return playerBody.velocity.y >= 0 && playerBody.bottom <= platformBody.top + 10;
      },
      this
    );

    this.physics.add.overlap(
      player,
      this.sharks,
      (_player, shark) => {
        (shark as Shark).destroy();
        (_player as Player).destroy();
        this.players = this.players.filter((p) => p.active);
        this.checkGameOver();
      },
      undefined,
      this
    );

    this.physics.add.overlap(
      player,
      this.chainsaws,
      (_player, _chainsaw) => {
        (_chainsaw as Chainsaw).destroy();
        (_player as Player).destroy();
        this.players = this.players.filter((p) => p.active);
        this.checkGameOver();
      },
      undefined,
      this
    );

    this.players.push(player);
  }

  private fireChainsaw(): void {
    const now = this.time.now;
    if (now - this.lastFiredTime < CHAINSAW.COOLTIME) return;
    if (this.players.length === 0) return;

    this.lastFiredTime = now;

    this.players.forEach((player) => {
      const chainsaw = new Chainsaw(this, player.x + CHAINSAW.FIRE_POINT.X, player.y + CHAINSAW.FIRE_POINT.Y);
      this.chainsaws.add(chainsaw);
    });
  }

  private checkGameOver(): void {
    if (this.players.length === 0) {
      this.scene.start(SCENE_KEYS.GAMEOVER);
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
    const y = Phaser.Math.Between(SHARK.MIN_Y, SHARK.MAX_Y);
    const shark = new Shark(this, GAME_WIDTH + 100, y, this.scrollSpeed);
    this.sharks.add(shark);
  }
}
