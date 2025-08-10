"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useState } from "react";
import { toast } from "sonner";
import { createCheckoutSession } from "./actions";
import { env } from "@/env";

const premiumFeatures = ["AI tools", "Up to 3 resumes"];
const premiumPlusFeatures = ["Infinite Resumes", "Design Customization"];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();
  const [loading, setLoading] = useState(false);

  async function handlePremiumClick(priceId: string) {
    try {
        setLoading(true);
        const redirectUrl = await createCheckoutSession(priceId);
        window.location.href = redirectUrl;
    } catch (error) {
        console.error(error)
        toast.error("Something went wrong");
    } finally {
        setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !loading && setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resume Builder Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Get premium subscription to unlock more features</p>
          <div className="flex">
            <div className="felx w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              <ul className="list-inside space-y-2">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
                  )
                }
                disabled={loading}
              >
                Upgrade to Premium
              </Button>
            </div>
            <div className="mx-6 border-l" />
            <div className="felx w-1/2 flex-col space-y-5">
              <h3 className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-center text-lg font-bold text-transparent">
                Premium Plus
              </h3>
              <ul className="list-inside space-y-2">
                {premiumPlusFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="premium"
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
                  )
                }
                disabled={loading}
              >
                Upgrade to Premium Plus
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
