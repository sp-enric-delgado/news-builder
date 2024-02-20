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

const dbPath = path.join(__dirname, '../server/db/templates.json');

async function updateTemplates (newTemplate) {
  const data = await fileSystemPromises.readFile(dbPath, "utf8");
  const templates = JSON.parse(data);  
  
  // async (error, data) => {
    // if (error) {
    //   console.error("SERVER ERROR: " + error);
    //   return false;
    // }

    // let templates;
    //try {
    //  templates = JSON.parse(data);
    // } catch (error) {
    //  console.error('Error parsing templates.json: ', error);
    //  return false;
    // }

    templates.push(newTemplate);

    fileSystem.writeFileSync(dbPath, JSON.stringify(templates, null, 2)); 
    
    return true;
    //, (error) => {
      // if (error) {
      //  console.error('Error writing templates.json: ', error);
      //  return false;
      // }

      // return true;
    // });
  // });
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('db/'));

app.get('/templates', async (req, res) => {
  try
  {
    const data = await fileSystemPromises.readFile(dbPath, "utf8");
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