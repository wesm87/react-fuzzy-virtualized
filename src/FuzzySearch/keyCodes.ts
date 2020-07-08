export const KEY_ENTER = 'Enter';
export const KEY_UP = 'ArrowUp';
export const KEY_UP_IE = 'Up';
export const KEY_DOWN = 'ArrowDown';
export const KEY_DOWN_IE = 'Down';

export const KEY_CODE_ENTER = 13;
export const KEY_CODE_UP = 38;
export const KEY_CODE_DOWN = 40;

export const KEY_PROP_ENTER = 'enter';
export const KEY_PROP_UP = 'up';
export const KEY_PROP_DOWN = 'down';

export const KEY_CODES_MAP = {
  [KEY_PROP_ENTER]: {
    keys: [KEY_ENTER],
    keyCode: KEY_CODE_ENTER,
  },
  [KEY_PROP_UP]: {
    keys: [KEY_UP, KEY_UP_IE],
    keyCode: KEY_CODE_UP,
  },
  [KEY_PROP_DOWN]: {
    keys: [KEY_DOWN, KEY_DOWN_IE],
    keyCode: KEY_CODE_DOWN,
  },
};
