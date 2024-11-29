import Result, { ok } from "true-myth/result";
import Stripe from "stripe";

export const logInformationalEvent = async (
  event: Stripe.Event
): Promise<Result<string, string>> => {
  console.log(`Informational event received:`);
  console.log(`Event ID: ${event.id}`);
  console.log(`Event Type: ${event.type}`);

  // Log the object that triggered the event
  if (event.data && event.data.object) {
    console.log(`Event Object:`, event.data.object);
  } else {
    console.log(`Event Object: Not Available`);
  }

  // Log additional metadata if available
  if ("metadata" in event.data.object) {
    console.log(`Metadata:`, event.data.object.metadata);
  } else {
    console.log(`Metadata: Not Available`);
  }

  // Log timestamp of the event for better tracking
  const eventTimestamp = new Date(event.created * 1000).toISOString();
  console.log(`Event Timestamp: ${eventTimestamp}`);

  return ok("Event logged successfully with details.");
};
