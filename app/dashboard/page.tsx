import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { YieldChart } from "@/components/ui/yield-chart"
import { TrendingUp, Wallet, DollarSign, Target, Gift, ArrowUpRight } from "lucide-react"

export default function DashboardPage() {
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
              <p className="text-muted-foreground">Welcome back! Here's your DeFi portfolio overview.</p>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-mono text-lg">0x1234...5678</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Connected
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">$12,345.67</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary">+2.5%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Yield Earned</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">$1,234.56</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">+12.3%</span> this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <p className="text-xs text-muted-foreground">2 high yield, 1 stable</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average APY</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">12.5%</div>
                  <p className="text-xs text-muted-foreground">Across all strategies</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Yield Growth Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Yield Growth Over Time</CardTitle>
                  <CardDescription>Your portfolio performance in the last 30 days</CardDescription>
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
                  <Button className="w-full" size="lg">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Explore Strategies
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <Gift className="mr-2 h-4 w-4" />
                    Claim Rewards
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
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
                <CardDescription>Your pending rewards from active strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">USDC Rewards</p>
                      <p className="text-lg font-semibold">$45.23</p>
                    </div>
                    <Button size="sm">Claim</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">ETH Rewards</p>
                      <p className="text-lg font-semibold">0.0234 ETH</p>
                    </div>
                    <Button size="sm">Claim</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Loyalty Points</p>
                      <p className="text-lg font-semibold">1,250 pts</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Diversification */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Diversification</CardTitle>
                <CardDescription>How your assets are distributed across strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Stablecoin Farming</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>LP Vaults</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lending Protocols</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
