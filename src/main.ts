import Phaser from 'phaser';
import { Title } from './scenes/Title';
import { Game } from './scenes/Game';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: [Title, Game],
};

new Phaser.Game(config);
