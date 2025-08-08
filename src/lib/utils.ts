import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeValues } from "./validation";
import { ResumeServerData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File ? {
    name: value.name,
    size: value.size,
    type: value.type,
    lastModified: value.lastModified,
    
  } : value;
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    jobTitle: data.jobTitle || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    email: data.email || undefined,
    phone: data.phone || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    workExperiences: data.workExperiences.map((workExperience) => ({
      position: workExperience.position || undefined,
      company: workExperience.company || undefined,
      startDate: workExperience.startDate?.toISOString().split("T")[0],
      endDate: workExperience.endDate?.toISOString().split("T")[0],
      description: workExperience.description || undefined,
    })),
    educations: data.educations.map((education) => ({
      school: education.school || undefined,
      degree: education.degree || undefined,
      startDate: education.startDate?.toISOString().split("T")[0],
      endDate: education.endDate?.toISOString().split("T")[0],
    })),
    skills: data.skills,
    borderStyle: data.borderStyle ,
    colorHex: data.colorHex ,
    summary: data.summary || undefined,
  }
}