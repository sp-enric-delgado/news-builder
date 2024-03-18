import { useCallback, useContext, useEffect, useState } from 'react';
import { IoIosArrowDropdown } from "react-icons/io";

import '../../styles/DropdownComponent.css'
import LoadTemplateModal from './Modal/LoadTemplateModal';

function DropdownComponent({OnSelectedTemplate, ProjectName}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
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

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const showModal = () => {
        setIsModalOpen(true);   
    }

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        OnSelectedTemplate(option);
        setIsOpen(false);
    };

    function displayCurrentTemplates(){
        return currentTemplates.map((name, index) => {
            return (
            <ul key={name}>
                <li key={index} className="option" onClick={() => handleOptionClick(name)}>{name}</li>
            </ul>
            );
        });
    }

    return (
        <div className="dropdown-container">

            <div className='dropdown-menu'>
                <p>{selectedOption || 'Select Option...'}</p>
                <IoIosArrowDropdown className="dropdown-button" onClick={toggleDropdown} />
            </div>

            {isOpen && (
                <div key="uniqueID1" className="dropdown-content">
                    <div key="uniqueID2" className="fixed-button-container">
                        <button key="uniqueID3" className="fixed-button" onClick={showModal}>Load template</button>
                    </div>
                    
                    <div key="uniqueID4" className="options-container">
                        {displayCurrentTemplates()}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <LoadTemplateModal setOpenModal={setIsModalOpen} onNewTemplateAdded={handleLoadedTemplate}/>
            )}
        </div>
    );
  };
  
export default DropdownComponent;