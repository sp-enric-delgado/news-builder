import React, { useState, useEffect } from 'react';
import '../../styles/ImageFormComponent.css'

function ImageFormComponent({ProjectName, Template, OnCollectionUpdated}) {

    const [imageCollection, updateImageCollection] = useState({});
    const [templateContent, setTemplateContent] = useState([]);

    useEffect(() => {
      fetch(`http://localhost:3001/templates?projectName=${encodeURIComponent(ProjectName)}`)
      .then((response) => response.json())
      .then((data) => {
        const currentTemplate = data.filter((item) => item.name === Template);
        const currentContent = currentTemplate.map((item) => item.content);
        setTemplateContent(currentContent);
      })
      .catch((error) => {
        console.error("COULDN'T GET TEMPLATE CONTENT: " + error);
      });
    }, [Template])

    function handleImageUpload(event){
        const uploadedImageFile = event.target.files[0];
        const imageID = event.target.id;
        
        const newCollection = {
            ...imageCollection,
            [imageID]: uploadedImageFile
        };
        
        updateImageCollection(newCollection);
    }

    function generateInputFields() {
      if (Array.isArray(templateContent) && templateContent.length > 0)
      {
        return(
          <div>
            <h1>{Template}</h1>
            {
              templateContent[0].map((item, index) => {
                return(
                  <div key={index}>
                    <h3>{item.name}</h3>
                    <input id={item.id} type='file' accept='*.png' onChange={handleImageUpload}/>
                  </div>
                );
              })
            }
          </div>
        );
      } 
      else
      {
        return <div>
          <h1>Select Template...</h1>
        </div>;
      }
    }

    return (
        <div className='content'>
            <div className='fieldsSection'>
              <div>
                {generateInputFields()}
              </div>
              
              <div>
                <button onClick={() => OnCollectionUpdated(imageCollection)}>Render</button>
              </div>
            </div>
        </div>
    );
};

export default ImageFormComponent;