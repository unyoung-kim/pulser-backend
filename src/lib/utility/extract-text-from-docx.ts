import mammoth from "mammoth";

export const extractTextFromDocx = async (
  filePath: string
): Promise<string> => {
  try {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  } catch (error) {
    console.error("Error extracting DOCX text:", error);
    return "";
  }
};
