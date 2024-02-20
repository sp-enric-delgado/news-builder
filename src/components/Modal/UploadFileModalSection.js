import React, { useState } from 'react';
import { BsFiletypeJson } from "react-icons/bs";

import '../../styles/Modal/UploadFileModalSection.css';

function UploadFileModalSection({onDrop}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragEnter = event => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = event => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = event => {
    event.preventDefault();
    setDragOver(false); 

    const files = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.addEventListener("load", (event) => {
        const result = JSON.parse(reader.result);
        onDrop(result);
      });

      reader.readAsText(file);
    }
  };

  return (
    <div>
      <div onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`file-dropzone ${dragOver ? 'is-active' : ''}`}>
        <div className='file-dropzone--text'>
          <p className='text'>Drag and drop a JavaScript file here, or click to select a file</p>
        </div>

        <div className='file-dropzone--icon'>
          <BsFiletypeJson className='icon'/>
        </div>
        
        <div className='file-dropzone--fileInput'>
          <input className='fileInput' type='file' accept='*.json' onChange={handleDrop}/>
        </div>
      </div>
    </div>

  );
};

export default UploadFileModalSection;