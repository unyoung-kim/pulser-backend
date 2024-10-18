import { retrieveTool } from './retrieve-tool'
import { searchTool } from './search-tool'
import { videoSearchTool } from './video-search'


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
