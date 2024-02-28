import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import CreateProjectModal from "../components/ProjectSection/Modal/CreateProjectModal";


function ProjectSection(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    const navigate = useNavigate();
    function navigateToCanvas(){
        navigate("/canvas");
    }

    /* ON APP ENTER, FETCH AND LOAD PROJECTS */
    useEffect(() => {
        fetch('http://localhost:3001/projects')
        .then((response) => response.json())
        .then((data) => {
            const content = data.map((item) => item.name);
            setProjects(content);
        })
        .catch((error) => {
            console.error("SOMETHING WENT GRONT RETRIEVING PROJECTS:\n" + error);
        });
    }, []);

    /* IF A NEW PROJECT IS CREATED, FETCH AGAIN AND UPDATE */
    async function handleNewProject(){
        console.log("HANDLING NEW PROJECTS");
        try {
            const response = await fetch('http://localhost:3001/projects', {
              method: 'GET',
            });
      
            const data = await response.json();
            const content = data.map((item) => item.name);
            setProjects(content);
        } 
        catch (error) {
            console.error("Error retrieving projects form front:\n" + error);
        }
    }


    function showModal() {
      setIsModalOpen(true);
    }
  
    return(
        <div>
            <div className="title">
                <h1>Project Selection</h1>
            </div>

            <div className="body">
                <div className="header">
                    <h2>Select a project to work with...</h2>
                </div>
                <div className="content">
                    <ul className="content-list">
                        {
                            projects.map((item, index) => {
                                return(
                                    <li key={index} className="content-element">
                                        <button key={item} className="content-element-button" onClick={navigateToCanvas}>{item}</button>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>

            <div className="footer">
                <button onClick={showModal}>Add project...</button>
            </div>

            {isModalOpen && (
                <CreateProjectModal setOpenModal={setIsModalOpen} onProjectCreated={handleNewProject}/>
            )}
        </div>
    );
}

export default ProjectSection;