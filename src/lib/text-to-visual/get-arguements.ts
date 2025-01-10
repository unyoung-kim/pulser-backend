import { Result } from "true-myth";
import { generateText } from "ai";
import { err, ok } from "true-myth/result";
import { getThrottledGPT4o } from "../get-llm-models.js";
import { problemVsSolutionComparisonVisualizationTool } from "../tools/text-to-visual/problem-vs-solution-comparison-visualization-tool.js";
import { threeCircleHorizontalVisualizationTool } from "../tools/text-to-visual/three-circle-horizontal-visualization-tool.js";
import { threeCircleSequentialFlowVisualizationTool } from "../tools/text-to-visual/three-circle-sequential-flow-visualization-tool.js";
import { cyclicFourStepProcessVisualizationTool } from "../tools/text-to-visual/cyclic-four-step-process-visualization.js";
import { fourStageOverlappingCircularVisualizationTool } from "../tools/text-to-visual/four-stage-overlapping-circular-visualization-tool.js";
import { fiveNodeCloudCentricVisualizationTool } from "../tools/text-to-visual/five-node-cloud-centric-visualization-tool.js";
import { fourLayeredLightbulbVisualizationTool } from "../tools/text-to-visual/four-layered-lightbulb-visualization-tool.js";
import { populationAndDistributionVisualizationTool } from "../tools/text-to-visual/population-and-distribution-visualization.js";
import { arrowLinkedFourStepVisualizationTool } from "../tools/text-to-visual/arrow-linked-four-step-visualization-tool.js";
import { hubAndSpokeContributionVisualizationTool } from "../tools/text-to-visual/hub-and-spoke-contribution-visualization-tool.js";
import { centralHubFeaturesVisualizationTool } from "../tools/text-to-visual/central-hub-features-visualization-tool.js";
import { circularFourStepProcessVisualizationTool } from "../tools/text-to-visual/circular-four-step-process-visualization-tool.js";
import { gearCentricFourProcessesVisualizationTool } from "../tools/text-to-visual/gear-centric-four-processes-visualization-tool.js";
import { fiveStepBubbleFlowVisualizationTool } from "../tools/text-to-visual/five-step-bubble-flow-visualization-tool.js";
import { fourStepCircularNodeFlowVisualizationTool } from "../tools/text-to-visual/four-step-circular-node-flow-visualization-tool.js";
import { sixStageAlternatingDescriptionVisualizationTool } from "../tools/text-to-visual/six-stage-alternating-description-visualization-tool.js";
import { fourPointsZigzagPathVisualizationTool } from "../tools/text-to-visual/four-points-zigzag-path-visualization-tool.js";
import { circularMetricsVisualizationTool } from "../tools/text-to-visual/circular-metrics-visualization-tool.js";
import { centralNodeWithFiveConnectedPointsVisualizationTool } from "../tools/text-to-visual/central-node-with-five-connected-points-visualization-tool.js";
import { threeSegmentCircularVisualizationTool } from "../tools/text-to-visual/three-segment-circular-visualization-tool.js";

const SYSTEM_PROMPT = `
You are provided with:  
1. Input String: A single string that conveys the context or topic for generating an SVG image.  
2. Tools: A collection of tools, where each tool corresponds to a specific SVG template designed for particular use cases.  

Your responsibilities:  
1. Purpose: Your task is not to generate SVGs yourself but to:  
   - Analyze the input string.  
   - Select 5 most appropriate tools/templates based on their description and intended use.  
   - Provide meaningful placeholder values for all required arguments (text and icons).  
   - Call the selected tools with these arguments and directly return their outputs.  

2. Tool Selection:  
   - Refer to the description of each tool to decide the best 5 matches for the input context.  
   - Each tool is designed for a specific type of SVG layout or visualization.  

3. Argument Values:  
   - Text Arguments: Provide concise, meaningful, and contextually relevant text. Each description line should be max 30 characters.
   - Icon Arguments:  
     - Provide valid Lucide icon names in PascalCase format.  
     - If no exact match exists, choose a closely related icon that aligns with the context.  
     - Ensure icons strictly conform to the Lucide icon library.  

4. Output Rules:  
   - Strictly output the return values provided by calling the chosen tools in an array format [tool1Result, tool2Result, tool3Result, tool4Result, tool5Result]. Do not add any words or special characters to it.
   - Use '&amp;' instead of '&'.
`;

export const getArguements = async (
  text: string
): Promise<Result<Record<string, string>[], string>> => {
  try {
    const currentDate = new Date().toLocaleString();

    const result = await generateText({
      model: await getThrottledGPT4o(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      prompt: text,
      tools: {
        arrowLinkedFourStepVisualizationTool:
          arrowLinkedFourStepVisualizationTool(),
        hubAndSpokeContributionVisualizationTool:
          hubAndSpokeContributionVisualizationTool(),
        centralHubFeaturesVisualizationTool:
          centralHubFeaturesVisualizationTool(),
        centralNodeWithFiveConnectedPointsVisualizationTool:
          centralNodeWithFiveConnectedPointsVisualizationTool(),
        circularFourStepProcessVisualizationTool:
          circularFourStepProcessVisualizationTool(),
        circularMetricsVisualizationTool: circularMetricsVisualizationTool(),
        cyclicFourStepProcessVisualizationTool:
          cyclicFourStepProcessVisualizationTool(),
        fiveNodeCloudCentricVisualizationTool:
          fiveNodeCloudCentricVisualizationTool(),
        fiveStepBubbleFlowVisualizationTool:
          fiveStepBubbleFlowVisualizationTool(),
        fourLayeredLightbulbVisualizationTool:
          fourLayeredLightbulbVisualizationTool(),
        fourPointsZigzagPathVisualizationTool:
          fourPointsZigzagPathVisualizationTool(),
        fourStageOverlappingCircularVisualizationTool:
          fourStageOverlappingCircularVisualizationTool(),
        fourStepCircularNodeFlowVisualizationTool:
          fourStepCircularNodeFlowVisualizationTool(),
        gearCentricFourProcessesVisualizationTool:
          gearCentricFourProcessesVisualizationTool(),
        populationAndDistributionVisualizationTool:
          populationAndDistributionVisualizationTool(),
        problemVsSolutionComparisonVisualizationTool:
          populationAndDistributionVisualizationTool(),
        sixStageAlternatingDescriptionVisualizationTool:
          sixStageAlternatingDescriptionVisualizationTool(),
        threeCircleHorizontalVisualizationTool:
          threeCircleHorizontalVisualizationTool(),
        threeCircleSequentialFlowVisualizationTool:
          threeCircleSequentialFlowVisualizationTool(),
        threeSegmentCircularVisualizationTool:
          threeSegmentCircularVisualizationTool(),
      },
    });

    const toolResults = result.toolResults.map(
      (toolResult) => toolResult.result
    );

    if (!toolResults) {
      return err("Couldn't get tool result from the LLM output");
    }

    return ok(toolResults);
  } catch (error) {
    console.error("Error in template arguments generation:", error);
    return err(
      "An error has occured from the get template and arguments function"
    );
  }
};
