"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo-full.png";
import logoBlack from "@/assets/logo-full-black.png";
import logoWhite from "@/assets/logo-full-white.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCardIcon } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function Navbar() {
  const { theme } = useTheme();
  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <Link href="/resumes" className="flex items-center gap-2">
          {/* //TODO: Have logo change on dark mode switch */}
          <Image
            src={theme === "dark" ? logoWhite : logo}
            alt="logo"
            width={100}
            height={50}
          />
          <span className="text-xl font-bold tracking-tight">
            Resume Builder{" "}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                href="/billing"
                label="Billing"
                labelIcon={<CreditCardIcon className="size-4" />}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}
