import cloudinary from 'cloudinary'
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
config({ path: path.resolve(__dirname, '../../../.env.local') });

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

cloudinary.v2.config({
    cloud_name: 'crimea',
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadImage = async(data: string, public_id: string): Promise<any> => {
    try {
        const result = await cloudinary.v2.uploader.upload(data, {
            folder: "ethernity_snap_data",
            public_id: public_id,
            
        })
        console.log(result)
        return true
    } catch (error) {
        console.log(error)
    }
}

export default uploadImage