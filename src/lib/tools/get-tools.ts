import { retrieveTool } from './retrieve-tool.js'
import { searchTool } from './search-tool.js'
import { videoSearchTool } from './video-search.js'


export const getTools = () => {
  const tools: any = {
    search: searchTool(),
    retrieve: retrieveTool()
  }

  if (process.env.SERPER_API_KEY) {
    tools.videoSearch = videoSearchTool()
  }

  return tools
}
