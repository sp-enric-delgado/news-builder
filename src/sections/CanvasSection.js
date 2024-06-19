import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import '../styles/CanvasSection.css'
import CanvasComponent from '../components/CanvasSection/CanvasComponent.js';
import ImageFormComponent from '../components/CanvasSection/ImageFormComponent.js';
import DropdownComponent from '../components/CanvasSection/DropdownComponent.js';

function CanvasSection(){
  const location = useLocation();
  const projectName = location.state?.projectName;

  const [currentTemplate, setCurrentTemplate] = useState();


  return (
    <div className='page'>
      <div className='pageHeader'>
        <h1>Image Composer</h1>
        <h2>{projectName}</h2>
      </div>
      
      <div className='pageBody'>
        <div className='pageBody-left'>
          <CanvasComponent />
        </div>

        <div className='pageBody-right'>
          <DropdownComponent ProjectName={projectName}  OnSelectedTemplate={setCurrentTemplate}/>
          <ImageFormComponent ProjectName={projectName} 
                              Template={currentTemplate}
          />
        </div>
      </div>
    </div>
  );
}

export default CanvasSection;