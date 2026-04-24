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

export const PLAYER_SCALE = 0.3;
export const PLAYER_FRAME_WIDTH = 256;
export const PLAYER_FRAME_HEIGHT = 256;
export const PLAYER_FRAME_COUNT = 4;
export const PLAYER_ANIM_FRAME_RATE = 8;
export const PLAYER_JUMP_FORCE = 900;
export const PLAYER_JUMP_FRAMES = [0, 0, 1, 2];

export const PLATFORM_SCALE = 0.5;
export const PLATFORM_MIN_TILES = 2;
export const PLATFORM_MAX_TILES = 2;
export const PLATFORM_MIN_Y = 200;
export const PLATFORM_MAX_Y = 350;
export const PLATFORM_SPAWN_INTERVAL_MIN = 2 * PLAYER_SCALE * PLAYER_FRAME_WIDTH;
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

export const GRAVITY = 1500;
