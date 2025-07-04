const fs = require("fs");
const { google } = require("googleapis");
const path = require('path');

// Load credentials
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'google_apis_file.json'),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// Create client
const driveService = google.drive({ version: "v3", auth });

// Upload a file
async function uploadFileToDrive(localPath, fileName, folderId) {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: "application/pdf", // or detect from fileName
    body: fs.createReadStream(localPath),
  };

  const response = await driveService.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });

  return {
    id: response.data.id,
    webViewLink: response.data.webViewLink,
  };
}

module.exports = uploadFileToDrive;
