import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import CreateProjectModal from "../components/ProjectSection/Modal/CreateProjectModal";
import {Box, Button, Card, CardContent, Container, Typography,} from "@mui/material";


function ProjectSection(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    function navigateToCanvas(projectName){
        navigate("/canvas", {state:{projectName}});
    }

    function navigateToSpineCanvas(){
        navigate("/spineCanvas");
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
        <Container sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Container>
                <Typography variant="h1">LiveOps Art Tool</Typography>
            </Container>

            <Container sx={{ my: 5 }}>
                <Card variant="elevation" elevation={3} sx={{display: 'flex', flexDirection: 'row', my: 3, py: 5, justifyContent: "space-evenly", borderRadius: 2, borderWidth: 2, borderColor: "primary.light" }}>
                    {projects.map((item, index) => (
                        <CardContent>
                            <Button variant="outlined" key={index} onClick={()=>navigateToCanvas(item)}>{item}</Button>
                        </CardContent>
                    ))}
                </Card>
            </Container>

            <Container>
                <Button variant="outlined" onClick={showModal}>Add project...</Button>
            </Container>

            <div className="test">
                <button onClick={() => navigateToSpineCanvas()}>SPINE TEMP BUTTON</button>
            </div>

            {isModalOpen && (
                <CreateProjectModal setOpenModal={setIsModalOpen} onProjectCreated={handleNewProject}/>
            )}
        </Container>
    );
}

export default ProjectSection;