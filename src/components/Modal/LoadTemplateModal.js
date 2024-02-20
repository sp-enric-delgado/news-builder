import { useState, useEffect } from 'react';
import { ImCross } from "react-icons/im";

import UploadFileModalSection from './UploadFileModalSection';
import '../../styles/Modal/LoadTemplateModal.css'

function LoadTemplateModal({setOpenModal, onNewTemplateAdded}){
    
    const [template, setTemplate] = useState({});

    /*useEffect(() => {
        fetch('http://localhost:3001/templates')
        .then((response) => response.json())
        .then((data) =>  {
            // console.log("SETTING TEMPLATE DATA: " + data);
            setTemplate(data)
        })
        .catch((error) => console.error('Error fetching input fields:', error));
    }, [template]);*/

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

            if(response.ok){
                console.log('TEMPLATE SAVED SUCCESSFULLY');
                // fetch
            }
            else{
                console.error('ERROR SAVING TEMPLATE');
            }
        }
        catch(error){
            console.error('Error saving template: ', error);
        }
        // debugger;
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