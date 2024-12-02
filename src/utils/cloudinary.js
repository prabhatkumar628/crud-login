import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
})


const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;
    try {
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        try {
            fs.unlinkSync(localFilePath)
        } catch (error) {
            console.log(error)
        }
        return response
    } catch (error) {
        console.log(error)
        try {
            fs.unlinkSync(localFilePath)
        } catch (error) {
            console.log(error)
        }
        return null
    }
}

const deleteOnCloudinary = async (publicId) => {
    if (!publicId) return null;
    try {
        const response = await cloudinary.uploader.destroy(publicId)
        console.log("Image delete successfully", response)
        return response
    } catch (error) {
        console.log("Something want wrong while delete on cloudinary", error)
        return null
    }
}

export {uploadOnCloudinary, deleteOnCloudinary}