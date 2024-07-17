import React, { useState } from 'react';
import { BsFiletypeJson } from "react-icons/bs";

import '../../../styles/Modal/UploadFileModalSection.css';
import {Box, Container, Input, Typography} from "@mui/material";

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
      <Box ondragenter={handleDragEnter} ondragleave={handleDragLeave} ondrop={handleDrop}
        sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my: 3, padding: 5, border: '2px dashed #ccc', borderRadius: '.75em', width: 1, gap: '5rem'}}>
        <Box>
          <Typography variant="p">Drag and drop a JavaScript file here, or click to select a file</Typography>
        </Box>

        <Box >
          <Input className='fileInput' type='file' accept='*.json' onChange={handleDrop}/>
        </Box>
      </Box>

      /*
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
  */
  );
}

export default UploadFileModalSection;