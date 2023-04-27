const mongoose = require('mongoose');
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage'); // Update the import statement to include destructuring

const path = require('path');

// Call the connectDB function to establish a MongoDB connection


// Create storage engine
const storage = new GridFsStorage({
  url: 'mongodb+srv://soumiakouadri8:soumiasou@cluster0.uhyzcxj.mongodb.net/test', // Provide your MongoDB connection URI here
  options: { useNewUrlParser: true, useUnifiedTopology: true }, // Provide any desired options for the MongoDB connection
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

// Create Multer middleware
const upload = multer({ storage });

module.exports = upload;
