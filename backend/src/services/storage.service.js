import ImageKit from '@imagekit/nodejs';
import dotenv from "dotenv"

dotenv.config()

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

const UploadFile=async(file)=>{
    const response = await client.files.upload({
        file,
        fileName: 'profile.jpg',
     });

        return response
}

const UploadImage=async(image)=>{
  const response = await client.files.upload({
    image,
    fileName:"image_"+Date.now()+".jpg"
  })

  return response
}

export default {UploadFile,UploadImage}

