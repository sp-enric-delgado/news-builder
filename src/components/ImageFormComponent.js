import React, { useState } from 'react';
import '../styles/ImageFormComponent.css'

/*
    TO BE DONE:

    - Create "Template Dropdown": dropdown that alows you to choose between different configurations
    
    - Dynamically add input fields depending on the loaded configuration 
    
    - Have placeholder images depending on the configuration
*/

function ImageFormComponent({OnCollectionUpdated}) {

    const [imageCollection, updateImageCollection] = useState({});

    function handleImageUpload(event){
        const uploadedImageFile = event.target.files[0];
        const imageID = event.target.id;
        
        const newCollection = {
            ...imageCollection,
            [imageID]: uploadedImageFile
        };
        
        updateImageCollection(newCollection);
    }

    return (
        <div className='content'>
            <div className='fieldsSection'>
                <div>
                    <h2>Background Image</h2>
                    <input id="background" type="file" accept="image/*" onChange={handleImageUpload} />
                </div>

                <div>
                    <h2>Upload Images</h2>
                    <input id="uploaded-image-1" type="file" accept="image/*" onChange={handleImageUpload}/>
                </div>

                <div>
                    <button onClick={() => OnCollectionUpdated(imageCollection)}>Render</button>
                </div>
            </div>
        </div>
    );
};

export default ImageFormComponent;