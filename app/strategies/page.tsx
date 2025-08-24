import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Shield, Zap, Search, Filter } from "lucide-react"

const strategies = [
  {
    id: 1,
    name: "Euclid Protocol",
    description: "Cross-chain yield optimization with automated rebalancing across multiple DeFi protocols.",
    apy: "18.5%",
    risk: "High",
    tvl: "$2.4M",
    category: "Cross-chain",
    isActive: true,
  },
  {
    id: 2,
    name: "Stablecoin Farm",
    description: "Low-risk yield farming focused on USDC, USDT, and DAI with consistent returns.",
    apy: "8.2%",
    risk: "Low",
    tvl: "$12.8M",
    category: "Stablecoin",
    isActive: true,
  },
  {
    id: 3,
    name: "LP Vaults",
    description: "Automated liquidity provision across top DEXs with impermanent loss protection.",
    apy: "14.7%",
    risk: "Medium",
    tvl: "$5.6M",
    category: "Liquidity",
    isActive: true,
  },
  {
    id: 4,
    name: "ETH Staking Plus",
    description: "Enhanced ETH staking with additional yield from lending and DeFi strategies.",
    apy: "6.8%",
    risk: "Low",
    tvl: "$18.2M",
    category: "Staking",
    isActive: true,
  },
  {
    id: 5,
    name: "Arbitrage Optimizer",
    description: "High-frequency arbitrage opportunities across multiple chains and protocols.",
    apy: "22.1%",
    risk: "High",
    tvl: "$3.1M",
    category: "Arbitrage",
    isActive: true,
  },
  {
    id: 6,
    name: "Blue Chip Lending",
    description: "Conservative lending strategy focused on established protocols like Aave and Compound.",
    apy: "5.4%",
    risk: "Low",
    tvl: "$8.9M",
    category: "Lending",
    isActive: true,
  },
]

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
    case "Medium":
      return <TrendingUp className="h-4 w-4" />
    case "High":
      return <Zap className="h-4 w-4" />
    default:
      return <Shield className="h-4 w-4" />
  }
}

export default function StrategiesPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-foreground font-sans">Yield Strategies</h1>
              <p className="text-muted-foreground">
                Discover and invest in automated DeFi strategies to maximize your yields.
              </p>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search strategies..." className="pl-10" />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="stablecoin">Stablecoin</SelectItem>
                      <SelectItem value="liquidity">Liquidity</SelectItem>
                      <SelectItem value="staking">Staking</SelectItem>
                      <SelectItem value="lending">Lending</SelectItem>
                      <SelectItem value="arbitrage">Arbitrage</SelectItem>
                      <SelectItem value="cross-chain">Cross-chain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Strategies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{strategy.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {strategy.category}
                        </Badge>
                      </div>
                      <Badge className={`${getRiskColor(strategy.risk)} flex items-center gap-1`}>
                        {getRiskIcon(strategy.risk)}
                        {strategy.risk}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Strategy Metrics */}
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

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        Deposit
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Strategy Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance Overview</CardTitle>
                <CardDescription>Key metrics across all available strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">12.8%</p>
                    <p className="text-sm text-muted-foreground">Average APY</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-foreground">$51.0M</p>
                    <p className="text-sm text-muted-foreground">Total TVL</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-accent">6</p>
                    <p className="text-sm text-muted-foreground">Active Strategies</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">98.5%</p>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
