import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"



export default function TableSection() {



    return (
        <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter by AIB Chapter:</span>
              <Select defaultValue="All">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
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
                  <TableRow>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium `}
                      >
                        Completed
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>Test</div>
                      <div className="text-sm text-gray-500">{`ID: 1234455565`}</div>
                    </TableCell>
                    <TableCell>NSW</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={`file-upload-1234455565`}
                          className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        >
                          Choose File
                        </label>
                        <input
                          id={`file-upload-1234455565`}
                          type="file"
                          className="sr-only"
                        />
                        <span className="text-sm text-gray-500">Inserted</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        className="w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Add Comment
                      </Button>
                    </TableCell>
                    <TableCell className="text-right space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row items-end md:items-center justify-end">
                      <Select
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Select Member Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="Associate">Associate</SelectItem>
                          <SelectItem value="Affiliate">Affiliate</SelectItem>
                          <SelectItem value="Fellow">Fellow</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          size="sm"
                        >
                          Approve
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          size="sm"
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
    )
}