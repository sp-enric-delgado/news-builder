import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import * as CanvasActions from './CanvasElements/CanvasActions'

import '../../styles/CanvasComponent.css'
import {EVENT_ON_FORM_IMAGE_POS_CHANGED, EVENT_ON_FORM_IMAGE_SCALE_CHANGED} from "./FormEvents/FormEvents";

function CanvasComponent({AppImageCollection,
                          OnImageRepositionRequest,
                          OnImageSelectionRequest}) 
{
    const [backgroundWidth, setBackgroundWidth] = useState(0);
    const [backgroundHeight, setBackgroundHeight] = useState(0);

    const [canvas, setCanvas] = useState(null);
    const canvasRef = useRef();

    // const [imageScale, setImageScale] = useState(undefined);

    const canvasDivStyle = {
        width: backgroundWidth,
        height: backgroundHeight
    };


    //#region EVENTS
    useEffect(() => {
        document.addEventListener(EVENT_ON_FORM_IMAGE_POS_CHANGED, (e) =>  translateImage(e.detail));
        document.addEventListener(EVENT_ON_FORM_IMAGE_SCALE_CHANGED, (e) => scaleImage(e.detail));

        return() => {
            document.removeEventListener(EVENT_ON_FORM_IMAGE_POS_CHANGED, (e) => translateImage(e.detail));
            document.removeEventListener(EVENT_ON_FORM_IMAGE_SCALE_CHANGED, (e) => scaleImage(e.detail));
        }
    }, [canvas]);


    useEffect(() => {
        canvas?.on('object:moving', onCanvasImageMoved);

        return() => {
            canvas?.off('object:moving', onCanvasImageMoved);
        }
    }, [canvas]);

    function onCanvasImageMoved(event){
        CanvasActions.dispatchUpdateImagePosition(canvas, event.target.id);
    }

    useEffect(() => {
        canvas?.on('object:scaling', onCanvasImageScaled);

        return() => {
            canvas?.off('object:scaling', onCanvasImageScaled);
        }
    }, [canvas]);

    function onCanvasImageScaled(event){
        CanvasActions.dispatchUpdateImageScale(canvas, event.target.id);
    }
    //#endregion

    useEffect(() => {
        adjustImagePositioning(OnImageRepositionRequest)
    }, [OnImageRepositionRequest])

    useEffect(() => {
        var cnv = new fabric.Canvas(canvasRef.current);
        setCanvas(cnv);

        setBackgroundHeight(1);
        setBackgroundWidth(1);
    }, []);

    useEffect(() => {
        if (canvas == null) return;

        canvas.setWidth(backgroundWidth);
        canvas.renderAll.bind(canvas);

    }, [backgroundWidth]);

    useEffect(() => {
        if (canvas == null) return;

        canvas.setHeight(backgroundHeight);
        canvas.renderAll.bind(canvas);
        
    }, [backgroundHeight]);

    useEffect(() => {
        processImageCollection(AppImageCollection);
    }, [AppImageCollection]);


    useEffect(() => {
        onSelectImage(OnImageSelectionRequest);
    }, [OnImageSelectionRequest])

    // PROCESS INCOMING IMAGE(S)
    function processImageCollection(imageCollection){
        if(canvas ===  null) return;

        for(const [id, image] of Object.entries(imageCollection)){
             addImageToCanvas(image, id);
        }
    }

    async function fabricImageFromURL(image_url) {                                                                          
        return new Promise(function(resolve, reject) {                                                                        
            try {                                                                                                               
                fabric.Image.fromURL(image_url, function (image) {                                                                
                resolve(image);                                                                                                 
            });                                                                                                               
            } catch (error) {                                                                                                   
                reject(error);                                                                                                    
            }                                                                                                                   
        });                                                                                                                   
    }

    async function addImageToCanvas(imageFile, imageID){
        const imageURL = URL.createObjectURL(imageFile);
        canvas.clear();

        try{
            const isBackground = imageID === "background";
            const imageIndex = isBackground ? 0 : -1;

            const img = await fabricImageFromURL(imageURL);;

            img.setOptions({ left: 0, bottom: 0, scaleX: 1, scaleY: 1, selectable: !isBackground, id: imageID});

            if (isBackground) {
                setBackgroundWidth(img.width);
                setBackgroundHeight(img.height);
            }
            else {
                if(img.height > canvas.getHeight()){
                    img.scaleToHeight(canvas.getHeight());
                }
            }

            canvas.insertAt(img, imageIndex);
            canvas.renderAll.bind(canvas);

            CanvasActions.dispatchUpdateImagePosition(canvas, imageID);
            CanvasActions.dispatchUpdateImageScale(canvas, imageID);
        } catch (error) { console.log("[CANVAS COMPONENT] COULDN'T ADD IMAGE TO CANVAS: " + error); }
    }

    function adjustImagePositioning(eventData){
        if(canvas === null) return;
        const canvasImages = canvas.getObjects();
        if(canvasImages.length === 0) return; 

        const imageID = eventData.id;
        const positioning = eventData.positioning;

        canvasImages.map(imageObject => {
            if(imageObject.id === imageID)
            {
                if(positioning === "Backwards"){
                    canvas.sendBackwards(imageObject);
                }
                else{
                    canvas.bringForward(imageObject);
                }
            }
        });

        canvas.renderAll();
    }

    // MOVE IMAGE
    function translateImage(changes){
        if(canvas === null) return;
        if(changes.id === null) return;

        const imageID = changes.id;

        let xPos = changes.pos.x;
        let yPos = changes.pos.y;

        let currentImage;
        const canvasImages = canvas.getObjects();

        canvasImages.map(imageObject => {

            if(imageObject.id === imageID)
            {
                currentImage = imageObject;

                const currentPosition = currentImage.getPointByOrigin('bottom', 'left');

                xPos = (xPos === null || xPos === undefined) ? currentPosition.x : parseInt(xPos);
                yPos = (yPos === null || yPos === undefined) ? currentPosition.y : parseInt(yPos);
                const position = new fabric.Point(xPos, yPos);

                currentImage.setPositionByOrigin(
                    position,
                    'top',
                    'left'
                );

                CanvasActions.dispatchUpdateImagePosition(canvas, imageID);

                canvas.renderAll();
            } 
        });
    }

    // SCALE IMAGE
    function scaleImage(changes){
        if(canvas == null) return;
        if(changes.id === null) return;

        const imageID = changes.id;

        let xScale = changes.scale.x;
        let yScale = changes.scale.y;

        let currentImage;
        const canvasImages = canvas.getObjects();

        canvasImages.map(imageObject => {

            if(imageObject.id === imageID)
            {
                currentImage = imageObject;

                const currentScale = {"x": currentImage.scaleX, "y": currentImage.scaleY};

                xScale = (xScale === null || xScale === undefined) ? currentScale.x : parseFloat(xScale);
                yScale = (yScale === null || yScale === undefined) ? currentScale.y : parseFloat(yScale);

                const scale = {"x": xScale, "y": yScale};

                currentImage.scaleX = scale.x;
                currentImage.scaleY = scale.y;

                CanvasActions.dispatchUpdateImageScale(canvas, imageID)

                currentImage.dirty = true;
                canvas.renderAll();
            } 
        });
    }

    function handleProcessImages(){
        if (canvas) {
            canvas.renderAll();
            const dataURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'test';
            a.click();
        }
    }

    function onSelectImage(itemID){
        if(canvas === null) return;
        if(itemID === null || itemID === "") return;

        const canvasImages = canvas.getObjects();

        if(canvasImages.length === 0) return;

        canvasImages.map(imageObject => {
            if(imageObject.id === itemID){
                canvas.setActiveObject(imageObject);
            }
            else {imageObject.dirty = true;}
        })

        canvas.renderAll();
    }

    return(
        <div className='canvasSection'>
          <h2>Canvas</h2>
          
          <div className='canvasDiv' style={canvasDivStyle}>
            <canvas ref={canvasRef} className='canvasElement'/>
          </div>

          <button onClick={handleProcessImages}>Process Images</button>
        </div>
    );
}

export default CanvasComponent;