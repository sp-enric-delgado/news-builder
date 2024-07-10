import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import '../styles/CanvasSection.css'
import CanvasComponent from '../components/CanvasSection/CanvasComponent.js';
import ImageFormComponent from '../components/CanvasSection/ImageFormComponent.js';
import DropdownComponent from '../components/CanvasSection/DropdownComponent.js';
import {Box, Container, Typography} from "@mui/material";

function CanvasSection(){
  const location = useLocation();
  const projectName = location.state?.projectName;

  const [currentTemplate, setCurrentTemplate] = useState();


  return (
    <Container sx={{minWidth: 'calc(100vw - (100vw - 100%))'}}>
      <Container sx={{minWidth:'100%'}}>
        <Typography variant="h1">Image Composer</Typography>
        <Typography variant="h2">{projectName}</Typography>
      </Container>
      <Container sx={{my: 5, p:3, display: 'flex', flexDirection: 'column', minWidth: "100%", justifyContent: 'space-between', gap: 3}}>
          <Box>
              <DropdownComponent ProjectName={projectName}  OnSelectedTemplate={setCurrentTemplate}/>
          </Box>
          <Container sx={{minWidth:'100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: "1.5"}}>
            <Box sx={{ width: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
              <CanvasComponent />
            </Box>

            <Box sx={{ width: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
              <ImageFormComponent ProjectName={projectName}
                                  Template={currentTemplate}
              />
            </Box>
          </Container>
      </Container>
    </Container>
  );
}

export default CanvasSection;