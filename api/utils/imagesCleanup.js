const fs = require("fs");

const imagesCleanup = (files = []) => {
  files.forEach((file) => {
    fs.unlink(file, (error) => {
      if (error) {
        fs.appendFileSync(`logs/files-not-deleted.txt`, file + "\n");
      }
    });
  });
};

module.exports = imagesCleanup;
