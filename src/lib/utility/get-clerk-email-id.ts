import { clerkClient } from "@clerk/express";
import { Result, err, ok } from "true-myth/result";

export const getClerkEmailId = async (
  userId: string
): Promise<Result<string, string>> => {
  const user = await clerkClient.users.getUser(userId);
  if (user.emailAddresses.length === 0) {
    return err("No email address found for user");
  }
  return ok(user.emailAddresses[0].emailAddress);
};
