import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function AddMemberForm() {
  return (

    <Card className="w-full max-w-4xl mx-auto mb-8">
        <CardHeader>
            <CardTitle>Add New Member</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
            Name:
            </label>
            <Input
            id="name"
            placeholder="Full Name"
            />
        </div>
        <div className="space-y-2">
            <label htmlFor="member-id" className="text-sm font-medium leading-none">
            Member ID:
            </label>
            <Input
            id="member-id"
            placeholder="e.g. AB2025-007"
            />
        </div>
        <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium leading-none">
            State:
            </label>
            <Select>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="NSW">NSW</SelectItem>
                <SelectItem value="VIC">VIC</SelectItem>
                <SelectItem value="QLD">QLD</SelectItem>
                <SelectItem value="WA">WA</SelectItem>
                <SelectItem value="SA">SA</SelectItem>
                <SelectItem value="TAS">TAS</SelectItem>
                <SelectItem value="NT">NT</SelectItem>
                <SelectItem value="ACT">ACT</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div className="md:col-span-3 flex justify-end">
            <Button>Add Member</Button>
        </div>
        </CardContent>
    </Card>
  )
}