import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import '../styles/CanvasSection.css'
import CanvasComponent from '../components/CanvasSection/CanvasComponent.js';
import ImageFormComponent from '../components/CanvasSection/ImageFormComponent.js';
import DropdownComponent from '../components/CanvasSection/DropdownComponent.js';

function CanvasSection(){
  const location = useLocation();
  const [projectName, setProjectName] = useState(location.state.projectName);
  const [composition, setComposition] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState();


  return (
    <div className='page'>
      <div className='pageHeader'>
        <h1>Image Composer</h1>
        <h2>{projectName}</h2>
      </div>
      
      <div className='pageBody'>
        <div className='pageBody-left'>
          <CanvasComponent AppImageCollection={composition}/> 
        </div>

        <div className='pageBody-right'>
          <DropdownComponent OnSelectedTemplate={setCurrentTemplate} ProjectName={projectName}/>
          <ImageFormComponent Template={currentTemplate} OnCollectionUpdated={setComposition}/>
        </div>
      </div>
    </div>
  );
};

export default CanvasSection;