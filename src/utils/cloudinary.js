import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// cloudinary configuration
  // Configuration
  cloudinary.config({ 
    cloud_name: 'dpwph5ktp', 
    api_key: '554619516345788', 
    api_secret: 'I9BKhGbAniVDMVrbySTwyYYWy3o' // Click 'View Credentials' below to copy your API secret
});
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        //file has been uploaded successfully
        // console log krke dekhna
        // console.log("file is uploaded on clodinary", response);
        // console.log("file is uploaded on clodinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return error;
    }
};

const deleteFromCloudinary = async (fileName) => {
    try {
        const result = await cloudinary.uploader.destroy(fileName);
        // console.log(result);
    } catch (error) {
        console.error("Error while deleting file from clodinary:", error);
    }

    // first I tried this method and it worked but it is file specific
    // const response = await cloudinary.api.delete_resources([fileName], {
    //     type: 'upload', resource_type: "image",
    // });
    // console.log(response);
};

export { uploadOnCloudinary, deleteFromCloudinary };
