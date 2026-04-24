export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const SCENE_KEYS = {
  TITLE: 'Title',
  GAME: 'Game',
  GAMEOVER: 'GameOver',
} as const;

export const ASSET_KEYS = {
  BackGround: 'BackGround',
  Ground: 'Ground',
  PLAYER: 'Player',
  SHARK: 'shark',
  CHAINSAW: 'chainsaw',
} as const;

export const GROUND_SCALE = 0.5;
export const GROUND_HEIGHT = 128 * GROUND_SCALE;
export const GROUND_WIDTH = 256 * GROUND_SCALE;
export const GROUND_Y = GAME_HEIGHT - GROUND_HEIGHT / 2;

export const PLAYER = {
  SCALE: 0.3,
  FRAME: {
    WIDTH: 256,
    HEIGHT: 256,
    COUNT: 4,
  },
  ANIM_FRAME_RATE: 8,
  JUMP: {
    FORCE: 900,
    FRAMES: [0, 0, 1, 2],
  },
  START_Y: -1000,
  X: 200,
  SPAWN_X_MARGIN: 50,
} as const;

export const PLATFORM_SCALE = 0.5;
export const PLATFORM_MIN_TILES = 2;
export const PLATFORM_MAX_TILES = 2;
export const PLATFORM_MIN_Y = 200;
export const PLATFORM_MAX_Y = 350;
export const PLATFORM_SPAWN_INTERVAL_MIN = 2 * PLAYER.SCALE * PLAYER.FRAME.WIDTH;
export const PLATFORM_SPAWN_INTERVAL_MAX = GAME_WIDTH;

export const SHARK_SCALE = 0.5;
export const SHARK_FRAME_WIDTH = 256;
export const SHAKR_FRAME_HEIGHT = 128;
export const SHARK_FRAME_COUNT = 2;
export const SHARK_ANIM_FRAME_RATE = 8;
export const SHARK_SPEED = 300;
export const SHARK_SPAWN_INTERVAL = 10000;
export const SHARK_MIN_Y = 100;
export const SHARK_MAX_Y = 400;

export const CHAINSAW_SPEED = 600;
export const CHAINSAW_WIDTH = 128;
export const CHAINSAW_HEIGHT = 64;
export const CHAINSAW_SCALE = 0.5;
export const CHAINSAW_COOLTIME = 1000;

export const COOLTIME = {
  DURATION: 1000,
  GAUGE: {
    X: 20,
    Y: 20,
    WIDTH: 150,
    HEIGHT: 16,
    COLOR: {
      BG: 0x444444,
      FILL: 0xff4444,
    },
  },
} as const;

export const GRAVITY = 1500;
