import LoadingButton from "@/components/LoadingButton";
import { ResumeValues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateSummary } from "./actions";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";

interface GenerateSummaryButtonProps {
  resumeData: ResumeValues;
  onSummaryGenerated: (summary: string) => void;
}

export default function GenerateSummaryButton({
  resumeData,
  onSummaryGenerated,
}: GenerateSummaryButtonProps) {
  const [loading, setLoading] = useState(false);
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModal();

  async function handleClick() {
    if (!canUseAITools(subscriptionLevel)) {
      premiumModal.setOpen(true);
      return;
    }

    try {
        setLoading(true);
        const summary = await generateSummary(resumeData);
        onSummaryGenerated(summary);
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong while generating the summary. Please try again later.")
    } finally {
        setLoading(false);
    }
  }

  return (
    <LoadingButton variant="outline" loading={loading} onClick={handleClick}>
      <WandSparklesIcon className="size-4" /> 
      Generate Summary
    </LoadingButton>
  );
}
