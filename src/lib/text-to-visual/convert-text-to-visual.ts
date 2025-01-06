import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { convertSVGToJPG } from "./convert-svg-to-jpg.js";
import { replacePlaceholders } from "./replace-placeholders.js";
import { getArguements } from "./get-arguements.js";

export const convertTextToVisual = async (
  text: string
): Promise<Result<string[], string>> => {
  try {
    const argumentsObject: Result<Record<string, string>[], string> =
      await getArguements(text);

    if (argumentsObject.isErr) {
      return err(argumentsObject.error);
    }

    console.log(argumentsObject.value);

    const svgImages: string[] = argumentsObject.value.map((argument) =>
      replacePlaceholders(argument)
    );

    const result: string[] = await Promise.all(
      svgImages.map((svgImage) => convertSVGToJPG(svgImage))
    );

    return ok(result);
  } catch (error) {
    return err(`Unexpected error in converting text to image: ${error}`);
  }
};
