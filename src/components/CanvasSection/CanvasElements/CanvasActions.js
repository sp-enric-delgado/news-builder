import { fabric } from 'fabric';
import {dispatchCanvasGetImagePosition, dispatchCanvasGetImageScale} from "./CanvasEvents";

export async function addImageToCanvas(canvas, imageFile, imageID){
    const imageURL = URL.createObjectURL(imageFile);
    canvas.clear();

    try{
        const isBackground = imageID === "background";
        const imageIndex = isBackground ? 0 : -1;

        const img = await fabricImageFromURL(imageURL);

        if (isBackground) resizeCanvas(canvas, img.width, img.height);

        img.setOptions({ left: 0, bottom: 0, scaleX: 1, scaleY: 1, selectable: !isBackground, id: imageID});

        if(img.getHeight() > canvas.getHeight()){
            img.scaleToHeight(canvas.getHeight);
        }

        canvas.insertAt(img, imageIndex);
        canvas.renderAll.bind(canvas);

        getImagePosition(canvas, imageID);
        getImageScale(canvas, imageID);
    } catch (error) { console.log("[CANVAS COMPONENT] COULDN'T ADD IMAGE TO CANVAS: " + error); }
}

export function getImagePosition(canvas, imageID){
    if(canvas === null) return;
    const canvasImages = canvas.getObjects();
    if(canvasImages.length === 0) return;

    let data = {}

    canvasImages.map(imageObject => {
        if(imageObject.id === imageID)
        {
            data = {"id": imageID, "pos": imageObject.getPointByOrigin('bottom', 'left')};
        }
    });

    return data;
}

export function dispatchUpdateImagePosition(canvas, imageID){
    dispatchCanvasGetImagePosition(getImagePosition(canvas, imageID));
}

function getImageScale(canvas, imageID){
    if(canvas === null) return;
    const canvasImages = canvas.getObjects();
    if(canvasImages.length === 0) return;

    let data = {}

    canvasImages.map(imageObject => {
        if(imageObject.id === imageID)
        {
            data = {
                "id": imageID,
                "scale": {
                    "x": imageObject.scaleX,
                    "y": imageObject.scaleY
                }
            }
        }
    });

    return data;
}

export function dispatchUpdateImageScale(canvas, imageID){
    dispatchCanvasGetImageScale(getImageScale(canvas, imageID));
}

//#region INTERNAL FUNCTIONS
function resizeCanvas(canvas, width, height){
    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.renderAll.bind(canvas);
}

async function fabricImageFromURL(imageUrl) {
    return new Promise(function(resolve, reject) {
        try {
            fabric.Image.fromURL(imageUrl, function (image) {
                resolve(image);
            });
        } catch (error) {
            reject(error);
        }
    });
}
//#endregion