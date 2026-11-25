import * as hmUI from "@zos/ui";
import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from "@zos/device";
import { px } from "@zos/utils";

export const {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT,
  screenShape,
} = getDeviceInfo();

// square devices show a system title bar at the top
const TOP = screenShape === SCREEN_SHAPE_SQUARE ? px(30) : 0;

const NUM_BUTTON_SIZE = px(70);
const NUM_BUTTON_GAP = px(10);
const NUM_EDGE = px(10);
const NUM_ROWS = 4;
// square: keypad almost touches the sides
const NUM_GRID_W =
  screenShape === SCREEN_SHAPE_SQUARE
    ? DEVICE_WIDTH - NUM_EDGE * 2
    : NUM_BUTTON_SIZE * 4 + NUM_BUTTON_GAP * 3;
const NUM_GRID_X = (DEVICE_WIDTH - NUM_GRID_W) / 2;
// square: pin keypad to the bottom edge
const NUM_GRID_Y =
  screenShape === SCREEN_SHAPE_SQUARE
    ? DEVICE_HEIGHT - NUM_EDGE - NUM_BUTTON_SIZE * NUM_ROWS - NUM_BUTTON_GAP * (NUM_ROWS - 1)
    : TOP + px(215);
const rowY = (row) => NUM_GRID_Y + row * (NUM_BUTTON_SIZE + NUM_BUTTON_GAP);
const DIGIT_W = (NUM_GRID_W - NUM_BUTTON_GAP * 2) / 3;
const OP_W = (NUM_GRID_W - NUM_BUTTON_GAP) / 2;

// the page is 2 screens wide: digits on the left, operators on the right
export const SCREEN_COUNT = 2;
const OPS_X = DEVICE_WIDTH + NUM_GRID_X;

const LABEL_Y = TOP + px(60);
const DOTS_H = px(20);

// screen indicator dots, fixed to the screen, between the label and the keypad
const DOT_R = px(5);
const DOT_GAP = px(10);
const DOTS_W = SCREEN_COUNT * DOT_R * 2 + (SCREEN_COUNT - 1) * DOT_GAP;
export const DOT_COLOR_ACTIVE = 0xffffff;
export const DOT_COLOR_INACTIVE = 0x555555;

export const DOTS_CONTAINER_STYLE = {
  x: 0,
  y: NUM_GRID_Y - NUM_BUTTON_GAP - DOTS_H,
  w: DEVICE_WIDTH,
  h: DOTS_H,
  z_index: 1,
  scroll_enable: false,
};

// coordinates are relative to the container
export const DOT_STYLES = Array.from({ length: SCREEN_COUNT }, (_, i) => ({
  x: (DEVICE_WIDTH - DOTS_W) / 2 + i * (DOT_R * 2 + DOT_GAP),
  y: (DOTS_H - DOT_R * 2) / 2,
  w: DOT_R * 2,
  h: DOT_R * 2,
  radius: DOT_R,
  color: i === 0 ? DOT_COLOR_ACTIVE : DOT_COLOR_INACTIVE,
}));

// fills the space between the title bar and the keypad, wraps long text
const LABEL_W = DEVICE_WIDTH - px(42) * 2;
const LABEL_H = NUM_GRID_Y - NUM_BUTTON_GAP - DOTS_H - LABEL_Y;

// fixed to the screen, doesn't move when swiping between screens
export const LABEL_CONTAINER_STYLE = {
  x: px(42),
  y: LABEL_Y,
  w: LABEL_W,
  h: LABEL_H,
  z_index: 1,
  scroll_enable: false,
};

// coordinates are relative to the container
export const LABEL_STYLE = {
  text: "",
  x: 0,
  y: 0,
  w: LABEL_W,
  h: LABEL_H,
  color: 0xffffff,
  text_size: px(32),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.WRAP,
};

const BASE_BUTTON = {
  h: NUM_BUTTON_SIZE,
  radius: px(12),
  normal_color: 0x333333,
  press_color: 0x555555,
  text_size: px(32),
};

// screen 1: 1-9 grid, wide 0 below
export const NUM_BUTTON_STYLES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
  (text, i) => ({
    ...BASE_BUTTON,
    x: NUM_GRID_X + (i % 3) * (DIGIT_W + NUM_BUTTON_GAP),
    y: rowY(Math.floor(i / 3)),
    w: DIGIT_W,
    text,
  }),
);

NUM_BUTTON_STYLES.push({
  ...BASE_BUTTON,
  x: NUM_GRID_X,
  y: rowY(3),
  w: NUM_GRID_W,
  text: "0",
});

// screen 2: 2x2 operators, tall = below
["+", "-", "*", "/"].forEach((text, i) =>
  NUM_BUTTON_STYLES.push({
    ...BASE_BUTTON,
    x: OPS_X + (i % 2) * (OP_W + NUM_BUTTON_GAP),
    y: rowY(Math.floor(i / 2)),
    w: OP_W,
    normal_color: 0x4d4640,
    press_color: 0x6e655c,
    text,
  }),
);

NUM_BUTTON_STYLES.push({
  ...BASE_BUTTON,
  x: OPS_X,
  y: rowY(2),
  w: NUM_GRID_W,
  h: NUM_BUTTON_SIZE * 2 + NUM_BUTTON_GAP,
  normal_color: 0x80583a,
  press_color: 0xa07250,
  text: "=",
});
