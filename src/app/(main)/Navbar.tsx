"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo-full.png";
import logoWhite from "@/assets/logo-full-white.png";
import { UserButton } from "@clerk/nextjs";
import { CreditCardIcon } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        <Link href="/resumes" className="flex items-center gap-2">
          <div className="relative h-[50px] w-[100px]">
            {/* Light theme logo */}
            <Image
              src={logo}
              alt="Resume Builder logo"
              width={100}
              height={50}
              className="block dark:hidden"
              priority
            />
            {/* Dark theme logo */}
            <Image
              src={logoWhite}
              alt="Resume Builder logo"
              width={100}
              height={50}
              className="hidden dark:block"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Resume Builder
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton
            appearance={{
              baseTheme: mounted && resolvedTheme === "dark" ? dark : undefined,
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
