"use server";

import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "@/env";

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer_email: user.emailAddresses[0].emailAddress,
    subscription_data: {
        metadata: {
            userId: user.id,
        }
    },
    custom_text: {
        terms_of_service_acceptance: {
            message: `By checking out, you agree to our [Terms of Service](${env.NEXT_PUBLIC_BASE_URL}/tos)`,
        }
    },
    consent_collection: {
        terms_of_service: "required",
    }
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }
  console.log("session.url", session.url);
  return session.url;
}
