import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

import '../../styles/CanvasComponent.css'

function CanvasComponent({AppImageCollection, OnImagePositionChanged, OnImageIDRequested, OnSendImagePosition}) {
    const [backgroundWidth, setBackgroundWidth] = useState(0);
    const [backgroundHeight, setBackgroundHeight] = useState(0);

    const [canvas, setCanvas] = useState(null);
    const canvasRef = useRef();

    const [imagePos, setImagePos] = useState();

    const canvasDivStyle = {
        width: backgroundWidth,
        height: backgroundHeight
    };

    useEffect(() => {
        var cnv = new fabric.Canvas(canvasRef.current);
        setCanvas(cnv);

        setBackgroundHeight(1);
        setBackgroundWidth(1);
    }, []);

    useEffect(() => {
        canvas?.on('object:moving', function(event){
            getImagePosition(event.target.id);
        });
    }, [canvas]);

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
        translateImage(OnImagePositionChanged);
    }, [OnImagePositionChanged]);

    useEffect(() => {
        getImagePosition(OnImageIDRequested);
    }, [OnImageIDRequested])

    useEffect(() => {
        if(imagePos === undefined)  return; 
        
        OnSendImagePosition(imagePos);
    }, [imagePos])


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
            
            if (isBackground) {
                setBackgroundWidth(img.width);
                setBackgroundHeight(img.height);
            }

            img.setOptions({ left: 0, top: 0, scaleX: 1, scaleY: 1, selectable: !isBackground, id: imageID});

            canvas.insertAt(img, imageIndex);
            canvas.renderAll.bind(canvas);

        } catch (error) { console.log("[CANVAS COMPONENT] COULDN'T ADD IMAGE TO CANVAS: " + error); }

        getImagePosition(imageID);
    }

    // MOVE IMAGE
    function translateImage(changes){
        if(canvas == null) return;

        var xPos = changes.positionX;
        var yPos = changes.positionY;
        const imageID = changes.imageID;

        var currentImage;
        const canvasImages = canvas.getObjects();

        canvasImages.map(imageObject => {

            if(imageObject.id === imageID)
            {
                currentImage = imageObject;

                const currentPosition = currentImage.getPointByOrigin('top', 'left');

                xPos = xPos === null ? currentPosition.x : parseInt(xPos);
                yPos = yPos === null ? currentPosition.y : parseInt(yPos);
                
                currentImage.setPositionByOrigin(
                    new fabric.Point(xPos, yPos),
                    'top',
                    'left'
                );

                canvas.renderAll();
            } 
        });
    }

    function getImagePosition(imageID){
        if(canvas === null) return;

        const canvasImages = canvas.getObjects();

        if(canvasImages.length === 0) return; 

        canvasImages.map(imageObject => {
            if(imageObject.id === imageID)
            {
                setImagePos({"id": imageID, "pos": imageObject.getPointByOrigin('center', 'center')});
            }
        });
    }

    function handleProcessImages(){
        if (canvas) {
            const dataURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'test';
            a.click();
        }
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