import { useState } from 'react';
import { IoIosArrowDropdown } from "react-icons/io";

import LoadTemplateModal from './Modal/LoadTemplateModal';
import '../styles/DropdownComponent.css'

function DropdownComponent({Templates, OnTemplateUpload}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleLoadTemplates = () => {
        OnTemplateUpload(Templates);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const showModal = () => {
        setIsModalOpen(true);   
    }

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="dropdown-container">

            <div className='dropdown-menu'>
                <p>{selectedOption || 'Select Option...'}</p>
                <IoIosArrowDropdown className="dropdown-button" onClick={toggleDropdown} />
            </div>

            {isOpen && (
                <div className="dropdown-content">
                    <div className="fixed-button-container">
                        <button className="fixed-button" onClick={showModal}>Permanent Button</button>
                    </div>
                    
                    <div className="options-container">
                        {Templates.map((template, index) => (
                            <div key={index} className="option" onClick={() => handleOptionClick(template)}>
                                {template.name}
                            </div>
                        ))}
                    </div>


                </div>
            )}

            {isModalOpen && (
                <LoadTemplateModal setOpenModal={setIsModalOpen} onTemplateUpload={handleLoadTemplates}/>
            )}
        </div>
    );
  };
  
export default DropdownComponent;