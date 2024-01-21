import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import './styles/App.css'
import CanvasComponent from './components/CanvasComponent.js';
import ImageFormComponent from './components/ImageFormComponent.js';

function App(){
  const [composition, setComposition] = useState([]);

  return (
    <div className='page'>
      <div className='pageHeader'>
        <h1>Image Composer</h1>
      </div>
      
      <div className='pageBody'>
        <ImageFormComponent OnCollectionUpdated={setComposition}/>
        <CanvasComponent AppImageCollection={composition}/> 
      </div>
    </div>
  );
};

export default App;
