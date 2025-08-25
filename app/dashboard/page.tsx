"use client"

import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { YieldChart } from "@/components/ui/yield-chart"
import { TrendingUp, Wallet, DollarSign, Target, Gift, ArrowUpRight } from "lucide-react"
import { useAndromedaStore } from "@/zustand/andromeda"
import useGetAllBalances from "@/lib/andrjs/hooks/useGetAllBalances"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { accounts, isConnected, client } = useAndromedaStore();
  const connectedAddress = accounts[0]?.address;
  const { balances, totalValue, isLoading: balancesLoading } = useGetAllBalances(connectedAddress);
  const router = useRouter();
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-foreground font-sans">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your staking portfolio overview.</p>
              
              {/* Connection Status Alert */}
              {!isConnected && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-yellow-700 dark:text-yellow-400 font-medium">
                      Wallet Not Connected
                    </p>
                  </div>
                  <p className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
                    Please connect your wallet to view your token balances and portfolio information.
                  </p>
                </div>
              )}
              
              {isConnected && !client && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-blue-700 dark:text-blue-400 font-medium">
                      Connecting to Chain
                    </p>
                  </div>
                  <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
                    Establishing connection to the blockchain. This may take a few moments.
                  </p>
                </div>
              )}
            </div>

            {/* Wallet Info Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Connected Wallet
                </CardTitle>
                <CardDescription>Your current wallet information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-mono text-lg">{connectedAddress || 'Not connected'}</p>
                    </div>
                    {isConnected ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary" size={"lg"}>
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-primary/10 text-primary" size={"lg"}>
                        Not Connected
                      </Badge>
                    )}
                  </div>
                  
                  {connectedAddress && (
                    <div className="pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Connection Status</p>
                          <p className="font-medium">{isConnected ? 'Active' : 'Inactive'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Balances Loading</p>
                          <p className="font-medium">{balancesLoading ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Token Types Found</p>
                          <p className="font-medium">{balances.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Value</p>
                          <p className="font-medium">{totalValue}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/portfolio')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {balancesLoading ? (
                      <span className="text-muted-foreground">Loading...</span>
                    ) : balances.length > 0 ? (
                      `${totalValue} tokens`
                    ) : (
                      <span className="text-muted-foreground">0 tokens</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {balances.length > 0 ? `${balances.length} token types` : 'No tokens found'}
                  </p>
                  {balances.length === 0 && !balancesLoading && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {!isConnected ? 'Connect wallet to view balances' : 'No token balances found'}
                    </p>
                  )}
                  <p className="text-xs text-primary mt-2">Click to view portfolio →</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/rewards')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Yield Earned</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {isConnected ? '0 ANDR' : 'Connect Wallet'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isConnected ? (
                      <span className="text-accent">+6.8%</span>
                    ) : (
                      'View rewards'
                    )} APY from staking
                  </p>
                  {isConnected && <p className="text-xs text-accent mt-2">Click to claim rewards →</p>}
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/strategies')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {isConnected ? '1' : '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isConnected ? 'ANDR Staking Plus' : 'No strategies active'}
                  </p>
                  {isConnected && <p className="text-xs text-primary mt-2">Click to manage strategies →</p>}
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/strategies')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average APY</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {isConnected ? '6.8%' : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isConnected ? 'ANDR Staking Plus' : 'No strategies active'}
                  </p>
                  {isConnected && <p className="text-xs text-primary mt-2">Click to optimize APY →</p>}
                </CardContent>
              </Card>
            </div>

            {/* Token Balances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Token Balances
                </CardTitle>
                <CardDescription>Your current token holdings</CardDescription>
              </CardHeader>
              <CardContent>
                {balancesLoading ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">Loading balances...</div>
                  </div>
                ) : balances.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {balances.map((balance, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {balance.type === 'cw20' ? 'CW20 Token' : balance.denom}
                          </p>
                          <p className="text-lg font-semibold">
                            {parseFloat(balance.amount).toLocaleString()} {balance.denom}
                          </p>
                          {balance.contractAddress && (
                            <p className="text-xs text-muted-foreground">
                              Contract: {balance.contractAddress.slice(0, 8)}...{balance.contractAddress.slice(-6)}
                            </p>
                          )}
                        </div>
                        <Badge variant={balance.type === 'cw20' ? 'secondary' : 'default'}>
                          {balance.type.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">No token balances found</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Make sure you're connected to the right network and have tokens
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Yield Growth Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Yield Growth Over Time</CardTitle>
                  <CardDescription>Your staking rewards accumulation over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <YieldChart />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your DeFi portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => router.push('/strategies')}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Explore Strategies
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent" 
                    size="lg"
                    onClick={() => router.push('/rewards')}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Claim Rewards
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent" 
                    size="lg"
                    onClick={() => router.push('/portfolio')}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    View Portfolio
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Claimable Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Claimable Rewards
                </CardTitle>
                <CardDescription>Your pending staking rewards</CardDescription>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Connect your wallet to view claimable rewards</p>
                    <Button onClick={() => router.push('/rewards')}>
                      View All Rewards
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">ANDR Staking Rewards</p>
                          <p className="text-lg font-semibold">0 ANDR</p>
                          <p className="text-xs text-muted-foreground">Click Fetch Rewards to update</p>
                        </div>
                        <Button size="sm" onClick={() => router.push('/rewards')}>Fetch & Claim</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Staked</p>
                          <p className="text-lg font-semibold">1000 ANDR</p>
                          <p className="text-xs text-muted-foreground">Active staking position</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => router.push('/portfolio')}>
                          View Portfolio
                        </Button>
                      </div>
                    </div>
                    <div className="text-center pt-4">
                      <Button variant="outline" onClick={() => router.push('/rewards')}>
                        View All Available Rewards
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Diversification */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/portfolio')}>
              <CardHeader>
                <CardTitle>Portfolio Diversification</CardTitle>
                <CardDescription>How your assets are distributed across strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <div className="text-center py-6">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Connect your wallet to view portfolio allocation</p>
                    <Button onClick={() => router.push('/portfolio')}>
                      View Portfolio
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ANDR Staking Plus</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                      <p className="text-xs text-muted-foreground">6.8% APY • Active strategy</p>
                    </div>
                    <div className="pt-4 text-center">
                      <p className="text-xs text-primary">Click to view detailed portfolio analysis →</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
