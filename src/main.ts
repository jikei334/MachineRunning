import Phaser from 'phaser';
import { Title } from './scenes/Title';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scene: [Title],
};

new Phaser.Game(config);
