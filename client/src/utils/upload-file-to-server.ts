import { RcFile } from "antd/es/upload";

export class UploadFileTOServer {
  public uploadImageToServer = async (file: RcFile): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send the image to your backend or cloud storage service
      const response = await fetch("https://your-backend-url.com/upload", {
        method: "POST",
        body: formData,
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error("Failed to upload image, response not ok");
      }

      const data = await response.json();

      // Check if the imageUrl exists in the response
      if (!data || !data.imageUrl) {
        throw new Error("Image URL not found in response");
      }

      return data.imageUrl; // Assume the response contains the image URL
    } catch (error) {
      console.error("Error during image upload:", error);
      throw error; // Re-throw the error to handle it where the function is called
    }
  };
}
