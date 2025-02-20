import { SupabaseClient } from "@supabase/supabase-js";
import { Result, err, ok } from "true-myth/result";
import { getSupabaseClient } from "../../get-supabase-client.js";
import { incrementUsageCredit } from "../../supabase/usage.js";
import { getClerkEmailId } from "../../utility/get-clerk-email-id.js";
import { sendEmail } from "../../utility/send-email.js";
import { researcherListicle } from "./researcher.js";
import { writerListicle } from "./writer.js";
/**
 * Based on user query, generate a blog post
 *
 * 1) Researcher comes up with an outline
 * 2) Writer comes up with an article using the outline
 * @param query
 * @returns
 */
export async function generateListicles({
  projectId,
  inputTopics,
}: {
  projectId: string;
  inputTopics: string[];
}): Promise<Result<string, string>> {
  const supabaseClient: Result<SupabaseClient, string> = getSupabaseClient();

  if (supabaseClient.isErr) {
    return err(supabaseClient.error);
  }

  const supabase = supabaseClient.value;

  const { data: project, error: projectError } = await supabase
    .from("Project")
    .select("name,domain,background,description,org_id,clerk_user_id")
    .eq("id", projectId)
    .single();

  if (projectError) {
    return err(`Error fetching project details: ${projectError.message}`);
  }

  try {
    let successfulListicleTopics: string[] = [];
    let failedListicleTopics: string[] = [];
    // For every input topic, generate a listicle

    await Promise.all(
      inputTopics.map(async (inputTopic) => {
        const listicle: Result<string, string> = await generateSingleListicle(
          inputTopic,
          JSON.stringify(project, null, 2)
        );

        if (listicle.isErr) {
          failedListicleTopics.push(inputTopic);
          return;
        }

        // Save the listicle
        const { data: dataContentInsert, error: errorContentInsert } =
          await supabase
            .from("Content")
            .insert([
              {
                status: "draft",
                project_id: projectId,
                title: inputTopic,
                type: "LISTICLE",
              },
            ])
            .select();

        const contentId: string | null = dataContentInsert?.at(0)?.id ?? null;

        if (contentId == null || contentId.length == 0) {
          return err("Error fetching created content id");
        }

        const { error: errorContentBodyInsert } = await supabase
          .from("ContentBody")
          .insert([
            {
              content_id: contentId,
              body: listicle.value,
            },
          ]);

        if (errorContentBodyInsert) {
          throw new Error(
            `Error saving content body: ${errorContentBodyInsert.message}`
          );
        }

        // If successful take credits
        if (dataContentInsert && dataContentInsert.length > 0) {
          await incrementUsageCredit(
            supabase,
            project?.org_id ?? "",
            "LISTICLE"
          );
        }

        successfulListicleTopics.push(inputTopic);
      })
    );

    const emailId: Result<string, string> = await getClerkEmailId(
      project?.clerk_user_id ?? ""
    );

    if (emailId.isErr) {
      console.error(`Error fetching email id: ${emailId.error}`);
      return ok("Listicle generation successful but failed to send email");
    } else {
      let emailMessage = `Successfully generated articles for: ${successfulListicleTopics.join(
        ", "
      )}`;
      if (failedListicleTopics.length > 0) {
        emailMessage += `\nFailed to generate articles for: ${failedListicleTopics.join(
          ", "
        )}`;
      }
      await sendEmail(emailId.value, "Article generation status", emailMessage);
    }

    return ok("Listicle generation successful");
  } catch (error) {
    console.error("Error in listicle generation: ", error);
    return err(`Error in listicle generation: ${error}`);
  }
}

/**
 * Generate a single listicle
 * @param inputTopic
 * @returns
 */
export async function generateSingleListicle(
  inputTopic: string,
  projectInfo: string
): Promise<Result<string, string>> {
  try {
    const outline: Result<string, string> = await researcherListicle(
      inputTopic
    );

    if (outline.isErr) {
      return err(outline.error);
    }

    console.log("outline: ", outline.value);

    const article: Result<string, string> = await writerListicle(
      inputTopic,
      outline.value,
      projectInfo
    );

    if (article.isErr) {
      return err(article.error);
    }

    // Create article
    return ok(article.value);
  } catch (error) {
    console.error("Error in generateSingleListicle: ", error);
    return err(`Error in generateSingleListicle: ${error}`);
  }
}
