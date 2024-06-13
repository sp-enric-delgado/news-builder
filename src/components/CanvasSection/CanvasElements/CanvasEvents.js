export const EVENT_ON_CANVAS_GET_IMAGE_POSITION = "onCanvasGetImagePosition";
export const EVENT_ON_CANVAS_GET_IMAGE_SCALE = "onCanvasGetImageScale";

export function dispatchCanvasGetImagePosition(data) {
    document.dispatchEvent(new CustomEvent(EVENT_ON_CANVAS_GET_IMAGE_POSITION, {detail: data}));
}

export function dispatchCanvasGetImageScale(data) {
    document.dispatchEvent(new CustomEvent(EVENT_ON_CANVAS_GET_IMAGE_SCALE, {detail: data}));
}