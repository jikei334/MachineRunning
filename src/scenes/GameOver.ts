import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENE_KEYS } from '../constants';

export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAMEOVER });
  }

  create(): void {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff0000',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, 'Click to Retry', {
      fontSize: '24px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start(SCENE_KEYS.GAME);
    });
  }
}
