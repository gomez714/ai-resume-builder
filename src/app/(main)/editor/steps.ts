import { EditorFormProps } from "@/lib/types";

import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";

export const steps: {
    title: string;
    component: React.ComponentType<EditorFormProps>;
    key: string;
}[] = [
    {
        title: "General Information",
        component: GeneralInfoForm,
        key: "general-info",
    },
    {
        title: "Personal Information",
        component: PersonalInfoForm,
        key: "personal-info",
    },
    {
        title: "Work Experience",
        component: WorkExperienceForm,
        key: "work-experience",
    },
]