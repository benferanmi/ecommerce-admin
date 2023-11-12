// Import necessary modules
import multiparty from 'multiparty';
import fs from 'fs/promises';
import path from 'path';

export default async function handle(req, res) {
  const form = new multiparty.Form();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Assuming you are sending the path of the first file in the response
    const filePath = files.file[0].path;
    const fileName = files.file[0].originalFilename;
    console.log("this is the file" + filePath)
    console.log("this is the file" + fileName)

    // Get the username from the form fields
    const username = fields.username[0];

    // Generate the new file name using the username
    const newFileName = `${username}.jpg`;

    // Define the relative path within your project
    const relativePath = path.join('upload', newFileName);
    console.log(relativePath)

    // Use process.cwd() to get the current working directory
    const projectPath = process.cwd();
    const publicFolderPath = path.resolve(projectPath, 'public');
    const newPath = path.resolve(publicFolderPath, 'upload', newFileName);

    // Check if the 'upload' folder exists in the 'public' folder, and create it if not
    const uploadFolderPath = path.resolve(publicFolderPath, 'upload');

    try {
      await fs.access(uploadFolderPath, fs.constants.F_OK);
    } catch (err) {
      // The folder does not exist, create it
      await fs.mkdir(uploadFolderPath);
    }
    // Move the uploaded file to the 'upload' folder with the new file name
    await fs.rename(filePath, newPath);
    // Send the relative path with the new file name in the response
    res.json({ filePath: relativePath, fileName: newFileName });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const config = {
  api: { bodyParser: false }
};
