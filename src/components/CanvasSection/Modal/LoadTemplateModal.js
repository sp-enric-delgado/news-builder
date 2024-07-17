import { useState } from 'react';
import {Modal, Box, Typography, Container, Button} from '@mui/material';
import { ImCross } from "react-icons/im";

import UploadFileModalSection from './UploadFileModalSection';
import '../../../styles/Modal/LoadTemplateModal.css'

function LoadTemplateModal({setOpenModal, onNewTemplateAdded, projectName}){
    
    const [template, setTemplate] = useState({});

    function handleDroppedFile(){
        saveTemplate(template);
        onNewTemplateAdded(template);
        setOpenModal(false);
    }

    /* HERE DO THE CODE CHECK AND UPLOAD TO SERVER */
    const saveTemplate = async (template) => {
        try{
            const response = await fetch(`http://localhost:3001/templates?projectName=${projectName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(template),
            });
        }
        catch(error){
            console.error('Error saving template: ', error);
        }
    }


    return(
        <Modal open={setOpenModal} onClose={() => {setOpenModal(false)}}
               sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
            >
            <Box sx={{width: .45, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', py: 8, borderRadius: 10}}>
                <Box>
                    <Typography variant="h2">Upload the template</Typography>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <UploadFileModalSection onDrop={setTemplate} />
                </Box>

                <Box>
                    <Button onClick={handleDroppedFile}>Upload</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default LoadTemplateModal;