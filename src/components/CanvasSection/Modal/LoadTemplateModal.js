import { useState, useEffect } from 'react';
import { ImCross } from "react-icons/im";

import UploadFileModalSection from './UploadFileModalSection';
import '../../../styles/Modal/LoadTemplateModal.css'

function LoadTemplateModal({setOpenModal, onNewTemplateAdded}){
    
    const [template, setTemplate] = useState({});

    function handleDroppedFile(){
        saveTemplate(template);
        onNewTemplateAdded(template);
        setOpenModal(false);
    }

    /* HERE DO THE CODE CHECK AND UPLOAD TO SERVER */
    const saveTemplate = async (template) => {
        try{
            const response = await fetch('http://localhost:3001/templates', {
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
        <div className={`modal-bg ${setOpenModal ? 'active' : 'hidden'}`}>
            <div className="modal-content">
                <div className="modal-content--closeBtn">
                    <ImCross className="closeBtn" onClick={() => { setOpenModal(false); }}/>
                </div>

                <div className='modal-content--header'>
                    <h1 className='header'>Upload the template</h1>
                </div>

                <div className='modal-content--uploadArea'>
                    <UploadFileModalSection onDrop={setTemplate} />
                </div>

                <div className='modal-content--uploadButton'>
                    <button className='uploadButton' onClick={handleDroppedFile}>Upload</button>
                </div>
            </div>
        </div>
    );
}

export default LoadTemplateModal;