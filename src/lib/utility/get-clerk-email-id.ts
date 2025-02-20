import { clerkClient } from "@clerk/express";
import { Result, err, ok } from "true-myth/result";

export const getClerkEmailId = async (
  userId: string
): Promise<Result<string, string>> => {
  try {
    const user = await clerkClient.users.getUser(userId);
    console.log("user: ", user);
    if (user.emailAddresses.length === 0) {
      return err("No email address found for user");
    }
    return ok(user.emailAddresses[0].emailAddress);
  } catch (error) {
    console.error("Error fetching email id: ", error);
    return err(`Error fetching email id: ${error}`);
  }
};
