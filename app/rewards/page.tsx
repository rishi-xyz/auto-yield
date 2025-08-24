import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Crown, Vote, Star, Trophy, Coins, Clock, CheckCircle } from "lucide-react"

const claimableRewards = [
  {
    id: 1,
    token: "USDC",
    amount: "45.23",
    usdValue: "$45.23",
    source: "Stablecoin Farm",
    claimable: true,
    icon: "💵",
  },
  {
    id: 2,
    token: "ETH",
    amount: "0.0234",
    usdValue: "$52.18",
    source: "LP Vaults",
    claimable: true,
    icon: "⟠",
  },
  {
    id: 3,
    token: "AUTO",
    amount: "125.50",
    usdValue: "$37.65",
    source: "Platform Rewards",
    claimable: true,
    icon: "🔄",
  },
  {
    id: 4,
    token: "YIELD",
    amount: "89.12",
    usdValue: "$26.74",
    source: "Governance Participation",
    claimable: false,
    icon: "🌾",
  },
]

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

export default function RewardsPage() {
  const totalClaimableUSD = claimableRewards
    .filter((reward) => reward.claimable)
    .reduce((sum, reward) => sum + Number.parseFloat(reward.usdValue.replace("$", "")), 0)

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
                  <div className="text-2xl font-bold text-primary">${totalClaimableUSD.toFixed(2)}</div>
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
                          Available Rewards
                        </CardTitle>
                        <CardDescription>Your earned tokens ready for claiming</CardDescription>
                      </div>
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        Claim All (${totalClaimableUSD.toFixed(2)})
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {claimableRewards.map((reward) => (
                        <Card key={reward.id} className={`${reward.claimable ? "border-primary/20" : "opacity-60"}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">{reward.icon}</div>
                                <div>
                                  <p className="font-semibold text-lg">
                                    {reward.amount} {reward.token}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{reward.usdValue}</p>
                                  <p className="text-xs text-muted-foreground">From {reward.source}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {reward.claimable ? (
                                  <Button size="sm">Claim</Button>
                                ) : (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    Vesting
                                  </div>
                                )}
                                <Badge variant={reward.claimable ? "default" : "secondary"}>
                                  {reward.claimable ? "Ready" : "Locked"}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
