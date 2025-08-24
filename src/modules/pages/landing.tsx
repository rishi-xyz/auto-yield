"use client";

import GridBackground from "@/components/GridBackground";
import { useChainConfig } from "@/lib/andrjs/hooks/useChainConfig";
import React from "react";
import { ConnectWallet } from "../wallet";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAndromedaStore } from "@/zustand/andromeda";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {}

const LandingPage: React.FC<Props> = () => {
  const { data, isLoading } = useChainConfig(
    process.env.NEXT_PUBLIC_CHAIN_IDENTIFIER || ""
  );
  const { isConnected } = useAndromedaStore();

  return (
    <GridBackground>
      <div className="relative flex flex-col min-h-screen items-center justify-center gap-6 px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/logo.png"
            className="w-28 h-28 mx-auto drop-shadow-lg"
            alt="AutoYield logo"
            width={120}
            height={120}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent"
        >
          AutoYield
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-muted-foreground max-w-md"
        >
          Optimize your DeFi yields effortlessly across chains with
          intelligent automation.
        </motion.p>

        {/* Chain Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4"
        >
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading chain...</p>
          ) : (
            <p className="text-sm">
              Connected to <b>{data?.displayName}</b>
            </p>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 mt-6"
        >
          <Link href={"/dashboard"}>
            <Button
              disabled={!isConnected}
              className="px-6 py-3 text-lg font-medium shadow-lg hover:scale-105 transition-transform"
            >
              Go To Dashboard
            </Button>
          </Link>
          <ConnectWallet />
        </motion.div>
      </div>
    </GridBackground>
  );
};

export default LandingPage;
