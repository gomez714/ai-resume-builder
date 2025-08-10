"use server";

import { canCreateResume, canUseCustomization } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { ResumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { extension as extFromMime } from "mime-types";
import path from "path";

function inferExt(file: File) {
  // Prefer MIME to avoid trusting user-supplied names
  const byMime = extFromMime(file.type);
  if (byMime) return `.${byMime}`;
  const ext = path.extname(file.name);
  return ext || ".bin"; // last-resort fallback
}

export async function saveResume(values: ResumeValues) {
  const { id } = values;

  const { photo, workExperiences, educations, ...resumeValues } =
    ResumeSchema.parse(values);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User Not Authenticated");
  }

  // TODO: Check Resume count for non-premium users
  const subscriptionLevel = await getUserSubscriptionLevel(userId);
  if (!id) {
    const resumeCount = await prisma.resume.count({ where: { userId } });
    if (!canCreateResume(subscriptionLevel, resumeCount)) {
      throw new Error("You have reached the maximum number of resumes");
    }
  }

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume Not Found");
  }

  const hasCustomizations =
    (resumeValues.borderStyle &&
      resumeValues.borderStyle !== existingResume?.borderStyle) ||
    (resumeValues.colorHex &&
      resumeValues.colorHex !== existingResume?.colorHex);

  if (hasCustomizations && !canUseCustomization(subscriptionLevel)) {
    throw new Error("Customizations are not allowed for your subscription level");
  }

  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    const ext = inferExt(photo);
    // Scope by user; UUID for uniqueness; avoid leaking original filename/PII
    const key = `resume_photos/${userId}/${randomUUID()}${ext}`;

    const blob = await put(key, photo, {
      access: "public", // or "private" if you plan to serve with signed URLs
      contentType: photo.type || undefined,
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  if (id) {
    return prisma.resume.update({
      where: { id, userId },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((experience) => ({
            ...experience,
            startDate: experience.startDate
              ? new Date(experience.startDate)
              : undefined,
            endDate: experience.endDate
              ? new Date(experience.endDate)
              : undefined,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((education) => ({
            ...education,
            startDate: education.startDate
              ? new Date(education.startDate)
              : undefined,
            endDate: education.endDate
              ? new Date(education.endDate)
              : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences?.map((experience) => ({
            ...experience,
            startDate: experience.startDate
              ? new Date(experience.startDate)
              : undefined,
            endDate: experience.endDate
              ? new Date(experience.endDate)
              : undefined,
          })),
        },
        educations: {
          create: educations?.map((education) => ({
            ...education,
            startDate: education.startDate
              ? new Date(education.startDate)
              : undefined,
            endDate: education.endDate
              ? new Date(education.endDate)
              : undefined,
          })),
        },
      },
    });
  }
}
