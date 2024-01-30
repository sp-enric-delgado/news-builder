import { useState, useEffect } from 'react';
import { ImCross } from "react-icons/im";

import UploadFileModalSection from './UploadFileModalSection';
import ScriptModalSection from './ScriptModalSection';
import '../../styles/Modal/LoadTemplateModal.css'

function LoadTemplateModal({setOpenModal, onTemplateUpload}){
    
    const [code, setCode] = useState('');

    function handleDroppedFile(){
        onTemplateUpload(code);
        debugger;
        setOpenModal(false);
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
                    <UploadFileModalSection onDrop={setCode} />
                </div>

                <div className='modal-content--uploadButton'>
                    <button className='uploadButton' onClick={handleDroppedFile}>Upload</button>
                </div>
            </div>
        </div>
    );
}

export default LoadTemplateModal;