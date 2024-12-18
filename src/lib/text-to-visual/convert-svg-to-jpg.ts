import axios from "axios";
import sharp from "sharp";

export const convertSVGToJPG = async (
  svgString: string,
  logoUrl?: string
): Promise<string> => {
  try {
    // Convert SVG string to JPG buffer
    const jpgBuffer = await sharp(Buffer.from(svgString))
      .jpeg({ quality: 90 }) // Convert to JPG
      .toBuffer();

    if (logoUrl) {
      const imageBuffer = await downloadImage(logoUrl);

      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(50, 50) // Resize to match SVG dimensions (optional: add logic for scaling image)
        .toBuffer();

      const result = await sharp(jpgBuffer)
        .composite([
          {
            input: resizedImageBuffer, // The image you downloaded
            top: 650, // Position it at your specified coordinates
            left: 1150,
            blend: "over", // Ensure it overlays on the rendered SVG
          },
        ])
        .jpeg({ quality: 90 })
        .toBuffer();

      // Return the JPG as a base64 string
      return `data:image/jpeg;base64,${result.toString("base64")}`;
    } else {
      return `data:image/jpeg;base64,${jpgBuffer.toString("base64")}`;
    }
  } catch (error) {
    throw new Error(`Error generating JPG: ${error}`);
  }
};

// Function to download and decode image
const downloadImage = async (imageUrl: string): Promise<Buffer> => {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
};
