import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import './styles/App.css'
import CanvasComponent from './components/CanvasComponent.js';
import ImageFormComponent from './components/ImageFormComponent.js';
import DropdownComponent from './components/DropdownComponent.js';

function App(){
  const [composition, setComposition] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState();

  function handleTemplateUpload(uploadedTemplate) {
    setTemplates(prevTemplates => [...prevTemplates, uploadedTemplate]);
  }

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
          <DropdownComponent OnTemplateUploaded={handleTemplateUpload} OnSelectedTemplate={setCurrentTemplate} />
          <ImageFormComponent Template={currentTemplate} OnCollectionUpdated={setComposition}/>
        </div>
      </div>
    </div>
  );
};

export default App;
