import React, { useState, useEffect, useRef } from 'react';
import '../../styles/ImageFormComponent.css'
import { json } from 'react-router-dom';
import {EVENT_ON_CANVAS_GET_IMAGE_POSITION} from "./CanvasElements/CanvasEvents";
import * as FormEvent from './FormEvents/FormEvents'

function ImageFormComponent({ProjectName, 
                             Template, 
                             OnCollectionUpdated, 
                             OnImagePositionChanged, 
                             OnRetrieveImagePos, 
                             OnImagePosRetrieved, 
                             OnImageScaleChanged, 
                             OnRetrieveImageScale, 
                             OnImageScaleRetrieved, 
                             OnImageRepositionRequest, 
                             OnImageSelectionRequest}) 
{

    const [imageCollection, updateImageCollection] = useState({});
    const [templateContent, setTemplateContent] = useState([]);

    const [imageXScale, onImageXScaleChanged] = useState();
    const [imageYScale, onImageYScaleChanged] = useState();
    const [scaleDictionary, onScaleDictionaryUpdated] = useState({});

    const [imageID, onImageIDChanged] = useState();

    const [imagePositionDict, setImagePositionDict] = useState({});
    const [imageScaleDict, setImageScaleDict] = useState({});
    const [imageRepositionData, setImageRepositionData] = useState({});
    const [imageSelectionData, setImageSelectionData] = useState("");

    const documentRef = useRef(document);

    useState(() => {
        documentRef.current.addEventListener(EVENT_ON_CANVAS_GET_IMAGE_POSITION, (e) => updateImagePositionValue(e.detail));

        return () => {
            documentRef.current.removeEventListener(EVENT_ON_CANVAS_GET_IMAGE_POSITION, (e) => updateImagePositionValue(e.detail));
        }
    }, [imagePositionDict])

    useEffect(() => {
      fetch(`http://localhost:3001/templates?projectName=${encodeURIComponent(ProjectName)}`)
      .then((response) => response.json())
      .then((data) => {
        const currentTemplate = data.filter((item) => item.name === Template);
        const currentContent = currentTemplate.map((item) => item.content);
        setTemplateContent(currentContent);
      })
      .catch((error) => {
        console.error("[IMAGE FORM COMPONENT] COULDN'T GET TEMPLATE CONTENT: " + error);
      });
    }, [Template])

    useEffect(() => {
      // console.log("10. [IMAGE FORM COMPONENT] IMAGE POSITION RETRIEVED! CALLING EVENT...");
      if(OnImagePosRetrieved === undefined) return;

      const customPosEvent = new CustomEvent('onImagePosRetrieved', {detail: OnImagePosRetrieved});
      documentRef.current.dispatchEvent(customPosEvent);
    }, [OnImagePosRetrieved])

    useEffect(() => {
      // console.log("10. [IMAGE FORM COMPONENT] IMAGE POSITION RETRIEVED! CALLING EVENT...");
      if(OnImageScaleRetrieved === undefined) return;

      const customScaleEvent = new CustomEvent('onImageScaleRetrieved', {detail: OnImageScaleRetrieved});
      documentRef.current.dispatchEvent(customScaleEvent);
    }, [OnImageScaleRetrieved])

    useEffect(() => {
      if(imageRepositionData === undefined) return

      OnImageRepositionRequest(imageRepositionData);
    }, [imageRepositionData])

    useEffect(() => {
      OnImageScaleChanged(scaleDictionary);
    }, [scaleDictionary])

    useEffect(() => { 
      OnImageSelectionRequest(imageSelectionData);
    }, [imageSelectionData])


    function handleImageUpload(event){
        const uploadedImageFile = event.target.files[0];
        const imageID = event.target.id;
        
        const newCollection = {
            ...imageCollection,
            [imageID]: uploadedImageFile
        };
        
        updateImageCollection(newCollection);
    }

    function handleImagePositionInput(axis, event, id){
        //1. Get input data
        const isXAxis = axis === "x";
        const isYAxis = axis === "y";

        const changes = {
            "pos": {
                "x": isXAxis ? event.target.value : imagePositionDict[id]?.x,
                "y": isYAxis ? event.target.value : imagePositionDict[id]?.y,
            },
            "id": id
        }

        //2. Send position to canvas image with ID and place it
        FormEvent.dispatchEventOnFormImagePosChanged(changes);

        //3. Retrieve position canvas
        //FormEvent.dispatchEventOnFormRequestCanvasImagePos(changes.id);

        //3.2 Update the position Dictionary accordingly
    }

    function handleImageScaleInput(axis, event, id){

      onImageIDChanged(id);

      var isXAxis = axis === "x";
      var isYAxis = axis === "y";

      const changes = {
        "scaleX": isXAxis ? imageXScale : null,
        "scaleY": isYAxis ? imageYScale : null,
        "imageID": imageID
      }

      onScaleDictionaryUpdated(changes);

      if(isXAxis) onImageXScaleChanged(event.target.value);
      else onImageYScaleChanged(event.target.value);

      getImageScale(imageID);
    }

    function getImageScale(imageID){
      if(imageID === "" || imageID === undefined) return

      // console.log("0.1. [IMAGE FORM COMPONENT] IMAGE FORM COMPONENT SENDING ID: " + imageID);
      OnRetrieveImageScale(imageID);
    }

    function onImageReposition(itemID, positioning){
      if(itemID === null || itemID === "") return;

      const repositionData = {
        "id": itemID,
        "positioning": positioning
      }

      setImageRepositionData(repositionData);
    } 

    function onImageSelect(itemID){
      if(itemID === null || itemID === "") return;

      setImageSelectionData(itemID);
    }

    function updateImagePositionValue(data){
        // console.log("[ImageFormComponent] Listening to " + EVENT_ON_CANVAS_GET_IMAGE_POSITION + " and receiving", event.detail);

        const newImagePositionDict = {...imagePositionDict};
        newImagePositionDict[data.id] = data.pos;

        setImagePositionDict(newImagePositionDict);

        console.log("[IFC] Pos received through event: ", data.pos, "Pos set in state: ", imagePositionDict[data.id]);
    }

    function generateInputFields() {
      if (Array.isArray(templateContent) && templateContent.length > 0)
      {
        return(
          <div>
            <h1>{Template}</h1>
            {
              templateContent[0].map((item, index) => {



                documentRef.current.addEventListener('onImageScaleRetrieved', (event) => {
                  var scaleData = imageScaleDict;

                  scaleData[event.detail.id] = event.detail.scale;
                  setImageScaleDict(scaleData);
                });

                return(
                  <div key={index}>
                    <div className='element'>
                      <h3>{item.name}</h3>
                        <div>
                          <label htmlFor={item.id}>Image: </label>
                          <input id={item.id} type='file' accept='*.png' onChange={handleImageUpload}/>
                        </div>
                        { item.id !== "background" && 
                          <div className='components'>
                            <div>
                              <div>
                                <label htmlFor={item.id + "_x"}>X: </label>
                                <input id={item.id + "_x"} 
                                        type='number'
                                        onChange={(event) => handleImagePositionInput("x", event, item.id)}
                                        value={imagePositionDict[item.id]?.x}/>
                              </div>
                              <div>
                                <label htmlFor={item.id + "_y"}>Y: </label>
                                <input id={item.id + "_y"} 
                                        type='number'
                                        onChange={(event) => handleImagePositionInput("y", event, item.id)} 
                                        value={imagePositionDict[item.id]?.y}/>
                              </div>
                            </div>
                            <div>
                              <div>
                                <label htmlFor={item.id + "_scaleX"}>X Scale: </label>
                                <input id={item.id + "_scaleX"} 
                                       type='number'
                                       step="1"
                                       onKeyUpCapture={(event) => handleImageScaleInput("x", event, item.id)} 
                                       onChange={(event) => handleImageScaleInput("x", event, item.id)} 
                                       value={imageScaleDict[item.id]?.scaleX}
                                /> 
                              </div>
                              <div>
                                <label htmlFor={item.id + "_scaleY"}>Y Scale: </label>
                                <input id={item.id + "_scaleY"} 
                                       type='number'
                                       step="1"
                                       onKeyUpCapture={(event) => handleImageScaleInput("y", event, item.id)} 
                                       onChange={(event) => handleImageScaleInput("y", event, item.id)} 
                                       value={imageScaleDict[item.id]?.scaleY}
                                /> 
                              </div>
                            </div>

                            <div>
                              <label htmlFor="layer-buttons">Layer Order</label>
                              <div id="layer-buttons">
                                <button onClick={(event) => onImageReposition(item.id, "Forward")}>Bring Forward</button>
                                <button onClick={(event) => onImageReposition(item.id, "Backwards")}>Bring Backwards</button>
                              </div>
                            </div>

                            <div className='selection-component'>
                              <label htmlFor="selection-button">Select Object</label>
                              <button className="selected" id="selection-button" onClick={(event) => onImageSelect(item.id)}>Select</button>
                            </div>

                            <div>

                            </div>
                          </div>
                        }
                        <div>
                          <hr />
                        </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        );
      } 
      else
      {
        return <div>
          <h1>Select Template...</h1>
        </div>;
      }
    }

    return (
        <div className='content'>
            <div className='fieldsSection'>
              <div>
                {generateInputFields()}
              </div>
              
              <div>
                <button onClick={() => { OnCollectionUpdated(imageCollection); }}>Render</button>
              </div>
            </div>
        </div>
    );
};

export default ImageFormComponent;