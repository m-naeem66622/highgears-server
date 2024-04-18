const path = require("path");
const fs = require("fs");

function deleteImages(imagesToDelete) {
  const deletedProductsDir = path.join("deleted_products");

  imagesToDelete.forEach((imageToDelete) => {
    const sourcePath = path.join(imageToDelete);
    const destinationPath = path.join(
      deletedProductsDir,
      path.basename(imageToDelete)
    );

    fs.rename(sourcePath, destinationPath, (err) => {
      if (err) {
        fs.appendFileSync(`logs/files-not-moved.txt`, sourcePath + "\n");
      }
    });
  });
}

module.exports = deleteImages;
