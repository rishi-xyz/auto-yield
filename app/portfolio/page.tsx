"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Wallet, PieChart, ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import useAndromedaClient from "@/lib/andrjs/hooks/useAndromedaClient"
import { queryContract } from "@/lib/andrjs/functions"
import { useStakingStore } from "@/zustand/staking"

// Helper to format uandr to ANDR (assuming 6 decimals)
function formatUandr(amount: string) {
  const num = Number(amount) / 1_000_000
  return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

// Coming soon strategies (not yet available for investment)
const comingSoonStrategies = [
  {
    id: 2,
    name: "Euclid Staking",
    description: "Stay tuned for new yield strategies launching soon.",
    apy: "TBD",
    risk: "TBD",
    tvl: "TBD",
    category: "Coming Soon",
    isActive: false,
  }
]

function getStatusColor(status: string) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Paused":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export default function PortfolioPage() {
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [portfolioError, setPortfolioError] = useState<string | null>(null)
  const [portfolioData, setPortfolioData] = useState<any | null>(null)
  const client = useAndromedaClient()
  const { stakedAmount, stakedDenom, setStakedAmount } = useStakingStore()

  const fetchPortfolioData = async () => {
    setPortfolioLoading(true)
    setPortfolioError(null)
    setPortfolioData(null)
    try {
      if (!client) {
        setPortfolioError("Wallet not connected. Please connect your wallet.")
        setPortfolioLoading(false)
        return
      }
      const msg = {
        staked_tokens: {},
      }
      const response = await queryContract(
        client,
        "andr1lm9e8ljtk0apejjr0ejzwdzykkmenx4w2fphsyg5zzhpq05jlqxq9yljd2",
        msg
      )
      setPortfolioData({ result: response, generatedAt: Date.now() })
      
      // Store staked amount in global state
      if (response?.amount?.amount && response?.amount?.denom) {
        const formattedAmount = formatUandr(response.amount.amount)
        const formattedDenom = response.amount.denom.replace(/^u/, "").toUpperCase()
        setStakedAmount(formattedAmount, formattedDenom)
      }
    } catch (err: any) {
      setPortfolioError(err?.message || "Failed to fetch portfolio data")
    } finally {
      setPortfolioLoading(false)
    }
  }

  // Auto-fetch data when component mounts if wallet is connected
  useEffect(() => {
    if (client && !stakedAmount) {
      fetchPortfolioData()
    }
  }, [client])

  // Calculate portfolio metrics from real data
  const totalDeposited = stakedAmount ? parseFloat(stakedAmount) : 0
  const totalCurrentBalance = stakedAmount ? parseFloat(stakedAmount) : 0
  const totalPnL = 0 // For now, P&L is 0 since we're just showing staked amount

  // Create portfolio strategies array from real data
  const portfolioStrategies = stakedAmount && stakedDenom ? [
    {
      id: 1,
      name: "ANDR Staking Plus",
      deposited: `${stakedAmount} ${stakedDenom}`,
      currentBalance: `${stakedAmount} ${stakedDenom}`,
      apy: "6.8%",
      status: "Active",
      pnl: "+0 ANDR",
      pnlPercent: "+0.00%",
      isPositive: true,
      allocation: 100,
    },
  ] : []

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground font-sans">Portfolio</h1>
                  <p className="text-muted-foreground">Track your active DeFi strategies and performance.</p>
                </div>
                <Button
                  onClick={fetchPortfolioData}
                  disabled={portfolioLoading}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${portfolioLoading ? 'animate-spin' : ''}`} />
                  {portfolioLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
              {portfolioError && (
                <div className="text-red-600 text-sm bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  {portfolioError}
                </div>
              )}
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stakedAmount ? `${stakedAmount} ${stakedDenom}` : '0 ANDR'}
                  </div>
                  <p className="text-xs text-muted-foreground">Total staked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {stakedAmount ? `${stakedAmount} ${stakedDenom}` : '0 ANDR'}
                  </div>
                  <p className="text-xs text-muted-foreground">Current staked balance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">+0 ANDR</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">+0.00%</span> total return
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{portfolioStrategies.length}</div>
                  <p className="text-xs text-muted-foreground">Active strategies</p>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Diversification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Portfolio Diversification
                </CardTitle>
                <CardDescription>How your investments are allocated across strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioStrategies.length > 0 ? (
                  portfolioStrategies.map((strategy) => (
                    <div key={strategy.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{strategy.name}</span>
                        <span className="text-muted-foreground">{strategy.allocation}%</span>
                      </div>
                      <Progress value={strategy.allocation} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active strategies found</p>
                    <p className="text-sm">Connect your wallet and stake tokens to see your portfolio</p>
                  </div>
                )}
                {/* Show coming soon strategies as disabled */}
                {comingSoonStrategies.map((strategy) => (
                  <div key={strategy.id} className="space-y-2 opacity-60">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">{strategy.name}</span>
                      <span className="text-muted-foreground">Coming Soon</span>
                    </div>
                    <Progress value={0} className="h-2 bg-muted" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Strategies Table */}
            <Card>
              <CardHeader>
                <CardTitle>Active Strategies</CardTitle>
                <CardDescription>Your current DeFi strategy positions and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {portfolioStrategies.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Strategy</TableHead>
                        <TableHead>Deposited</TableHead>
                        <TableHead>Current Balance</TableHead>
                        <TableHead>APY</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioStrategies.map((strategy) => (
                        <TableRow key={strategy.id}>
                          <TableCell className="font-medium">{strategy.name}</TableCell>
                          <TableCell>{strategy.deposited}</TableCell>
                          <TableCell className="font-semibold">{strategy.currentBalance}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-primary border-primary/20">
                              {strategy.apy}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {strategy.isPositive ? (
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                              )}
                              <span className={`font-medium ${strategy.isPositive ? "text-green-600" : "text-red-600"}`}>
                                {strategy.pnl}
                              </span>
                              <span className={`text-xs ${strategy.isPositive ? "text-green-600" : "text-red-600"}`}>
                                ({strategy.pnlPercent})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(strategy.status)}>{strategy.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Add Funds</DropdownMenuItem>
                                <DropdownMenuItem>Withdraw</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Exit Strategy</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Active Strategies</h3>
                    <p className="mb-4">You do not have any active staking strategies yet.</p>
                    <Button onClick={() => window.location.href = '/strategies'}>
                      Start Staking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coming Soon Strategies */}
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>New strategies that will be available soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comingSoonStrategies.map((strategy) => (
                    <div key={strategy.id} className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-muted-foreground">{strategy.name}</h4>
                        <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                          Coming Soon
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="flex-1">
                          Notify Me
                        </Button>
                        <Button variant="outline" size="sm" disabled className="flex-1">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for your portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Best Performing Strategy</span>
                    <span className="font-semibold">
                      {portfolioStrategies.length > 0 ? 'ANDR Staking Plus (+0.00%)' : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average APY</span>
                    <span className="font-semibold text-primary">
                      {portfolioStrategies.length > 0 ? '6.8%' : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Portfolio Age</span>
                    <span className="font-semibold">
                      {portfolioData?.generatedAt ? 
                        `${Math.floor((Date.now() - portfolioData.generatedAt) / (1000 * 60 * 60 * 24))} days` : 
                        'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Low
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your portfolio efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" size="lg">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Add to Staking
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <Wallet className="mr-2 h-4 w-4" />
                    Withdraw Funds
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
