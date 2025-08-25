"use client";

import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Crown, Vote, Star, Trophy, Coins, Clock, CheckCircle } from "lucide-react"
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient"
import { queryContract } from "@/lib/andrjs/functions"
import { useState } from "react"

const loyaltyTiers = [
  { name: "Bronze", minPoints: 0, maxPoints: 999, color: "bg-amber-600", benefits: ["Basic rewards", "Standard APY"] },
  {
    name: "Silver",
    minPoints: 1000,
    maxPoints: 4999,
    color: "bg-gray-400",
    benefits: ["5% bonus rewards", "Priority support"],
  },
  {
    name: "Gold",
    minPoints: 5000,
    maxPoints: 14999,
    color: "bg-yellow-500",
    benefits: ["10% bonus rewards", "Early access", "VIP support"],
  },
  {
    name: "Platinum",
    minPoints: 15000,
    maxPoints: 49999,
    color: "bg-purple-500",
    benefits: ["15% bonus rewards", "Exclusive strategies", "Personal advisor"],
  },
  {
    name: "Diamond",
    minPoints: 50000,
    maxPoints: Number.POSITIVE_INFINITY,
    color: "bg-blue-500",
    benefits: ["20% bonus rewards", "Custom strategies", "Direct team access"],
  },
]

const currentPoints = 3250
const currentTier =
  loyaltyTiers.find((tier) => currentPoints >= tier.minPoints && currentPoints <= tier.maxPoints) || loyaltyTiers[0]
const nextTier = loyaltyTiers.find((tier) => tier.minPoints > currentPoints) || null
const progressToNextTier = nextTier
  ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
  : 100

const governanceProposals = [
  {
    id: 1,
    title: "Increase Stablecoin Farm APY",
    description: "Proposal to increase the base APY for stablecoin farming strategies from 8% to 10%",
    status: "Active",
    votingPower: "1,250 YIELD",
    reward: "25 YIELD",
    endsIn: "3 days",
  },
  {
    id: 2,
    title: "Add New Cross-Chain Strategy",
    description: "Introduce a new cross-chain arbitrage strategy for Polygon and Arbitrum",
    status: "Passed",
    votingPower: "1,250 YIELD",
    reward: "50 YIELD",
    endsIn: "Completed",
  },
]

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
    } catch (err: any) {
      setRewardsError(err?.message || "Failed to fetch rewards")
    } finally {
      setRewardsLoading(false)
    }
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
                Claim your earned rewards, track loyalty progress, and participate in governance.
              </p>
            </div>

            {/* Rewards Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{currentPoints.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{currentTier.name} tier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Governance Power</CardTitle>
                  <Vote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">1,250</div>
                  <p className="text-xs text-muted-foreground">YIELD tokens</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lifetime Earned</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">$2,847.92</div>
                  <p className="text-xs text-muted-foreground">All-time rewards</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="claimable" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="claimable">Claimable Rewards</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
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
                          View and claim your staking rewards. Click "Fetch Rewards" to update.
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
                        Click "Fetch Rewards" to view your latest staking rewards.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Loyalty Program Tab */}
              <TabsContent value="loyalty" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      Loyalty Tier Progress
                    </CardTitle>
                    <CardDescription>Earn points through platform activity to unlock better rewards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Tier Status */}
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${currentTier.color}`} />
                        <div>
                          <p className="font-semibold">{currentTier.name} Tier</p>
                          <p className="text-sm text-muted-foreground">{currentPoints.toLocaleString()} points</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Current
                      </Badge>
                    </div>

                    {/* Progress to Next Tier */}
                    {nextTier && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to {nextTier.name}</span>
                          <span>{Math.round(progressToNextTier)}%</span>
                        </div>
                        <Progress value={progressToNextTier} className="h-3" />
                        <p className="text-xs text-muted-foreground">
                          {nextTier.minPoints - currentPoints} points needed for {nextTier.name} tier
                        </p>
                      </div>
                    )}

                    {/* Tier Benefits */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Current Benefits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentTier.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Tiers Overview */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">All Tiers</h4>
                      {loyaltyTiers.map((tier, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            tier.name === currentTier.name ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${tier.color}`} />
                            <div>
                              <p className="font-medium">{tier.name}</p>
                              <p className="text-xs text-muted-foreground">{tier.minPoints.toLocaleString()}+ points</p>
                            </div>
                          </div>
                          {tier.name === currentTier.name && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              Current
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Governance Tab */}
              <TabsContent value="governance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Vote className="h-5 w-5" />
                      Governance Participation
                    </CardTitle>
                    <CardDescription>Vote on proposals and earn governance rewards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {governanceProposals.map((proposal) => (
                      <Card key={proposal.id} className="border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{proposal.title}</h4>
                                <Badge variant={proposal.status === "Active" ? "default" : "secondary"}>
                                  {proposal.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{proposal.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Voting Power: {proposal.votingPower}</span>
                                <span>Reward: {proposal.reward}</span>
                                <span>Ends: {proposal.endsIn}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              {proposal.status === "Active" ? (
                                <>
                                  <Button size="sm" variant="outline" className="bg-transparent">
                                    Vote Against
                                  </Button>
                                  <Button size="sm">Vote For</Button>
                                </>
                              ) : (
                                <Button size="sm" variant="outline" disabled>
                                  Completed
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
