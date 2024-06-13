export const EVENT_ON_FORM_IMAGE_POS_CHANGED = "onFormImagePosChanged";
export const EVENT_ON_FORM_REQUEST_CANVAS_IMAGE_POS = "onFormRequestCanvasPos";
export const EVENT_ON_FORM_REQUEST_IMAGE_POS = "onFormRequestImagePos";

export function dispatchEventOnFormImagePosChanged(data){
    document.dispatchEvent(new CustomEvent(EVENT_ON_FORM_IMAGE_POS_CHANGED, {detail: data}));
}

export function dispatchEventOnFormRequestCanvasImagePos(){
    document.dispatchEvent(new Event(EVENT_ON_FORM_REQUEST_CANVAS_IMAGE_POS));
}