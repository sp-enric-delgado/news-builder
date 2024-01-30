import React, { useState, useEffect } from 'react';
import '../styles/ImageFormComponent.css'

/*
    TO BE DONE:

    - Dynamically add input fields depending on the loaded configuration 
    
    - Have placeholder images depending on the configuration
*/

function ImageFormComponent({Template, OnCollectionUpdated}) {

    const [imageCollection, updateImageCollection] = useState({});
    const [inputFields, setInputFields] = useState([]);

    function handleImageUpload(event){
        const uploadedImageFile = event.target.files[0];
        const imageID = event.target.id;
        
        const newCollection = {
            ...imageCollection,
            [imageID]: uploadedImageFile
        };
        
        updateImageCollection(newCollection);
    }

    useEffect(() => {
        if (Template) {
          const inputFields = [];
          for (const [id, config] of Object.entries(Template)) {
            inputFields.push(
              <div key={id}>
                <label htmlFor={id}>{config.name}</label>
                <input
                  id={id}
                  type={config.type}
                  placeholder={config.placeholder}
                  value={imageCollection[id] || ""}
                  onChange={(event) => handleImageUpload(event, id)}
                />
              </div>
            );
          }
          setInputFields(inputFields);
        }
      }, [Template]);

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