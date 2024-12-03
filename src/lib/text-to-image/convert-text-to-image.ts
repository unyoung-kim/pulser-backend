import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getTemplateAndArguments } from "./get-template-and-arguments.js";
import { getSVGImage } from "./get-svg-image.js";
import { convertSVGToJPG } from "./convert-svg-to-jpg.js";

export const convertTextToImage = async (
  text: string
): Promise<Result<string, string>> => {
  try {
    const argumentObject: Result<
      Record<string, string>,
      string
    > = await getTemplateAndArguments(text);

    if (argumentObject.isErr) {
      return err(argumentObject.error);
    }
    const svgImage: string = getSVGImage(argumentObject.value);

    const result: string = await convertSVGToJPG(svgImage);
    return ok(result);
  } catch (error) {
    return err(`Unexpected error in converting text to image: ${error}`);
  }
};
