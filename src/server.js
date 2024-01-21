// server.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3001;

app.use(bodyParser.json());

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

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  // You can send real-time updates to connected clients here
  // For simplicity, let's assume the server sends a dummy message every 2 seconds
  const interval = setInterval(() => {
    ws.send('Real-time update from the server');
  }, 2000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
