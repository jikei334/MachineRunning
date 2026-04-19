export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const SCENE_KEYS = {
  TITLE: 'Title',
  GAME: 'Game',
} as const;

export const ASSET_KEYS = {
  BackGround: 'BackGround',
  Ground: 'Ground',
} as const;

export const GROUND_SCALE = 0.5;
export const GROUND_HEIGHT = 128 * GROUND_SCALE;
export const GROUND_WIDTH = 256 * GROUND_SCALE;
export const GROUND_Y = GAME_HEIGHT - GROUND_HEIGHT / 2;
