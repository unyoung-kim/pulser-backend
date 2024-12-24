export const extractValidJSON = (
  input: string
): Record<string, string> | null => {
  try {
    // Use regex to extract the JSON part
    const jsonMatch = input.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in LLM output.");
    }

    const extractedJSON = jsonMatch[0];
    // Parse the JSON string
    return JSON.parse(extractedJSON);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null; // Return null if parsing fails
  }
};
