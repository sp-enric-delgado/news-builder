import { fabric } from 'fabric';
import {dispatchCanvasGetImagePosition, OnCanvasGetImagePosition, OnCanvasImageScaled} from "./CanvasEvents";
import {get} from "axios";

export async function addImageToCanvas(canvas, imageFile, imageID){
    const imageURL = URL.createObjectURL(imageFile);
    canvas.clear();

    try{
        const isBackground = imageID === "background";
        const imageIndex = isBackground ? 0 : -1;

        const img = await fabricImageFromURL(imageURL);

        if (isBackground) resizeCanvas(canvas, img.widht, img.height);

        img.setOptions({ left: 0, bottom: 0, scaleX: 1, scaleY: 1, selectable: !isBackground, id: imageID});

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

    canvasImages.map(imageObject => {
        if(imageObject.id === imageID)
        {
            // setImagePos({"id": imageID, "pos": imageObject.getPointByOrigin('bottom', 'left')});
            dispatchCanvasGetImagePosition({"id": imageID, "pos": imageObject.getPointByOrigin('bottom', 'left')});
        }
    });

    canvas.renderAll();
}

function getImageScale(canvas, imageID){
    if(canvas === null) return;

    const canvasImages = canvas.getObjects();

    if(canvasImages.length === 0) return;

    canvasImages.map(imageObject => {
        if(imageObject.id === imageID)
        {
            const scaleObj = {
                "id": imageID,
                "scale": {
                    "scaleX": imageObject.scaleX,
                    "scaleY": imageObject.scaleY
                }
            }

            // setImageScale(scaleObj);
            OnCanvasImageScaled(scaleObj);
        }
    });

    canvas.renderAll();
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