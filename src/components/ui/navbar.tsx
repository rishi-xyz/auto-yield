import { ConnectWallet } from "@/modules/wallet";

export function Navbar() {
  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}
