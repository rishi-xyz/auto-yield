"use client";

import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Trophy, Coins } from "lucide-react"
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient"
import { queryContract } from "@/lib/andrjs/functions"
import { useState } from "react"
import { useStakingStore } from "@/zustand/staking"

// Helper to format uandr to ANDR (assuming 6 decimals)
function formatUandr(amount: string) {
  const num = Number(amount) / 1_000_000
  return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

export default function RewardsPage() {
  const [stakeError, setStakeError] = useState<string | null>(null)
  const [rewardsLoading, setRewardsLoading] = useState(false)
  const [rewardsData, setRewardsData] = useState<any | null>(null)
  const [rewardsError, setRewardsError] = useState<string | null>(null)
  const client = useAndromedaClient();
  const { setStakedAmount } = useStakingStore();
  const fetchRewards = async () => {
    setRewardsLoading(true)
    setRewardsError(null)
    setRewardsData(null)
    try {
      if (!client) {
        setRewardsError("Wallet not connected. Please connect your wallet.")
        setRewardsLoading(false)
        return
      }
      const msg = {
        staked_tokens: {
        },
      }
      const response = await queryContract(
        client,
        "andr1lm9e8ljtk0apejjr0ejzwdzykkmenx4w2fphsyg5zzhpq05jlqxq9yljd2",
        msg
      )
      // The response is the object you pasted in the prompt
      // { delegator, validator, amount, can_redelegate, accumulated_rewards }
      // So we need to set rewardsData.result = response for the rest of the code to work
      setRewardsData({ result: response, generatedAt: Date.now() })
      
      // Store staked amount in global state
      if (response?.amount?.amount && response?.amount?.denom) {
        const formattedAmount = formatUandr(response.amount.amount)
        const formattedDenom = response.amount.denom.replace(/^u/, "").toUpperCase()
        setStakedAmount(formattedAmount, formattedDenom)
      }
    } catch (err: any) {
      setRewardsError(err?.message || "Failed to fetch rewards")
    } finally {
      setRewardsLoading(false)
    }
  }
  const claimRewards = async () => {
    if (!client) {
      setStakeError("Wallet not connected. Please connect your wallet.")
      throw new Error("Wallet not connected")
    }
    const msg = {
      claim: {
      },
    }
    await queryContract(client, "andr1lm9e8ljtk0apejjr0ejzwdzykkmenx4w2fphsyg5zzhpq05jlqxq9yljd2", msg)
  }

  // For summary cards, show 0 if no rewardsData or rewardsData.result
  const accumulatedRewards = rewardsData?.result?.accumulated_rewards?.[0]
  const claimableAmount = accumulatedRewards ? formatUandr(accumulatedRewards.amount) : "0"
  const claimableDenom = accumulatedRewards ? accumulatedRewards.denom.replace(/^u/, "").toUpperCase() : "ANDR"

  // Helper: safely get nested property or fallback
  function safeGet(obj: any, path: string[], fallback: any = "") {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) ?? fallback;
  }

  // Helper: check if rewardsData.result exists and is an object
  const hasResult = rewardsData && typeof rewardsData.result === "object" && rewardsData.result !== null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-foreground font-sans">Rewards</h1>
              <p className="text-muted-foreground">
                Claim your earned rewards and track your staking performance.
              </p>
            </div>

            {/* Rewards Summary */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Claimable</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {claimableAmount} {claimableDenom}
                  </div>
                  <p className="text-xs text-muted-foreground">Ready to claim</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="claimable" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="claimable">Claimable Rewards</TabsTrigger>
              </TabsList>

              {/* Claimable Rewards Tab */}
              <TabsContent value="claimable" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Coins className="h-5 w-5" />
                          Staking Rewards
                        </CardTitle>
                        <CardDescription>
                          View and claim your staking rewards. Click &quot;Fetch Rewards&quot; to update.
                        </CardDescription>
                      </div>
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90"
                        onClick={fetchRewards}
                        disabled={rewardsLoading}
                      >
                        {rewardsLoading ? "Fetching..." : "Fetch Rewards"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {rewardsError && (
                      <div className="mb-4 text-red-600 text-sm">{rewardsError}</div>
                    )}
                    {hasResult ? (
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <div className="font-semibold mb-1">Delegator</div>
                            <div className="break-all text-muted-foreground">
                              {safeGet(rewardsData, ["result", "delegator"], <span className="italic text-muted-foreground">N/A</span>)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold mb-1">Validator</div>
                            <div className="break-all text-muted-foreground">
                              {safeGet(rewardsData, ["result", "validator"], <span className="italic text-muted-foreground">N/A</span>)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <div className="font-semibold mb-1">Staked Amount</div>
                            <div>
                              {safeGet(rewardsData, ["result", "amount", "amount"], "") !== "" && safeGet(rewardsData, ["result", "amount", "denom"], "") !== "" ? (
                                <>
                                  {formatUandr(safeGet(rewardsData, ["result", "amount", "amount"], "0"))}{" "}
                                  {safeGet(rewardsData, ["result", "amount", "denom"], "uandr").replace(/^u/, "").toUpperCase()}
                                </>
                              ) : (
                                <span className="italic text-muted-foreground">N/A</span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold mb-1">Can Redelegate</div>
                            <div>
                              {safeGet(rewardsData, ["result", "can_redelegate", "amount"], "") !== "" && safeGet(rewardsData, ["result", "can_redelegate", "denom"], "") !== "" ? (
                                <>
                                  {formatUandr(safeGet(rewardsData, ["result", "can_redelegate", "amount"], "0"))}{" "}
                                  {safeGet(rewardsData, ["result", "can_redelegate", "denom"], "uandr").replace(/^u/, "").toUpperCase()}
                                </>
                              ) : (
                                <span className="italic text-muted-foreground">N/A</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold mb-1">Accumulated Rewards</div>
                          {Array.isArray(safeGet(rewardsData, ["result", "accumulated_rewards"], [])) && safeGet(rewardsData, ["result", "accumulated_rewards"], []).length > 0 ? (
                            <ul>
                              {safeGet(rewardsData, ["result", "accumulated_rewards"], []).map((reward: any, idx: number) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <Gift className="h-4 w-4 text-primary" />
                                  <span>
                                    {formatUandr(reward.amount)} {reward.denom.replace(/^u/, "").toUpperCase()}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted-foreground">No rewards yet</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Last updated: {rewardsData.generatedAt ? new Date(rewardsData.generatedAt).toLocaleString() : <span className="italic">N/A</span>}
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">
                        Click &quot;Fetch Rewards&quot; to view your latest staking rewards.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
