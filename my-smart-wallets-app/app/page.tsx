"use client";

import { useSignerStatus } from "@account-kit/react";
import UserInfoCard from "./components/user-info-card";
import NftMintCard from "./components/nft-mint-card";
import LoginCard from "./components/login-card";
import Header from "./components/header";
import LearnMore from "./components/learn-more";

export default function Home() {
  const signerStatus = useSignerStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,37,148,0.1),transparent_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-bg-main bg-cover bg-center bg-no-repeat opacity-20"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <Header />
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
          {signerStatus.isConnected ? (
            <div className="grid gap-8 md:grid-cols-[1fr_2fr] h-full">
              <div className="flex flex-col gap-8 animate-slide-in">
                <UserInfoCard />
                <LearnMore />
              </div>
              <div className="animate-scale-in animation-delay-200">
                <NftMintCard />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full pb-[4rem]">
              <div className="animate-scale-in">
                <LoginCard />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
