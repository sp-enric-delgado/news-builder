import React, { useState, useEffect } from 'react';
import '../../styles/ImageFormComponent.css'
import {EVENT_ON_CANVAS_GET_IMAGE_POSITION, EVENT_ON_CANVAS_GET_IMAGE_SCALE} from "./CanvasElements/CanvasEvents";
import * as FormEvent from './FormEvents/FormEvents'
import {Container, Typography, Box, Button, InputLabel, Input, Card} from "@mui/material";

function ImageFormComponent({ProjectName, Template}) {

    const [imageCollection, updateImageCollection] = useState({});
    const [templateContent, setTemplateContent] = useState([]);

    const [imagePositionDict, setImagePositionDict] = useState({});
    const [imageScaleDict, setImageScaleDict] = useState({});


    //#region EVENT SUBSCRIPTION
    // Update Image Position
    useState(() => {
        document.addEventListener(EVENT_ON_CANVAS_GET_IMAGE_POSITION, (e) => updateImagePositionValue(e.detail));

        return () => {
            document.removeEventListener(EVENT_ON_CANVAS_GET_IMAGE_POSITION, (e) => updateImagePositionValue(e.detail));
        }
    }, [imagePositionDict])

    // Update Image Scale
    useState(() => {
        document.addEventListener(EVENT_ON_CANVAS_GET_IMAGE_SCALE, (e) => updateImageScaleValue(e.detail));

        return () => {
            document.removeEventListener(EVENT_ON_CANVAS_GET_IMAGE_SCALE, (e) => updateImageScaleValue(e.detail));
        }
    }, [imageScaleDict])
    //#endregion

    // Fetching the DB  to get the template's data
    useEffect(() => {
        fetch(`http://localhost:3001/templates?projectName=${encodeURIComponent(ProjectName)}`)
            .then((response) => response.json())
            .then((data) => {
                const currentTemplate = data.filter((item) => item.name === Template);
                const currentContent = currentTemplate.map((item) => item.content);
                setTemplateContent(currentContent);
            })
            .catch((error) => {
                console.error("[IMAGE FORM COMPONENT] COULDN'T GET TEMPLATE CONTENT: " + error);
            });
    }, [Template])


    function handleImageUpload(event, index){
        const uploadedImageFile = event.target.files[0];
        const imageID = event.target.id;

        const newCollection = {
            ...imageCollection,
            [imageID]: {
                "file": uploadedImageFile,
                "index": index
            }
        };

        updateImageCollection(newCollection);
    }

    function handleImagePositionInput(axis, value, id){
        //1. Get input data
        const isXAxis = axis === "x";
        const isYAxis = axis === "y";

        const changes = {
            "id": id,
            "pos": {
                "x": isXAxis ? value : imagePositionDict[id]?.x,
                "y": isYAxis ? value : imagePositionDict[id]?.y,
            }
        };

        //2. Send position to canvas image with ID and place it
        FormEvent.dispatchEventOnFormImagePosChanged(changes);
    }

    function handleImageScaleInput(axis, value, id){
        const isXAxis = axis === "x";
        const isYAxis = axis === "y";

        const changes = {
            "id": id,
            "scale": {
                x: isXAxis ? value : imageScaleDict[id]?.x,
                y: isYAxis ? value : imageScaleDict[id]?.y
            }
        };

        FormEvent.dispatchEventOnFormImageScaleChanged(changes);
    }

    function onImageReposition(itemID, positioning){
        if(itemID === null || itemID === "") return;

        const repositionData = {
            "id": itemID,
            "positioning": positioning
        }

        FormEvent.dispatchEventOnFormImageRepositioned(repositionData);
    }

    function onImageSelect(itemID){
        if(itemID === null || itemID === "") return;

        FormEvent.dispatchEventOnFormImageSelected(itemID);
    }

    function onImageDeselect(itemID){
        if(itemID === null || itemID === "") return;

        FormEvent.dispatchEventOnFormImageDeselected(itemID);
    }

    function updateImagePositionValue(data){
        const newImagePositionDict = {...imagePositionDict};
        newImagePositionDict[data.id] = data.pos;

        setImagePositionDict(newImagePositionDict);
    }

    function updateImageScaleValue(data){
        const newImageScaleDict = {...imageScaleDict};
        newImageScaleDict[data.id] = data.scale;

        setImageScaleDict(newImageScaleDict);
    }

    function generateInputFields() {
        if (Array.isArray(templateContent) && templateContent.length > 0)
        {
            return(
                <Container sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    {
                        templateContent[0].map((item, index) => {

                            return(
                                <Card key={index} sx={{p: 3}}>
                                    <Typography variant="h3" >{item.name}</Typography>
                                    <Container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2}}>
                                        <InputLabel htmlFor={item.id}>Image: </InputLabel>
                                        <Input id={item.id} type='file' accept='*.png' onChange={ (e) => handleImageUpload(e, index)}/>
                                    </Container>
                                    { item.id !== "background" &&
                                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'left', gap: 2}}>
                                            <Container>
                                                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2}}>
                                                    <InputLabel htmlFor={item.id + "_x"}>X: </InputLabel>
                                                    <Input id={item.id + "_x"}
                                                           type='number'
                                                           onChange={(event) => handleImagePositionInput("x", event.target.value, item.id)}
                                                           value={imagePositionDict[item.id]?.x}/>
                                                </Box>
                                                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2}}>
                                                    <InputLabel htmlFor={item.id + "_y"}>Y: </InputLabel>
                                                    <Input id={item.id + "_y"}
                                                           type='number'
                                                           onChange={(event) => handleImagePositionInput("y", event.target.value, item.id)}
                                                           value={imagePositionDict[item.id]?.y}/>
                                                </Box>
                                            </Container>

                                            <Container>
                                                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2}}>
                                                    <InputLabel htmlFor={item.id + "_scaleX"}>X Scale: </InputLabel>
                                                    <Input id={item.id + "_scaleX"}
                                                           type='number'
                                                           step="0.1"
                                                           onChange={(event) => handleImageScaleInput("x", event.target.value, item.id)}
                                                           value={imageScaleDict[item.id]?.x}/>
                                                </Box>
                                                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2}}>
                                                    <InputLabel htmlFor={item.id + "_scaleY"}>Y Scale: </InputLabel>
                                                    <Input id={item.id + "_scaleY"}
                                                           type='number'
                                                           step="0.1"
                                                           onChange={(event) => handleImageScaleInput("y", event.target.value, item.id)}
                                                           value={imageScaleDict[item.id]?.y}/>
                                                </Box>
                                            </Container>

                                            <Container sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2}}>
                                                <InputLabel htmlFor="layer-buttons">Layer Order</InputLabel>
                                                <Box id="layer-buttons" sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                                    <Button onClick={(event) => onImageReposition(item.id, "Forward")}>Bring Forward</Button>
                                                    <Button onClick={(event) => onImageReposition(item.id, "Backwards")}>Bring Backwards</Button>
                                                </Box>
                                            </Container>

                                            <Container  sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                <Box>
                                                    <Button onClick={(event) => onImageSelect(item.id)}>Select Object </Button>
                                                </Box>

                                                <Box>
                                                    <Button className="selected" id="deselection-button" onClick={(event) => onImageDeselect(item.id)}>Deselect Object</Button>
                                                </Box>
                                            </Container>
                                        </Box>
                                    }
                                </Card>
                            );
                        })
                    }
                </Container>
            );
        }
        else
        {
            return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant="h2">Select a template to start editing</Typography>
            </Container>;
        }
    }

    return (
        <Container sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3}}>
            <Box>
                <Typography variant="h2">{Template}</Typography>
            </Box>

            <Box sx={{maxHeight: "45vh", overflow: 'auto', my:3}}>
                {generateInputFields()}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button variant="outlined" sx={{width: '225px'}} onClick={() => FormEvent.dispatchEventOnFormRenderRequest(imageCollection)}> Render </Button>
            </Box>
        </Container>
    );
};

export default ImageFormComponent;