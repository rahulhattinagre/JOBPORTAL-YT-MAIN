import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';

// Ensure env variables are loaded
dotenv.config();

// Debugging logs - Keep these until it works
console.log("--- Cloudinary Setup ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Good practice for production
});

// Final check
const config = cloudinary.config();
if (!config.api_key) {
    console.error("CRITICAL: Cloudinary config failed to load!");
} else {
    console.log("Cloudinary configured successfully.");
}

export default cloudinary;