import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import '../styles/CanvasSection.css'
import CanvasComponent from '../components/CanvasSection/CanvasComponent.js';
import ImageFormComponent from '../components/CanvasSection/ImageFormComponent.js';
import DropdownComponent from '../components/CanvasSection/DropdownComponent.js';

function CanvasSection(){
  const location = useLocation();
  const [projectName, setProjectName] = useState(location.state?.projectName);
  const [composition, setComposition] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState();

  const [changedImage, setChangedImage] = useState({});
  const [imageID, setImageID] = useState("");
  const [imagePosition, setImagePosition] = useState({});

  return (
    <div className='page'>
      <div className='pageHeader'>
        <h1>Image Composer</h1>
        <h2>{projectName}</h2>
      </div>
      
      <div className='pageBody'>
        <div className='pageBody-left'>
          <CanvasComponent AppImageCollection={composition} OnImagePositionChanged={changedImage} OnImageIDRequested={imageID} OnSendImagePosition={setImagePosition}/> 
        </div>

        <div className='pageBody-right'>
          <DropdownComponent ProjectName={projectName}  OnSelectedTemplate={setCurrentTemplate}/>
          <ImageFormComponent ProjectName={projectName} Template={currentTemplate} OnCollectionUpdated={setComposition} OnImagePositionChanged={setChangedImage} OnRetrieveImagePos={setImageID} OnImagePosRetrieved={imagePosition}/>
        </div>
      </div>
    </div>
  );
};

export default CanvasSection;