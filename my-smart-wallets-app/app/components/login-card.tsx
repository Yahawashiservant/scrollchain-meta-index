"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@account-kit/react";
export default function LoginPage() {
  const { openAuthModal } = useAuthModal();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  return (
    <Card
      className={cn(
        "relative w-full max-w-md shadow-xl border border-gray-200/50",
        "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md",
        "hover:shadow-2xl transition-all duration-300"
      )}
    >
      <CardHeader className={cn("text-center space-y-4 pb-8")}>
        <CardTitle
          className={cn(
            "text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600",
            "dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          )}
        >
          Smart Wallets
        </CardTitle>
        <CardDescription
          className={cn("text-base text-gray-600 dark:text-gray-400")}
        >
          Experience seamless onchain UX with smart wallets. Click log in to
          continue.
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-6 pb-8")}>
        <Button
          size="lg"
          onClick={() => openAuthModal()}
          disabled={isLoggingIn}
          className={cn(
            "w-full h-14 text-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
            "hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 border-0 shadow-2xl hover:shadow-3xl",
            "backdrop-blur-sm text-white animate-pulse-glow",
            "transition-all duration-300 transform hover:scale-105",
            "relative overflow-hidden"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-center">
            {isLoggingIn ? (
              <>
                <Loader2 className={cn("animate-spin -ml-1 mr-3 h-6 w-6")} />
                Connecting...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                Connect Wallet
                <span className="ml-2">✨</span>
              </>
            )}
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
