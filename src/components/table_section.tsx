// import { useEffect, useState } from "react"
import  Member from './portal_dashboard';
// import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TableSectionProps {
  members: Member[];
}

interface Member {
  id: string; // UUID-style string
  status: 'new' | 'pending' | 'approved' | 'refer'; // ENUM from DB
  name: string;
  memberId: string;
  state: string;
  applicationDocStatus: string | null; // optional or nullable
  calendarDate: string; // using string because dates from DB usually come as ISO strings
  memberType: 'member' | 'associate' | 'affiliate' | 'fellow'; // ENUM from DB
  created_at: string;
  updated_at: string;
  logintype: string;
  emails: string;
}

export default function TableSection({ members }: TableSectionProps) {
  // const [member, setMembers] = useState<Member[]>([])   

  // useEffect(() => {
  //   axios.get("http://localhost:5000/api/members")
  //     .then(res => setMembers(res.data))
  //     .catch(err => console.error("Failed to fetch members:", err))
  // }, [])

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-lg shadow">
      {/* Filter and Export Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by AIB Chapter:</span>
          <Select defaultValue="All">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {["All", "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"].map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Export List</Button>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Name / Member ID</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Application Docs</TableHead>
              <TableHead>Calendar</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.id}>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium">
                    {member.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div>{member.name}</div>
                  <div className="text-sm text-gray-500">{`ID: ${member.memberId}`}</div>
                </TableCell>
                <TableCell>{member.state}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`file-upload-${member.id}`} className="cursor-pointer ...">
                      Choose File
                    </label>
                    <input id={`file-upload-${member.id}`} type="file" className="sr-only" />
                    <span className="text-sm text-gray-500">Upload File</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Input type="date" className="w-[120px]" />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Add Comment</Button>
                </TableCell>
                <TableCell className="text-right flex flex-col md:flex-row items-end md:items-center justify-end space-y-2 md:space-y-0 md:space-x-2">
                  <Select>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select Member Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Corporate", "Associate", "Affiliate", "Fellow"].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button className="bg-green-500 hover:bg-green-600 text-white" size="sm">Approve</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm">Reject</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
