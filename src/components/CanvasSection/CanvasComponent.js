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
        console.log("1. [CANVAS COMPONENT] APP IMAGE COLLECTION UPDATED!");
        processImageCollection(AppImageCollection);
    }, [AppImageCollection]);

    useEffect(() => {
        translateImage(OnImagePositionChanged);
    }, [OnImagePositionChanged]);

    useEffect(() => {
        getImagePosition(OnImageIDRequested);
    }, [OnImageIDRequested])

    useEffect(() => {
        if(imagePos === undefined) {    
            console.log("8. [CANVAS COMPONENT] IMAGE POSITION IS UNDEFINED");
            return;
        }
        console.log("8. [CANVAS COMPONENT] SENDING IMAGE POS: " + imagePos);
        OnSendImagePosition(imagePos);
    }, [imagePos])


    // PROCESS INCOMING IMAGE(S)
    function processImageCollection(imageCollection){
        if(canvas ===  null) return;

        console.log("2. [CANVAS COMPONENT] PROCESSING IMAGE COLLECTION...");
        for(const [id, image] of Object.entries(imageCollection)){
            addImageToCanvas(image, id);
        }

        //canvas.renderAll();
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

    // ADD IMAGE TO CANVAS
    async function addImageToCanvas(imageFile, imageID){
        console.log("3. [CANVAS COMPONENT] ADDING IMAGES TO CANVAS...");
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

            console.log("4. [CANVAS COMPONENT] POPULATING CANVAS! ADDING IMAGE: " + img.id);
            canvas.insertAt(img, imageIndex);
            // debugger;

            canvas.renderAll.bind(canvas);

            // debugger;

        } catch (error) { console.log("4. [CANVAS COMPONENT] COULDN'T ADD IMAGE TO CANVAS: " + error); }

        console.log("5. [CANVAS COMPONENT] CANVAS POPULATED! CURRENT CANVAS IMAGES: " + canvas.getObjects().length)
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
                /* 
                
                TO DO
                    - MAKE FORM DISPLAY CURRENT POS OF THE IMAGE
                    - CHANGE AUTO REFLECTS ON IMAGE
                    - FINE TUNE IMAGE SELECTION WHEN PARAMETRISING
                    - HIGHLIGHT CURRENT SELECTED IMAGE
                    
                */

                currentImage = imageObject;

                const currentPosition = currentImage.getPointByOrigin('center', 'center');

                xPos = xPos === null ? currentPosition.x : parseInt(xPos);
                yPos = yPos === null ? currentPosition.y : parseInt(yPos);
                
                currentImage.setPositionByOrigin(
                    new fabric.Point(xPos, yPos),
                    'center',
                    'center'
                );

                canvas.renderAll();
            } 
        });
    }

    function getImagePosition(imageID){
        if(canvas === null) return;

        console.log("6. [CANVAS COMPONENT] GETTING IMAGE POS FOR ID: " + imageID);

        const canvasImages = canvas.getObjects();
        // debugger;

        if(canvasImages.length === 0) {
            console.log("7. CANVAS COMPONENT] CANVAS IS EMTPY! CURRENT CANVAS IMAGES: " + canvasImages.length);
            return;
        }

        //debugger;

        canvasImages.map(imageObject => {
            if(imageObject.id === imageID)
            {
                setImagePos(imageObject.getPointByOrigin('center', 'center'));
                console.log("7. [CANVAS SECTION] IMAGE POS FOR " + imageID + " FOUND!: " + imagePos);
            }
            // else{
            //     console.log("7. [CANVAS COMPONENT] IMAGE POSITION FOR " + imageID + " NOT FOUND!");
            // }
        });
    }

    // IMAGE PROCESS
    //      - Current Purpose: downloading the composed image
    //      - Future Purpose: uploading it to the AM
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