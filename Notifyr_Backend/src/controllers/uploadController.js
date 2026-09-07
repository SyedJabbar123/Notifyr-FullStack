import cloudinary from '../config/cloudinary.js';

// Signed direct-upload — the client uploads straight to Cloudinary using this signature,
// image bytes never touch the Express process. See design doc §5.
export function signUpload(req, res) {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp }, process.env.CLOUDINARY_API_SECRET);

  res.status(200).json({
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
