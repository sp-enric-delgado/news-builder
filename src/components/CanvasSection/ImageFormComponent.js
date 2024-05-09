import React, { useState, useEffect, useRef } from 'react';
import '../../styles/ImageFormComponent.css'

function ImageFormComponent({ProjectName, Template, OnCollectionUpdated, OnImagePositionChanged, OnRetrieveImagePos, OnImagePosRetrieved, OnImageScaleChanged, OnRetrieveImageScale, OnImageScaleRetrieved}) {

    const [imageCollection, updateImageCollection] = useState({});
    const [templateContent, setTemplateContent] = useState([]);

    const [imageXPosition, onImageXPositionChanged] = useState();
    const [imageYPosition, onImageYPositionChanged] = useState();
    const [posDictionary, onPosDictionaryUpdated] = useState({});

    const [imageXScale, onImageXScaleChanged] = useState();
    const [imageYScale, onImageYScaleChanged] = useState();
    const [scaleDictionary, onScaleDictionaryUpdated] = useState({});

    const [imageID, onImageIDChanged] = useState();

    const [imagePositionDict, setImagePositionDict] = useState({});
    const [imageScaleDict, setImageScaleDict] = useState({});

    // IN ORDER TO DYNAMICALLY GET THE POSITION OF THE IMAGE, THIS SHOULD BE AN EVENT
    const onImagePosRetrieved = new Event('onImagePosRetrieved');
    const onImageScaleRetrieved = new Event('onImageScaleRetrieved');
    const documentRef = useRef(document);

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
      OnImagePositionChanged(posDictionary);
    }, [posDictionary])

    useEffect(() => {
      OnImageScaleChanged(scaleDictionary);
    }, [scaleDictionary])

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

      onImageIDChanged(id);

      var isXAxis = axis === "x";
      var isYAxis = axis === "y";

      const changes = {
        "positionX": isXAxis ? imageXPosition : null,
        "positionY": isYAxis ? imageYPosition : null,
        "imageID": imageID
      }

      onPosDictionaryUpdated(changes);

      if(isXAxis) onImageXPositionChanged(event.target.value);
      else onImageYPositionChanged(event.target.value);

      getImagePosition(imageID);
    }

    function getImagePosition(imageID){
      if(imageID === "" || imageID === undefined) return

      // console.log("0.1. [IMAGE FORM COMPONENT] IMAGE FORM COMPONENT SENDING ID: " + imageID);
      OnRetrieveImagePos(imageID);
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

    function generateInputFields() {
      if (Array.isArray(templateContent) && templateContent.length > 0)
      {
        return(
          <div>
            <h1>{Template}</h1>
            {
              templateContent[0].map((item, index) => {

                documentRef.current.addEventListener('onImagePosRetrieved', (event) => {
                  var positionData = imagePositionDict;
                  positionData[event.detail.id] = event.detail.pos;

                  setImagePositionDict(positionData);
                });

                documentRef.current.addEventListener('onImageScaleRetrieved', (event) => {
                  var scaleData = imageScaleDict;

                  scaleData[event.detail.id] = event.detail.scale;
                  setImageScaleDict(scaleData);
                });

                //console.log("12. [IMAGE FORM COMPONENT] RECIEVED X: " + itemPosX + " AND Y: " + itemPosY + " FOR ITEM: " + item.id);

                return(
                  <div key={index}>
                    <div>
                      <h3>{item.name}</h3>
                        <div>
                          <label htmlFor={item.id}>Image: </label>
                          <input id={item.id} type='file' accept='*.png' onChange={handleImageUpload}/>
                        </div>
                        { item.id !== "background" && 
                          <div>
                            <div>
                              <label htmlFor={item.id + "_x"}>X: </label>
                              <input id={item.id + "_x"} 
                                      type='number' 
                                      onKeyUpCapture={(event) => handleImagePositionInput("x", event, item.id)} 
                                      onChange={(event) => handleImagePositionInput("x", event, item.id)} 
                                      defaultValue={imagePositionDict[item.id]?.x}/> 
                            </div>
                            <div>
                              <label htmlFor={item.id + "_y"}>Y: </label>
                              <input id={item.id + "_y"} 
                                      type='number' 
                                      onKeyUpCapture={(event) => handleImagePositionInput("y", event, item.id)} 
                                      onChange={(event) => handleImagePositionInput("y", event, item.id)} 
                                      defaultValue={imagePositionDict[item.id]?.y}/> 
                            </div>
  
                            <div>
                              <div>
                                <label htmlFor={item.id + "_scaleX"}>X Scale: </label>
                                <input id={item.id + "_scaleX"} 
                                       type='number'
                                       step="0.1"
                                       onKeyUpCapture={(event) => handleImageScaleInput("x", event, item.id)} 
                                       onChange={(event) => handleImageScaleInput("x", event, item.id)} 
                                       defaultValue={imageScaleDict[item.id]?.scaleX}
                                /> 
                              </div>
                              <div>
                                <label htmlFor={item.id + "_scaleY"}>Y Scale: </label>
                                <input id={item.id + "_scaleY"} 
                                       type='number'
                                       step="0.1"
                                       onKeyUpCapture={(event) => handleImageScaleInput("y", event, item.id)} 
                                       onChange={(event) => handleImageScaleInput("y", event, item.id)} 
                                       defaultValue={imageScaleDict[item.id]?.scaleY}
                                /> 
                              </div>
                            </div>
                          </div>
                        }
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