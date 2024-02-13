// server.js

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fileSystem = require('fs');

const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('../public'));

const updateTemplates = (newTemplate) => {
  fileSystem.readFile('../public/templates.json', (error, data) => {
    if (error) {
      console.error(error);
      return false;
    }

    let templates;
    try {
      templates = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing templates.json:', error);
      return false;
    }

    templates.push(newTemplate);

    fileSystem.writeFile('../public/templates.json', JSON.stringify(templates, null, 2), (error) => {
      if (error) {
        console.error('Error writing templates.json:', error);
        return false;
      }

      return true;
    });
  });
};

app.post('/templates', (req, res) => {
  const template = req.body;
  const success = updateTemplates(template);
  if (success) {
    res.status(200).send('TEMPLATE SAVED SUCCESSFULLY');
  } else {
    res.status(500).send('ERROR SAVING TEMPLATE');
  }
});

/* IMAGEMAGICK STUFF */
app.post('/processImages', (req, res) => {
  const { backgroundPath, images } = req.body;

  // Implement ImageMagick processing here
  // Example: Combine background and images using 'composite' command
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
