import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import { setScrollMode, SCROLL_MODE_SWIPER_HORIZONTAL } from "@zos/page";
import { DEVICE_WIDTH, SCREEN_COUNT, LABEL_CONTAINER_STYLE, LABEL_STYLE, NUM_BUTTON_STYLES,
  DOTS_CONTAINER_STYLE, DOT_STYLES, DOT_COLOR_ACTIVE, DOT_COLOR_INACTIVE } from "./index.page.layout.js";

const logger = Logger.getLogger("helloworld");

/**
 * @param {string} s
 * @returns {{ ok: true, value: number } | { ok: false, error: string }}
 */
function calc(s) {
  if (!/^-?\d+(\.\d+)?([-+*/]\d+(\.\d+)?)*$/.test(s)) return { ok: false, error: "bad expression" };
  const term = (t) => {
    const p = t.split(/([*/])/);
    let r = +p[0];
    for (let i = 1; i < p.length; i += 2) r = p[i] === "*" ? r * p[i + 1] : r / p[i + 1];
    return r;
  };
  const p = s.split(/([+-])/);
  let r = term(p[0]);
  for (let i = 1; i < p.length; i += 2) r = p[i] === "+" ? r + term(p[i + 1]) : r - term(p[i + 1]);
  return { ok: true, value: r };
}

Page({
  onInit() {
    logger.debug("page onInit invoked");
  },

  build() {
    logger.debug("page build invoked");

    const dotsContainer = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, DOTS_CONTAINER_STYLE);
    const dots = DOT_STYLES.map((style) => dotsContainer.createWidget(hmUI.widget.FILL_RECT, style));

    setScrollMode({
      mode: SCROLL_MODE_SWIPER_HORIZONTAL,
      options: {
        width: DEVICE_WIDTH,
        count: SCREEN_COUNT,
        modeParams: {
          on_page: (pageIndex) =>
            dots.forEach((dot, i) =>
              dot.setProperty(hmUI.prop.COLOR, i === pageIndex ? DOT_COLOR_ACTIVE : DOT_COLOR_INACTIVE),
            ),
        },
      },
    });

    const labelContainer = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, LABEL_CONTAINER_STYLE);
    const label = labelContainer.createWidget(hmUI.widget.TEXT, LABEL_STYLE);
    const setText = (text) => label.setProperty(hmUI.prop.TEXT, text);

    // IMPROVE: The user can keep on spamming a number, which causes
    // the text to get cut off
    NUM_BUTTON_STYLES.forEach((style) =>
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...style,
        click_func: () => {
          const text = label.getProperty(hmUI.prop.TEXT);
          if (style.text !== "=") {
            setText(text + style.text);
            return;
          }
          const result = calc(text);
          setText(result.ok ? String(result.value) : result.error);
        },
      }),
    );
  },

  onDestroy() {
    logger.debug("page onDestroy invoked");
  },
});
