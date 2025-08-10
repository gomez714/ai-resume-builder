"use client"

import LoadingButton from "@/components/LoadingButton";
import { toast } from "sonner";
import { useState } from "react";
import { createCustomerPortalSession } from "./actions";

export default function ManageSubscriptionButton() {
    const [loading, setLoading] = useState(false);

    async function handleCLick() {
        try {
            setLoading(true)
            const redirectUrl = await createCustomerPortalSession();
            window.location.href = redirectUrl;
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false);
        }
    }

    return <LoadingButton onClick={handleCLick} loading={loading}>
        Manage Subscription
    </LoadingButton>


}