import mime from "mime-types";
import dotenv from "dotenv";
import minioClient from "../config/minio.js";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

export class MinioUtils {

  // Function to upload image to the minio
  static async uploadFileToMinio(image, folderName, bucketName) {
    try {
      // Ensure we have the correct fields from the image object
      const { createReadStream, filename } = await image;

      if (!createReadStream || typeof createReadStream !== "function") {
        throw new Error(
          "Invalid image file: createReadStream is not a function."
        );
      }

      if (!filename) {
        throw new Error("File name is missing.");
      }

      // Create a unique filename by appending a UUID
      const uniqueFilename = `${folderName}/${uuidv4()}-${filename}`;
      const stream = createReadStream();
      const contentType = mime.lookup(filename) || "application/octet-stream";

      // Ensure the bucket exists before uploading
      await new Promise((resolve, reject) => {
        minioClient.bucketExists(
          bucketName,
          (err, exists) => {
            if (err) {
              console.error("Error checking bucket existence:", err);
              return reject(
                new Error("Failed to check MinIO bucket existence.")
              );
            }
            if (!exists) {
              return reject(new Error("MinIO bucket does not exist."));
            }
            resolve(true);
          }
        );
      });

      // Upload the image to MinIO
      await new Promise((resolve, reject) => {
        minioClient.putObject(
          bucketName,
          uniqueFilename,
          stream,
          { "Content-Type": contentType },
          (error) => {
            if (error) {
              console.error("MinIO upload failed:", error);
              return reject(new Error("MinIO upload failed."));
            }
            resolve();
          }
        );
      });

      // Generate a presigned URL after the upload
      return uniqueFilename;
    } catch (error) {
      console.error("Error uploading image to MinIO:", error.message);
      throw new Error(`Failed to upload image to MinIO: ${error.message}`);
    }
  }

  // Function to delete Image from the minio
  static async deleteFileFromMinio(imageUrl,bucketName) {
    return new Promise((resolve) => {
      minioClient.removeObject(
        bucketName,
        imageUrl,
        function (err) {
          if (err) {
            console.log(
              "Error occurred while deleting the image from MinIO:",
              err
            );
            return resolve(false); // Resolve false on error
          } else {
            return resolve(true); // Resolve true on successful deletion
          }
        }
      );
    });
  }
}
