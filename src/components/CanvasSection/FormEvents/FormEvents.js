export const EVENT_ON_FORM_IMAGE_POS_CHANGED = "onFormImagePosChanged";
export const EVENT_ON_FORM_IMAGE_SCALE_CHANGED = "onFormImageScaleChanged";
export const EVENT_ON_FORM_RENDER_REQUEST = "onFormRenderRequest";
export const EVENT_ON_FORM_IMAGE_SELECTED = "onFormImageSelected";
export const EVENT_ON_FORM_IMAGE_DESELECTED = "onFormImageDeselected";
export const EVENT_ON_FORM_IMAGE_REPOSITIONED = "onFormImageRepositioned";

export function dispatchEventOnFormImagePosChanged(data){
    document.dispatchEvent(new CustomEvent(EVENT_ON_FORM_IMAGE_POS_CHANGED, {detail: data}));
}

export function dispatchEventOnFormImageScaleChanged(data){
    document.dispatchEvent(new CustomEvent(EVENT_ON_FORM_IMAGE_SCALE_CHANGED, {detail: data}));
}

export function dispatchEventOnFormRenderRequest(data){
    document.dispatchEvent(new CustomEvent(EVENT_ON_FORM_RENDER_REQUEST, {detail: data}));
}

export function dispatchEventOnFormImageSelected(data){
    document.dispatchEvent(new CustomEvent(EVENT_ON_FORM_IMAGE_SELECTED, {detail: data}));
}

export function dispatchEventOnFormImageDeselected(data){
    document.dispatchEvent(new CustomEvent(EVENT_ON_FORM_IMAGE_DESELECTED, {detail: data}));
}

export function dispatchEventOnFormImageRepositioned(data){
    document.dispatchEvent(new CustomEvent(EVENT_ON_FORM_IMAGE_REPOSITIONED, {detail: data}));
}