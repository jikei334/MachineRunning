import Phaser from 'phaser';
import { GAME_WIDTH } from '../constants';

const HIGH_SCORE_KEY = 'machineRunning_highScore';

export class ScoreDisplay {
  private scoreText: Phaser.GameObjects.Text;
  private highScoreText: Phaser.GameObjects.Text;
  private highScore: number;

  constructor(scene: Phaser.Scene) {
    this.highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) ?? 0);

    this.scoreText = scene.add.text(GAME_WIDTH - 20, 20, 'SCORE: 0', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(1, 0);

    this.highScoreText = scene.add.text(GAME_WIDTH - 20, 50, `BEST: ${Math.floor(this.highScore)}`, {
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(1, 0);
  }

  update(score: number): void {
    this.scoreText.setText(`SCORE: ${Math.floor(score)}`);

    if (score > this.highScore) {
      this.highScore = score;
      localStorage.setItem(HIGH_SCORE_KEY, String(this.highScore));
      this.highScoreText.setText(`BEST: ${Math.floor(this.highScore)}`);
    }
  }
}
