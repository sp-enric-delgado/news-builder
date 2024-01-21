import React, { useState } from 'react';
import '../styles/ImageFormComponent.css'


function ImageFormComponent({OnCollectionUpdated}) {

    const [imageCollection, updateImageCollection] = useState([]);

    function handleImageUpload(event, isBackground = false){
        const uploadedImage = event.target.files[0];

        updateImageCollection([...imageCollection, [uploadedImage, isBackground]]);
    }

    return (
        <div className='content'>
            <div className='fieldsSection'>
                <div>
                    <h2>Background Image</h2>
                    <input type="file" accept="image/*" onChange={(event) => handleImageUpload(event, true)} />
                </div>

                <div>
                    <h2>Upload Images</h2>
                    <input type="file" accept="image/*" onChange={handleImageUpload}/>
                </div>

                <div>
                    <button onClick={() => OnCollectionUpdated(imageCollection)}>Render</button>
                </div>
            </div>
        </div>
    );
};

export default ImageFormComponent;