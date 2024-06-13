export const EVENT_ON_FORM_IMAGE_POS_CHANGED = "onFormImagePosChanged";
export const EVENT_ON_FORM_IMAGE_SCALE_CHANGED = "onFormImageScaleChanged";

export function dispatchEventOnFormImagePosChanged(data){
    document.dispatchEvent(new CustomEvent(EVENT_ON_FORM_IMAGE_POS_CHANGED, {detail: data}));
}

export function dispatchEventOnFormImageScaleChanged(data){
    document.dispatchEvent(new CustomEvent(EVENT_ON_FORM_IMAGE_SCALE_CHANGED, {detail: data}));
}