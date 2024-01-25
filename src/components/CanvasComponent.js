import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import axios from 'axios';

import '../styles/CanvasComponent.css'

function CanvasComponent({AppImageCollection}) {
    const [backgroundWidth, setBackgroundWidth] = useState(0);
    const [backgroundHeight, setBackgroundHeight] = useState(0);

    const [canvas, setCanvas] = useState(null);
    const canvasRef = useRef();
    const canvasDivRef = useRef(null);

    useEffect(() => {
        setCanvas(new fabric.Canvas(canvasRef.current, { width: backgroundWidth, height: backgroundHeight }));
    }, [backgroundWidth, backgroundHeight]);

    useEffect(() => {
        processImageCollection(AppImageCollection);
    }, [AppImageCollection]);

    // PROCESS INCOMING IMAGE(S)
    function processImageCollection(imageCollection){
        if(canvas ===  null) return;

        console.log(imageCollection)
        for(const [id, image] of Object.entries(imageCollection)){
            addImageToCanvas(image, id === "background");
        }

        canvas.renderAll();
    }

    // ADD IMAGE TO CANVAS
    function addImageToCanvas(imageFile, isBackground){
        const imageURL = URL.createObjectURL(imageFile);
        canvas.clear();

        try{
            const imageIndex = isBackground ? 0 : -1;

            fabric.Image.fromURL(imageURL, (img) => {
                if(isBackground) resizeCanvas(img);
                img.set({ left: 0, top: 0, scaleX: 1, scaleY: 1, selectable: !isBackground });
                canvas.insertAt(img, imageIndex).renderCanvas.bind(canvas);
                console.log("ADDING IMAGE TO CANVAS: " + img);
            });

            } catch (error) { console.log("COULDN'T ADD IMAGE TO CANVAS: " + error); }
    }

    // RESIZE CANVAS AND CANVAS CONTAINER TO FIT BACKGROUND
    function resizeCanvas(backgroundImage){
        setBackgroundWidth(backgroundImage.width); 
        setBackgroundHeight(backgroundImage.height);

        canvasDivRef.current.style.width = `${backgroundImage.width}px`;
        canvasDivRef.current.style.height = `${backgroundImage.height}px`;
    }

    // AXIOS IMAGE PROCESS
    //      - Current Purpose: downloading the composed image
    //      - Future Purpose: uploading it to the AM
    function handleProcessImages(){
        // TO BE DONE
    }

    return(
        <div className='canvasSection'>
          <h2>Canvas</h2>
          
          <div ref={canvasDivRef} className='canvasDiv'>
            <canvas ref={canvasRef} className='canvasElement'/>
          </div>

          <button onClick={handleProcessImages}>Process Images</button>
        </div>
    );
}

export default CanvasComponent;