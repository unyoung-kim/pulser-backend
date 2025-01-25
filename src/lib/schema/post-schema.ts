import { z } from "zod";

export const PostSchema = z.object({
  projectId: z
    .string()
    .describe("Id of the project or which blog post needs to be generated"),
  inputTopic: z.string().describe("The blog topic"),
  keywordId: z
    .string()
    .describe("Keyword to be used to generate the blog post topic"),
  type: z
    .enum(["NORMAL", "GLOSSARY"])
    .describe("Type of the content to be generated"),
  length: z
    .enum(["LONG", "SHORT"])
    .describe("Length of the content to be generated"),
  secondaryKeywords: z
    .array(z.string())
    .optional()
    .describe("Secondary keywords to be included in the blog post"),
  instruction: z
    .string()
    .optional()
    .describe("Content to be included in the blog post"),
  // wordCount: z
  //   .number()
  //   .optional()
  //   .describe("Ideal word count of the blog post"),
});

export type PostSchema = z.infer<typeof PostSchema>;
