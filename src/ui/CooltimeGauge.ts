import Phaser from 'phaser';
import {
  COOLTIME,
  CHAINSAW,
} from '../constants';

export class CooltimeGauge {
  private bg: Phaser.GameObjects.Rectangle;
  private fill: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    // 背景
    this.bg = scene.add.rectangle(
      COOLTIME.GAUGE.X,
      COOLTIME.GAUGE.Y,
      COOLTIME.GAUGE.WIDTH,
      COOLTIME.GAUGE.HEIGHT,
      COOLTIME.GAUGE.COLOR.BG,
    ).setOrigin(0, 0);

    // ゲージ本体
    this.fill = scene.add.rectangle(
      COOLTIME.GAUGE.X,
      COOLTIME.GAUGE.Y,
      COOLTIME.GAUGE.WIDTH,
      COOLTIME.GAUGE.HEIGHT,
      COOLTIME.GAUGE.COLOR.FILL,
    ).setOrigin(0, 0);

    // ラベル
    this.label = scene.add.text(
      COOLTIME.GAUGE.X,
      COOLTIME.GAUGE.Y + COOLTIME.GAUGE.HEIGHT + 4,
      'CHAINSAW',
      { fontSize: '12px', color: '#ffffff' },
    );
  }

  update(progress: number): void {
    this.fill.width = COOLTIME.GAUGE.WIDTH * Phaser.Math.Clamp(progress, 0, 1);
  }
}
