import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getSVGImage } from "./get-svg-image.js";
import { convertSVGToJPG } from "./convert-svg-to-jpg.js";

export const convertTextToImage = async (
  text: string
): Promise<Result<string, string>> => {
  try {
    const svgImage: Result<string, string> = await getSVGImage(text);

    if (svgImage.isErr) {
      return err(svgImage.error);
    }

    const result: string = await convertSVGToJPG(svgImage.value);
    return ok(result);
  } catch (error) {
    return err(`Unexpected error in converting text to image: ${error}`);
  }
};
