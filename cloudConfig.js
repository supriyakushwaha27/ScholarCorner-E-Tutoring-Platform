// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "scholarProfile", // The name of the folder in your Cloudinary account
  allowedFormats: ["jpg", "png", "jpeg"], // Ensure there are no duplicates
});

// Create multer instance with storage
const upload = multer({ storage });

module.exports = { upload, cloudinary };
