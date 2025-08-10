"use server";

import openai from "@/lib/openai";
import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  generateWorkExperienceSchema,
  GenerateWorkExperienceInput,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

export async function generateSummary(input: GenerateSummaryInput) {
  // TODO: Block for non premium users
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);
  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade subscription to use AI tools");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    You are the best job resume generator AI. Your task is to write a professional summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `;

  const userMessage = `
    Please generate a professional resume summary from the following data:
    Job Title: ${jobTitle || "N/A"}
    Work Experience: 
    ${workExperiences
      ?.map(
        (experience) => `
        Position: ${experience.position || "N/A"} at ${experience.company || "N/A"} from ${experience.startDate || "N/A"} to ${experience.endDate || "N/A"}
        
        Description: ${experience.description || "N/A"}
        `,
      )
      .join("\n\n")}

    Education: 
    ${educations
      ?.map(
        (education) => `
        Degree: ${education.degree || "N/A"} at ${education.school || "N/A"} from ${education.startDate || "N/A"} to ${education.endDate || "N/A"}
        
        `,
      )
      .join("\n\n")}

    Skills: 
    ${skills}
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const aiResponse = response.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI summary");
  }

  return aiResponse;
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  //TODO: Block for non premium users

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);
  if (!canUseAITools(subscriptionLevel)) {
    throw new Error("Upgrade subscription to use AI tools");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are the best job resume generator AI. Your task is to write a single work experience for a resume given the user's provided input.
  Your response should be in the following format. You can omit fields if they can't be infered from the provided data, but don't add any new ones.

  Job Title: <job title>
  Company: <company name>
  Start Date: <format: YYYY-MM-DD> (only if provided)
  End Date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be infered from the job title>
  `;

  const userMessage = `
  Please generate a professional work experience entry from the following description:
  ${description}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const aiResponse = response.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI work experience");
  }

  return {
    position: aiResponse.match(/Job Title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    startDate: aiResponse.match(/Start Date: (\d{4}-\d{2}-\d{2})?/)?.[1],
    endDate: aiResponse.match(/End Date: (\d{4}-\d{2}-\d{2})?/)?.[1],
    description: (aiResponse.match(/Description: ([\s\S]*)/)?.[1] || "").trim(),
  } satisfies WorkExperience;
}
