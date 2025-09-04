"use client"

import { useState } from "react"
import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Shield } from "lucide-react"
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient"
import { multiExecuteContract } from "@/lib/andrjs/functions";
import { useStakingStore } from "@/zustand/staking";

function getRiskColor(risk: string) {
  switch (risk) {
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

function getRiskIcon(risk: string) {
  switch (risk) {
    case "Low":
      return <Shield className="h-4 w-4" />
    default:
      return <Shield className="h-4 w-4" />
  }
}

// Staking function that takes amount as argument
const useStake = (setStakeError: (msg: string | null) => void) => {
  const client = useAndromedaClient();
  return async (amount: string) => {
    if (!client) {
      setStakeError("Wallet not connected. Please connect your wallet.");
      throw new Error("Wallet not connected");
    }
    const parsed = Number(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setStakeError("Please enter a valid amount greater than 0.");
      throw new Error("Invalid amount");
    }
    const uandrAmount = BigInt(Math.floor(parsed * 1e6)).toString();
    try {
      await multiExecuteContract(client, [{
        contractAddress: "andr1lm9e8ljtk0apejjr0ejzwdzykkmenx4w2fphsyg5zzhpq05jlqxq9yljd2",
        msg: {
          stake: {
          },
        },
        funds: [
          {
            amount: uandrAmount,
            denom: "uandr"
          }
        ]
      }]);
    } catch (e: any) {
      console.error(e);
      // Handle insufficient funds error and show user-friendly message
      const errMsg = typeof e?.message === "string" ? e.message : String(e);
      if (
        errMsg.includes("insufficient funds") ||
        errMsg.includes("spendable balance") ||
        errMsg.includes("smaller than")
      ) {
        setStakeError(
          "Insufficient funds: You do not have enough ANDR tokens in your wallet to stake this amount. Please check your balance and try a smaller amount."
        );
      } else if (
        errMsg.includes("Wallet not connected")
      ) {
        setStakeError("Wallet not connected. Please connect your wallet.");
      } else {
        setStakeError(
          "Failed to stake. " +
          (errMsg ? `Error: ${errMsg}` : "Please try again.")
        );
      }
      throw e;
    }
  }
}

export default function StrategiesPage() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [staking, setStaking] = useState(false);
  const [stakeError, setStakeError] = useState<string | null>(null);
  const stake = useStake(setStakeError);
  const { stakedAmount, stakedDenom } = useStakingStore();

  // Only one active strategy: Staking
  const stakingStrategy = {
    id: 1,
    name: "ANDR Staking Plus",
    description: "Enhanced ANDR staking with additional yield from lending and DeFi strategies.",
    apy: "6.8%",
    risk: "Low",
    tvl: "$18.2M",
    category: "Staking",
    isActive: true,
  };

  // Coming soon strategies (displayed as disabled)
  const comingSoonStrategies = [
    {
      id: 2,
      name: "Euclid Staking",
      description: "Stay tuned for new yield strategies launching soon.",
      apy: "-",
      risk: "-",
      tvl: "-",
      category: "Coming Soon",
      isActive: false,
    }
  ];

  const handleStake = async () => {
    setStakeError(null);
    setStaking(true);
    try {
      await stake(stakeAmount);
      setStakeAmount("");
    } catch (e: any) {
      // Error is already set in useStake, but fallback just in case
      if (!stakeError) {
        setStakeError("Failed to stake. Please try again.");
      }
    }
    setStaking(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-foreground font-sans">Yield Strategies</h1>
              <p className="text-muted-foreground">
                Discover and invest in automated DeFi strategies to maximize your yields.
              </p>
            </div>

            {/* Staking Strategy Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{stakingStrategy.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {stakingStrategy.category}
                    </Badge>
                  </div>
                  <Badge className={`${getRiskColor(stakingStrategy.risk)} flex items-center gap-1`}>
                    {getRiskIcon(stakingStrategy.risk)}
                    {stakingStrategy.risk}
                  </Badge>
                </div>
                <CardDescription className="text-sm leading-relaxed">{stakingStrategy.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Strategy Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">{stakingStrategy.apy}</p>
                    <p className="text-xs text-muted-foreground">Current APY</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-lg font-semibold text-foreground">{stakingStrategy.tvl}</p>
                    <p className="text-xs text-muted-foreground">Total Value Locked</p>
                  </div>
                </div>
                
                {/* Staked Amount Display */}
                {stakedAmount && stakedDenom && (
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                      {stakedAmount} {stakedDenom}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">Currently Staked</p>
                  </div>
                )}
                {/* Stake Form */}
                <form
                  className="flex flex-col gap-2"
                  onSubmit={e => {
                    e.preventDefault();
                    handleStake();
                  }}
                >
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Amount to stake (ANDR)"
                      value={stakeAmount}
                      onChange={e => setStakeAmount(e.target.value)}
                      className="flex-1"
                      disabled={staking}
                    />
                    <Button
                      className="flex-none"
                      size="sm"
                      type="submit"
                      disabled={staking || !stakeAmount || Number(stakeAmount) <= 0}
                      onClick={e => {
                        e.preventDefault();
                        handleStake();
                      }}
                    >
                      {staking ? "Staking..." : "Stake"}
                    </Button>
                  </div>
                  {stakeError && (
                    <div className="text-sm text-red-600">{stakeError}</div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Coming Soon Strategies */}
            <div className="grid grid-cols-1 gap-6">
              {comingSoonStrategies.map((strategy) => (
                <Card key={strategy.id} className="opacity-60 pointer-events-none">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{strategy.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {strategy.category}
                        </Badge>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1">
                        {strategy.risk}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">{strategy.apy}</p>
                        <p className="text-xs text-muted-foreground">Current APY</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-lg font-semibold text-foreground">{strategy.tvl}</p>
                        <p className="text-xs text-muted-foreground">Total Value Locked</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm" disabled>
                        Deposit
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" size="sm" disabled>
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
