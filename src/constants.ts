export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const SCROLL = {
  INITIAL_SPEED: 3,
  MAX_SPEED: 12,
  ACCELERATION: 0.0001,
} as const;

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
  X: GAME_WIDTH / 4,
  SPAWN_X_MARGIN: 3 / 16 * GAME_WIDTH,
} as const;

export const PLATFORM_SCALE = 0.5;
export const PLATFORM_MIN_TILES = 2;
export const PLATFORM_MAX_TILES = 2;
export const PLATFORM_MIN_Y = 200;
export const PLATFORM_MAX_Y = 350;
export const PLATFORM_SPAWN_INTERVAL_MIN = 2 * PLAYER.SCALE * PLAYER.FRAME.WIDTH;
export const PLATFORM_SPAWN_INTERVAL_MAX = GAME_WIDTH;

export const SHARK = {
  SCALE: 0.5,
  FRAME: {
    WIDTH: 256,
    HEIGHT: 128,
    COUNT: 2,
  },
  ANIM_FRAME_RATE: 8,
  SPEED: 300,
  SPAWN_INTERVAL: 10000,
  MIN_Y: 100,
  MAX_Y: 400,
};

export const CHAINSAW = {
  SPEED: 600,
  WIDTH: 128,
  HEIGHT: 64,
  SCALE: 0.5,
  COOLTIME: 1000,
  FIRE_POINT: {
    X: PLAYER.FRAME.WIDTH * PLAYER.SCALE + 1,
    Y: -1,
  },
} as const;

export const COOLTIME = {
  DURATION: CHAINSAW.COOLTIME,
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
