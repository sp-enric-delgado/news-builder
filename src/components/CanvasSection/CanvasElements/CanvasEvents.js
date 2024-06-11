export const EVENT_ON_CANVAS_GET_IMAGE_POSITION = "onCanvasGetImagePosition";
export const EVENT_ON_CANVAS_IMAGE_SCALED = "onCanvasImageScaled";

export function dispatchCanvasGetImagePosition(data) {
    document.dispatchEvent(new CustomEvent(EVENT_ON_CANVAS_GET_IMAGE_POSITION, {detail: data}));
}

export function OnCanvasImageScaled(data) {
    document.dispatchEvent(new Event("onCanvasImageScaled", data));
}