const fs = require('fs');
const path = require('path');

const getImagesFromFolders = (directory) => {
  const folders = fs.readdirSync(directory);
  let images = [];

  folders.forEach((folder) => {
    const folderPath = path.join(directory, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      const files = fs.readdirSync(folderPath);
      files.forEach((file) => {
        if (/\.(jpg|jpeg|png|svg)$/i.test(file)) {
          images.push(`assets/svg/${folder}/${file}`);
        }
      });
    }
  });

  return images;
};

// Example usage:
const imageDirectory = path.join(__dirname, '../svg');
const imageArray = getImagesFromFolders(imageDirectory);

const jsonFilePath = path.join(__dirname, '../svg/image-list.json');
fs.writeFileSync(jsonFilePath, JSON.stringify({ imageArray }, null, 2), 'utf-8');