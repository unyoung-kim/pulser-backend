import { multiMediaSearchTool } from "./media-enrich.js";

export const getOutlineEnrichTools = () => {
  const tools: any = {};

  if (process.env.SERPER_API_KEY) {
    tools.multiMediaSearch = multiMediaSearchTool();
    // tools.videoSearch = videoSearchTool();
    // tools.imageSearch = imageSearchTool();
  }

  return tools;
};
