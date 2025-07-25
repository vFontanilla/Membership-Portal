import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

export  default function Header() {
  return (
    <header className="bg-blue-800 text-white p-4 flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">Membership Onboarding Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:bg-blue-700">
            Administrator <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-blue-700">
            <LogIn className="mr-2 h-4 w-4" /> Log In
          </Button>
          <Button variant="ghost" className="text-white hover:bg-blue-700">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>
  )
}
