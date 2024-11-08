import axios from "axios";

export class ImageDownloaderClass {
  // Download image as a stream
  static async urlToStream(url) {
    try {
      const response = await axios({
        url: url,
        method: "GET",
        responseType: "stream",
      });

      console.log("Image downloaded as stream.");
      return response.data; // This returns the stream
    } catch (error) {
      throw new Error(`Failed to download image: ${error}`);
    }
  }
}
