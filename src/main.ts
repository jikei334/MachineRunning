import Phaser from 'phaser';
import { Title } from './scenes/Title';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: {
    default: 'arcade',
  },
  scene: [Title, Game, GameOver],
  parent: 'game-container',
};

new Phaser.Game(config);
