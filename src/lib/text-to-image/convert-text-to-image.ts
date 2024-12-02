import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { getTemplateAndArguments } from "./get-template-and-arguments.js";
import { getImage } from "./get-image.js";

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
    const result: string = getImage(argumentObject.value);
    return ok(result);
  } catch (error) {
    return err(`Unexpected error in converting text to image: ${error}`);
  }
};
