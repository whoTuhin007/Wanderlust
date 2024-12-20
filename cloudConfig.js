const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    api_key:process.env.CLOUD_API_KEY,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_API_SECRET

})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_dev',
      allowedFormats:['png','jpg','jpeg']
    },
  });



module.exports= {
    cloudinary,
    storage
}