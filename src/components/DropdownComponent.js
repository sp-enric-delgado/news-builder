import { useState } from 'react';
import { IoIosArrowDropdown } from "react-icons/io";

import '../styles/DropdownComponent.css'

function DropdownComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

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
                    <button className="fixed-button">Permanent Button</button>
                </div>
                
                <div className="options-container">
                    {/* Add your scrollable options here */}
                    <div className="option" onClick={() => handleOptionClick('Option 1')} > Option 1 </div>
                    <div className="option" onClick={() => handleOptionClick('Option 2')} > Option 2 </div>
                    <div className="option" onClick={() => handleOptionClick('Option 3')} > Option 3 </div>
                    {/* Add more options as needed */}
                </div>
            </div>   
            )}
        </div>
    );
  };
  
export default DropdownComponent;