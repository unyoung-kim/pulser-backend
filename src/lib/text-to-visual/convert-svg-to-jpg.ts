import sharp from "sharp";

export const convertSVGToJPG = async (svgString: string): Promise<string> => {
  try {
    // Convert SVG string to JPG buffer
    const jpgBuffer = await sharp(Buffer.from(svgString))
      .jpeg({ quality: 90 }) // Convert to JPG
      .toBuffer();

    // Return the JPG as a base64 string
    return `data:image/jpeg;base64,${jpgBuffer.toString("base64")}`;
  } catch (error) {
    throw new Error(`Error generating JPG: ${error}`);
  }
};
