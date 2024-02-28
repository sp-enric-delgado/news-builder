import React, { useState } from 'react';

import '../styles/CanvasSection.css'
import CanvasComponent from '../components/CanvasSection/CanvasComponent.js';
import ImageFormComponent from '../components/CanvasSection/ImageFormComponent.js';
import DropdownComponent from '../components/CanvasSection/DropdownComponent.js';

function CanvasSection(){
  const [composition, setComposition] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState();

  return (
    <div className='page'>
      <div className='pageHeader'>
        <h1>Image Composer</h1>
      </div>
      
      <div className='pageBody'>
        <div className='pageBody-left'>
          <CanvasComponent AppImageCollection={composition}/> 
        </div>

        <div className='pageBody-right'>
          <DropdownComponent OnSelectedTemplate={setCurrentTemplate} />
          <ImageFormComponent Template={currentTemplate} OnCollectionUpdated={setComposition}/>
        </div>
      </div>
    </div>
  );
};

export default CanvasSection;