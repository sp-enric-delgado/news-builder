import React, { useState, useEffect } from 'react';
import '../../styles/ImageFormComponent.css'
import {EVENT_ON_CANVAS_GET_IMAGE_POSITION, EVENT_ON_CANVAS_GET_IMAGE_SCALE} from "./CanvasElements/CanvasEvents";
import * as FormEvent from './FormEvents/FormEvents'

function ImageFormComponent({ProjectName, 
                             Template, 
                             OnImageRepositionRequest,
                             OnImageSelectionRequest}) 
{

    const [imageCollection, updateImageCollection] = useState({});
    const [templateContent, setTemplateContent] = useState([]);

    const [imagePositionDict, setImagePositionDict] = useState({});
    const [imageScaleDict, setImageScaleDict] = useState({});
    const [imageRepositionData, setImageRepositionData] = useState({});
    const [imageSelectionData, setImageSelectionData] = useState("");

    //#region EVENT SUBSCRIPTION
    // Update Image Position
    useState(() => {
        document.addEventListener(EVENT_ON_CANVAS_GET_IMAGE_POSITION, (e) => updateImagePositionValue(e.detail));

        return () => {
            document.removeEventListener(EVENT_ON_CANVAS_GET_IMAGE_POSITION, (e) => updateImagePositionValue(e.detail));
        }
    }, [imagePositionDict])

    // Update Image Scale
    useState(() => {
        document.addEventListener(EVENT_ON_CANVAS_GET_IMAGE_SCALE, (e) => updateImageScaleValue(e.detail));

        return () => {
            document.removeEventListener(EVENT_ON_CANVAS_GET_IMAGE_SCALE, (e) => updateImageScaleValue(e.detail));
        }
    }, [imageScaleDict])
    //#endregion

    // Fetching the DB  to get the template's data
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

    // THIS IS CANVAS DATA THAT COULD BE
    useEffect(() => {
      if(imageRepositionData === undefined) return

      OnImageRepositionRequest(imageRepositionData);
    }, [imageRepositionData])

    useEffect(() => { 
      OnImageSelectionRequest(imageSelectionData);
    }, [imageSelectionData])


    function handleImageUpload(event, index){
        const uploadedImageFile = event.target.files[0];
        const imageID = event.target.id;

        const newCollection = {
            ...imageCollection,
            [imageID]: {
                "file": uploadedImageFile,
                "index": index
            }
        };

        console.log(imageID + " with index " + index);
        
        updateImageCollection(newCollection);
    }

    function handleImagePositionInput(axis, value, id){
        //1. Get input data
        const isXAxis = axis === "x";
        const isYAxis = axis === "y";

        const changes = {
            "id": id,
            "pos": {
                "x": isXAxis ? value : imagePositionDict[id]?.x,
                "y": isYAxis ? value : imagePositionDict[id]?.y,
            }
        };

        //2. Send position to canvas image with ID and place it
        FormEvent.dispatchEventOnFormImagePosChanged(changes);
    }

    function handleImageScaleInput(axis, value, id){
        const isXAxis = axis === "x";
        const isYAxis = axis === "y";

        const changes = {
            "id": id,
            "scale": {
                x: isXAxis ? value : imageScaleDict[id]?.x,
                y: isYAxis ? value : imageScaleDict[id]?.y
            }
        };

        FormEvent.dispatchEventOnFormImageScaleChanged(changes);
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
        const newImagePositionDict = {...imagePositionDict};
        newImagePositionDict[data.id] = data.pos;

        setImagePositionDict(newImagePositionDict);
    }

    function updateImageScaleValue(data){
        const newImageScaleDict = {...imageScaleDict};
        newImageScaleDict[data.id] = data.scale;

        setImageScaleDict(newImageScaleDict);
    }

    function generateInputFields() {
      if (Array.isArray(templateContent) && templateContent.length > 0)
      {
        return(
          <div>
            <h1>{Template}</h1>
            {
              templateContent[0].map((item, index) => {

                return(
                  <div key={index}>
                    <div className='element'>
                      <h3>{item.name}</h3>
                        <div>
                          <label htmlFor={item.id}>Image: </label>
                          <input id={item.id} type='file' accept='*.png' onChange={ (e) => handleImageUpload(e, index)}/>
                        </div>
                        { item.id !== "background" && 
                          <div className='components'>
                            <div>
                              <div>
                                <label htmlFor={item.id + "_x"}>X: </label>
                                <input id={item.id + "_x"} 
                                        type='number'
                                        onChange={(event) => handleImagePositionInput("x", event.target.value, item.id)}
                                        value={imagePositionDict[item.id]?.x}/>
                              </div>
                              <div>
                                <label htmlFor={item.id + "_y"}>Y: </label>
                                <input id={item.id + "_y"} 
                                        type='number'
                                        onChange={(event) => handleImagePositionInput("y", event.target.value, item.id)}
                                        value={imagePositionDict[item.id]?.y}/>
                              </div>
                            </div>

                            <div>
                              <div>
                                <label htmlFor={item.id + "_scaleX"}>X Scale: </label>
                                <input id={item.id + "_scaleX"} 
                                       type='number'
                                       step="0.1"
                                       onChange={(event) => handleImageScaleInput("x", event.target.value, item.id)}
                                       value={imageScaleDict[item.id]?.x}/>
                              </div>
                              <div>
                                <label htmlFor={item.id + "_scaleY"}>Y Scale: </label>
                                <input id={item.id + "_scaleY"} 
                                       type='number'
                                       step="0.1"
                                       onChange={(event) => handleImageScaleInput("y", event.target.value, item.id)}
                                       value={imageScaleDict[item.id]?.y}/>
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
                    {/*<button onClick={() => { OnCollectionUpdated(imageCollection); }}> Render </button>*/}
                    <button onClick={() => FormEvent.dispatchEventOnFormRenderRequest(imageCollection)}> Render </button>

                </div>
            </div>
        </div>
    );
};

export default ImageFormComponent;