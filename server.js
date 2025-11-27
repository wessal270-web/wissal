
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
const port = 3001;

// Enable CORS for frontend
app.use(cors());

// --- CLOUDFLARE R2 CONFIGURATION ---
const R2_ACCOUNT_ID = "59555fce72fde7782d61c58691a3e64c";
const ACCESS_KEY_ID = "947de09ef48078bc9e169f7a8bf93517";
const SECRET_ACCESS_KEY = "5f89b56c9162150991ce561fc26149b06f6b38cd2e882b68547a205c89e86f05";
const BUCKET_NAME = "asslogo";
const PUBLIC_DOMAIN = "https://pub-c2a233f9dcb748d6ab9b21ce85b07126.r2.dev";

// Initialize S3 Client
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

// Configure Multer for RAM storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload Endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`Uploading ${file.originalname}...`);

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const key = `logos/${filename}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await S3.send(command);

    // Construct Public URL
    const domain = PUBLIC_DOMAIN.replace(/\/$/, "");
    const publicUrl = `${domain}/${key}`;

    console.log(`Success: ${publicUrl}`);
    res.json({ url: publicUrl });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Node.js R2 Server running at http://localhost:${port}`);
});
