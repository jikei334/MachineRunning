import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENE_KEYS } from '../constants';

export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAMEOVER });
  }

  create(data: { score: number }): void {
    const highScore = Number(localStorage.getItem('machineRunning_highScore') ?? 0);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff0000',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `SCORE: ${Math.floor(data.score)}`, {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50, `BEST: ${Math.floor(highScore)}`, {
      fontSize: '24px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, 'Click to Retry', {
      fontSize: '24px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start(SCENE_KEYS.GAME);
    });
  }
}
