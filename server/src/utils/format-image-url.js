import dotenv from 'dotenv';
dotenv.config();

export class FormatImageUrl{

    // format image urls to pass front end
    static async formatImageUrl(imageUrl) {
        return (`http://127.0.0.1:9000/${process.env.MINIO_BUCKET_NAME}/${imageUrl}`);
    }

    // destructure the image to handle deletion
    static async deStructureImage(imageUrl){
        const url = imageUrl.replace("http://127.0.0.1:9000/rentalia/","");
        return url;
    }
}