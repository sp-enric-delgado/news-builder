// server.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fileSystem = require('fs');
const fileSystemPromises = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);
const port = 3001;

const dbPath = path.join(__dirname, '../server/db');
const templatesPath = path.join(dbPath, 'templates.json');
const projectsPath = path.join(dbPath, 'projects.json');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('db/'));

// MANAGE PROJECTS
async function updateProjects(newProject){
  const data = await fileSystemPromises.readFile(projectsPath, "utf8");
  const projects = JSON.parse(data);

  projects.push(newProject);
  fileSystem.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));

  const templateFileName = newProject.name;
  generateProjectTemplatesFile(templateFileName);

  return true;
}

async function generateProjectTemplatesFile(projectName){
  const projName = projectName.toLowerCase().replace(/\s+/g, '');
  const templateFileName = `${projName}_templates.json`
  const projectsTemplatePath = path.join(dbPath, templateFileName);

  fileSystem.writeFileSync(projectsTemplatePath, JSON.stringify([], null, 2));

  return true;
}

app.get('/projects', async (req, res) => {
  try{
    const data = await fileSystemPromises.readFile(projectsPath, "utf8");
    const projects = JSON.parse(data);
    res.status(200).json(projects);
  }
  catch(error){
    res.status(500).send('Error reading projects');
  }
});

app.post('/projects', async(req, res) => {
    const project = req.body;
    const success = updateProjects(project);
    if(success){
      res.status(200).send('Project saved successfully');
    }
    else{
      res.status(500).send('Error posting projects');
    }
});

// MANAGE TEMPLATES
async function updateTemplates (newTemplate) {
  const data = await fileSystemPromises.readFile(templatesPath, "utf8");
  const templates = JSON.parse(data);  
  
  templates.push(newTemplate);
  fileSystem.writeFileSync(templatesPath, JSON.stringify(templates, null, 2)); 
    
  return true;
};

app.get('/templates', async (req, res) => {
  const queryString = req.query;
  const projectName = queryString.projectName;

  if(projectName === null) return;

  try
  {
    const templatesFilePath = path.join(dbPath, `${projectName.toLowerCase().replace(/\s+/g, '')}_templates.json`)
    const data = await fileSystemPromises.readFile(templatesFilePath, "utf8");
    const templates = JSON.parse(data);
    res.status(200).json(templates);
  }
  catch (error){
    res.status(500).send('ERROR READING templates.json');
  }
});

app.post('/templates', (req, res) => {
  const template = req.body;
  const success = updateTemplates(template);
  if (success) {
    res.status(200).send('TEMPLATE SAVED SUCCESSFULLY');
  } else {
    res.status(500).send('ERROR SAVING TEMPLATE AT LINE 119');
  }
});

/* IMAGEMAGICK STUFF */
app.post('/processImages', (req, res) => {
  const { backgroundPath, images } = req.body;

  const command = `composite -gravity center ${backgroundPath} ${images.map((img) => img.src).join(' ')} output.jpg`;
  const outputPath = path.join(__dirname, 'processed-images', 'output.jpg');

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`);
      res.status(500).json({ error: 'Image processing failed' });
    } else {
      console.log(`Images processed successfully: ${stdout}`);
      res.json({ success: true, message: 'Images processed successfully', imagePath: outputPath});
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});