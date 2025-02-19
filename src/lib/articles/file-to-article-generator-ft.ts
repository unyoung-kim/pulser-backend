import { Result } from "true-myth";
import { err, ok } from "true-myth/result";
import { EnrichedURL } from "../internal-link/enrich-internal-links.js";
import { fineTunedWriter, ftWriterEnhancer } from "../agents/writer-ft.js";
import { fileToArticleResearcher } from "../agents/file-to-article-researcher.js";

export const fileToArticleGeneratorFT = async (
  text: string,
  clientDetails: string,
  enrichedURLs: EnrichedURL[],
  topic: string,
  instruction?: string
): Promise<Result<string, string>> => {
  const outline: Result<string, string> = await fileToArticleResearcher(
    topic,
    text,
    instruction
  );

  if (outline.isErr) {
    return err(outline.error);
  }

  console.log("outline: ", outline.value);

  const article: Result<string, string> = await fineTunedWriter(outline.value);

  if (article.isErr) {
    return err(article.error);
  }

  const enhancedArticle: Result<string, string> = await ftWriterEnhancer(
    article.value,
    clientDetails,
    enrichedURLs
  );

  if (enhancedArticle.isErr) {
    return err(enhancedArticle.error);
  }

  console.log("enhancedArticle: ", enhancedArticle.value);

  return ok(enhancedArticle.value);
};
