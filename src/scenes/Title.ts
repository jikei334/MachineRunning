import Phaser from 'phaser';
import { ASSET_KEYS, GAME_WIDTH, GAME_HEIGHT, SCENE_KEYS } from '../constants';

const TITLE_OFFSET = 50;
const TEXT_FONT_SIZE = '24px';
const TEXT_COLOR = '#aaaaaa';

export class Title extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  preload(): void {
    this.load.image(ASSET_KEYS.TITLE, 'assets/title.png');
  }

  create(): void {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, ASSET_KEYS.TITLE);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + TITLE_OFFSET, 'Click to Start', {
      fontSize: TEXT_FONT_SIZE,
      color: TEXT_COLOR,
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start(SCENE_KEYS.GAME);
    });
  }
}
