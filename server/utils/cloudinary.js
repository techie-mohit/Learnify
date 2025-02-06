import {v2 as cloudinary} from 'cloudinary';    
import dotenv from 'dotenv';
dotenv.config({});

cloudinary.config({
    api_secret : process.env.CLOUDINARY_API_SECRET,
    api_key : process.env.CLOUDINARY_API_KEY,
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME
});


export const uploadMedia = async(file)=>{        // used to upload images and videos  in cloudinary because we have not specified the resource_type
    try {

        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        })

        return uploadResponse;
        
    } catch (error) {
        console.log(error);
        
    }
}


export const deleteMedia = async(publicId)=>{          // used to delete images and videos  from cloudinary because we have not specified the resource_type
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
        
    }

}

export const deleteVideo = async(publicId)=>{     // used to delete videos from cloudinary
    try {
        await cloudinary.uploader.destroy(publicId, {resource_type: "video"});
    } catch (error) {
        console.log(error);
        
    }

}