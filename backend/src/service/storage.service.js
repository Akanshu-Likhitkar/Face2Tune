const ImageKit = require("imagekit");
const mongoose = require("mongoose")

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: file.buffer,
        folder:"Songs",          
        fileName: new mongoose.Types.ObjectId().toString(),  
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};


module.exports = uploadFile;