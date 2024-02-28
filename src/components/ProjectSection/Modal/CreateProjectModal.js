import React, {useState} from 'react';
import { ImCross } from 'react-icons/im';
import '../../../styles/ProjectSection/Modal/CreateProjectModal.css';

function CreateProjectModal({setOpenModal, onProjectCreated}) {
  const [projectName, setProjectName] = useState('');

  async function createProject() {
    try{
        const response = await fetch('http://localhost:3001/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: projectName
            }),
        });

        setOpenModal(false);
        onProjectCreated();
    }
    catch(error){
        console.error('Error saving template: ', error);
    }
}

  return (
    <div className='modal-container'>
      <div className="modal-background"></div>
      <div className="modal">
        <div className='modal-header'>
          <div className="modal-header--title">
            <h2 className='title'>Add New Project</h2>
          </div>
          <div className="modal-header--closeBtn">
              <ImCross className="closeBtn" onClick={() => { setOpenModal(false); }}/>
          </div>
        </div>

        <div className='modal-body'>
          <form action="" className='modal-body--form'>
            <div className='form-component'>
                <label htmlFor="projName" className='form-component--label'>Project Name</label>
                <input type="text" name="projName" id="projName" className='form-component--input' onChange={(event) => setProjectName(event.target.value)}/>
            </div>
          </form>
        </div>
        
        <div className='modal-footer'>
          <button onClick={createProject}>Create Project</button>
        </div>
      </div>
    </div>

  );
};

export default CreateProjectModal;