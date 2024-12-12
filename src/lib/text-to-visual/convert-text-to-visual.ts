import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getSVGImage } from "./get-svg-image.js";
import { convertSVGToJPG } from "./convert-svg-to-jpg.js";
import { replacePlaceholders } from "./replace-placeholders.js";

export const convertTextToVisual = async (
  text: string
): Promise<Result<string, string>> => {
  try {
    const argumentsObject: Result<
      Record<string, string>,
      string
    > = await getSVGImage(text);

    if (argumentsObject.isErr) {
      return err(argumentsObject.error);
    }

    console.log("Generated template arguments: " + argumentsObject.value);

    const svgImage: string = replacePlaceholders(argumentsObject.value);

    const result: string = await convertSVGToJPG(svgImage);
    return ok(result);
  } catch (error) {
    return err(`Unexpected error in converting text to image: ${error}`);
  }
};
