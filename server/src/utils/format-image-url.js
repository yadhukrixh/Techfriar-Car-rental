import dotenv from 'dotenv';
dotenv.config();

export class FormatImageUrl{
    static async formatImageUrl(imageUrl) {
        return (`http://127.0.0.1:9000/${process.env.MINIO_BUCKET_NAME}/${imageUrl}`)
    }
}