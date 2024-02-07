import express from 'express';
import cors from 'cors';
import path from 'path';
import qr from 'qr-image';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: "https://yashwantbhosale.github.io/qr-frontend"
};

app.use(express.json());
app.use(cors(corsOptions));

const __filename = fileURLToPath(import.meta.url).replace(/\\/g, '/'); 
const __dirname = path.dirname(__filename).replace(/\\/g, '/');
const publicDir = path.join(__dirname, 'public').replace(/^\/[A-Za-z]:/, '').replace(/\\/g, '/'); 
console.log(__dirname);
console.log(__filename);
app.post('/generate-qr', (req, res) => {
    console.log("Generate QR initiated!");
  const { url } = req.body;
    console.log(url);
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const qr_svg = qr.image(url, { type: 'png' });
  const qrImagePath = path.join(publicDir, 'qr_img.png').replace(/^\/[A-Za-z]:/, ''); 
  qr_svg.pipe(fs.createWriteStream(qrImagePath));

  fs.writeFile(path.join(publicDir, 'URL.txt').replace(/^\/[A-Za-z]:/, ''), url, (err) => { 
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save URL to file' });
    }
    console.log("The QR Code has been Generated!");
    res.sendFile('qr_img.png', { root: publicDir });
  });
});

app.post('/save-url', (req, res) => {
    console.log("Save URL initiated!");
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  fs.writeFile(path.join(publicDir, 'URL.txt').replace(/^\/[A-Za-z]:/, ''), url, (err) => { // Remove /C: from the start of the path
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save URL to file' });
    }
    console.log("URL saved successfully!");
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
