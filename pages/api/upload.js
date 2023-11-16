// Import necessary modules
import multiparty from 'multiparty';
import fs from 'fs/promises';
import path from 'path';

export default async function handle(req, res) {
  const form = new multiparty.Form();

  try {
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const uploadFolderPath = path.resolve(process.cwd(), 'public', 'upload');

    // Check if the 'upload' folder exists in the 'public' folder, and create it if not
    try {
      await fs.access(uploadFolderPath, fs.constants.F_OK);
    } catch (err) {
      // The folder does not exist, create it
      await fs.mkdir(uploadFolderPath);
    }

    const uploadedFiles = [];

    for (const file of files.file) {
      const fileName = file.originalFilename;
      const filePath = file.path;
      // console.log(filePath)

      const newFilePath = path.resolve(uploadFolderPath, fileName);

      // Move the uploaded file to the 'upload' folder with the original file name
      await fs.rename(filePath, newFilePath);

      // Add information about the uploaded file to the array
      uploadedFiles.push({
        filePath: path.join('upload', fileName),
      });
    }

    // Send information about all uploaded files in the response
    res.json({uploadedFiles});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = {
  api: { bodyParser: false },
};
