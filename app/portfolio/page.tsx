import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Wallet, PieChart, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const portfolioStrategies = [
  {
    id: 1,
    name: "Stablecoin Farm",
    deposited: "$5,000.00",
    currentBalance: "$5,410.50",
    apy: "8.2%",
    status: "Active",
    pnl: "+$410.50",
    pnlPercent: "+8.21%",
    isPositive: true,
    allocation: 45,
  },
  {
    id: 2,
    name: "LP Vaults",
    deposited: "$3,500.00",
    currentBalance: "$4,014.75",
    apy: "14.7%",
    status: "Active",
    pnl: "+$514.75",
    pnlPercent: "+14.71%",
    isPositive: true,
    allocation: 35,
  },
  {
    id: 3,
    name: "ETH Staking Plus",
    deposited: "$2,000.00",
    currentBalance: "$2,136.00",
    apy: "6.8%",
    status: "Active",
    pnl: "+$136.00",
    pnlPercent: "+6.80%",
    isPositive: true,
    allocation: 20,
  },
]

const totalDeposited = portfolioStrategies.reduce((sum, strategy) => {
  return sum + Number.parseFloat(strategy.deposited.replace(/[$,]/g, ""))
}, 0)

const totalCurrentBalance = portfolioStrategies.reduce((sum, strategy) => {
  return sum + Number.parseFloat(strategy.currentBalance.replace(/[$,]/g, ""))
}, 0)

const totalPnL = totalCurrentBalance - totalDeposited

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
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-foreground font-sans">Portfolio</h1>
              <p className="text-muted-foreground">Track your active DeFi strategies and performance.</p>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${totalDeposited.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Initial investment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">${totalCurrentBalance.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Current portfolio value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">+${totalPnL.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-accent">+{((totalPnL / totalDeposited) * 100).toFixed(2)}%</span> total return
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
                  <p className="text-xs text-muted-foreground">Diversified positions</p>
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
                {portfolioStrategies.map((strategy) => (
                  <div key={strategy.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{strategy.name}</span>
                      <span className="text-muted-foreground">{strategy.allocation}%</span>
                    </div>
                    <Progress value={strategy.allocation} className="h-2" />
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
                    <span className="font-semibold">LP Vaults (+14.71%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average APY</span>
                    <span className="font-semibold text-primary">9.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Portfolio Age</span>
                    <span className="font-semibold">45 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                      Medium
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
                    Add New Strategy
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <Wallet className="mr-2 h-4 w-4" />
                    Rebalance Portfolio
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
