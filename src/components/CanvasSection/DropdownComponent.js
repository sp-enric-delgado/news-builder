import { useEffect, useState } from 'react';

import '../../styles/DropdownComponent.css'
import LoadTemplateModal from './Modal/LoadTemplateModal';
import {Button, Container, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

function DropdownComponent({ProjectName, OnSelectedTemplate}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState('');
    const [currentTemplates, setCurrentTemplates] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/templates?projectName=${encodeURIComponent(ProjectName)}`)
        .then((response) => response.json())
        .then((data) => {
            const templateNames = data.map((item) => item.name);
            setCurrentTemplates(templateNames);
        })
        .catch((error) => console.error('ERROR GETTING TEMPLATES FOR DROPDOWN: ' + error));
    }, [newTemplate]);

    const handleLoadedTemplate = (newUploadedTemplate) => {
        /*
            FILE VERIFICATION HAS TO BE INCLUDED

            THIS LAUNCHES WHEN THE UPLOAD BUTTON OF THE MODAL HAS BEEN PRESSED
            ADDS THE NEW UPLOADED FILE TO THE OPTIONS LIST
        */
        setNewTemplate(newUploadedTemplate);
    };

    const handleOptionClick = (option) => {
        OnSelectedTemplate(option);
    };


    return (
        <Container sx={{display: 'flex', justifyContent: 'center', my: 1}}>
            <FormControl sx={{ width: 0.5}}>
                <InputLabel id="dropdown">Select Template...</InputLabel>
                <Select id="dropdown" label="Select Template...">
                    <Button onClick={() => setIsModalOpen(true)}>Load template</Button>
                    {
                        currentTemplates.map((item, index) => (
                            <MenuItem value={item} onClick={() => handleOptionClick(item)}>{item}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            {isModalOpen && (
                <LoadTemplateModal setOpenModal={setIsModalOpen} onNewTemplateAdded={handleLoadedTemplate} projectName={ProjectName}/>
            )}
        </Container>
    );
  }
  
export default DropdownComponent;