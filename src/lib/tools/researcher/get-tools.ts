import { searchSubTopicsTool, searchTool } from "./search-tool.js";

export const getTools = () => {
  const tools: any = {
    search: searchTool(),
    subtopicSearch: searchSubTopicsTool(),
    // retrieve: retrieveTool(),
  };

  // if (process.env.SERPER_API_KEY) {
  //   tools.videoSearch = videoSearchTool();
  //   tools.imageSearch = imageSearchTool();
  // }

  return tools;
};
