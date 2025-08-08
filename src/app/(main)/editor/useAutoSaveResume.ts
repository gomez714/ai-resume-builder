import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { saveResume } from "./actions";
import { fileReplacer } from "@/lib/utils";


export default function useAutoSaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams();

  const debouncedResumeData = useDebounce(resumeData, 1500);

  const [resumeId, setResumeId] = useState(resumeData.id);

  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData])

  useEffect(() => {
    async function save() {
      try{
        setIsSaving(true);
        setIsError(false);
        const newData = structuredClone(debouncedResumeData);
        const updatedResume = await saveResume({
            ...newData,
            ...(JSON.stringify(lastSavedData.photo, fileReplacer) === JSON.stringify(newData.photo, fileReplacer) && {
                photo: undefined,
            }),
            id: resumeId,
        })

        setResumeId(updatedResume.id);
        setLastSavedData(newData);
        if (searchParams.get("resumeId") !== updatedResume.id) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set("resumeId", updatedResume.id);
            window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
        }


       } catch (error) {
        setIsError(true);
        console.error(error);
        const id = toast.error("Could not save resume.", {
          action: {
            label: "Retry",
            onClick: () => {
              toast.dismiss(id)
              save()
            },
          },
        })
       } finally {
        setIsSaving(false);
       }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save();
    }
  }, [debouncedResumeData, isSaving, lastSavedData, isError, searchParams, resumeId]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSavedData),
  };
}
