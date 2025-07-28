import  Member from './portal_dashboard';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
import { useState, useEffect } from "react";
import { DateTimePickerWithValidation } from "@/components/ui/datetimepicker";

interface TableSectionProps {
  members: Member[];
  refetchMembers: () => void;
}

interface Member {
  id: string; // UUID-style string
  status: 'new' | 'pending' | 'approved' | 'rejected' | 'refer'; // ENUM from DB
  name: string;
  memberId: string;
  state: string;
  applicationDocStatus: string | null; // optional or nullable
  calendarDate: string; // using string because dates from DB usually come as ISO strings
  memberType: 'member' | 'associate' | 'affiliate' | 'fellow'; // ENUM from DB
  created_at: string;
  updated_at: string;
  comments: string;
}

export default function TableSection({ members, refetchMembers }: TableSectionProps) {

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!Array.isArray(members)) return;

    members.forEach(member => {
      fetch(`${API_URL}/api/documents/${member.memberId}`)
        .then(res => res.json())
        .then(data => {
          if (data?.filename) {
            setUploadedFiles(prev => ({
              ...prev,
              [member.memberId]: data.filename,
            }));
          }
        })
        .catch(err => console.error("Error loading filename:", err));
    });
  }, [members]);

  const [uploadedFiles, setUploadedFiles] = useState<{ [memberId: string]: string }>({});
  const [uploadingStatus, setUploadingStatus] = useState<{ [key: string]: 'idle' | 'uploading' | 'success' | 'error' }>({});
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [selectedState, setSelectedState] = useState("All");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const exportMembersToExcel = () => {
    const data = (isFiltering ? filteredMembers : members).map(member => ({
      Status: member.status,
      Name: member.name,
      MemberID: member.memberId,
      State: member.state,
      'Application Doc': uploadedFiles[member.memberId] || 'Not uploaded',
      'Calendar Date': member.calendarDate || '',
      'Member Type': member.memberType,
      'Created At': member.created_at,
      'Updated At': member.updated_at,
      Comments: member.comments || ''
    }));

    console.log("Data:", data);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, `Members_List_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleFileUpload = async (memberId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("memberId", memberId);

    setUploadingStatus(prev => ({ ...prev, [memberId]: 'uploading' }));
    console.log("Member ID:", memberId);

    try {
      const response = await fetch(`${API_URL}/api/documents/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file");
      const data = await response.json();
      console.log("File uploaded successfully:", data);
      // refetchMembers();
      selectedState === "All" ? refetchMembers() : filterByState(selectedState);

      setUploadedFiles(prev => ({
      ...prev,
      [memberId]: file.name,
      }));

      setUploadingStatus(prev => ({ ...prev, [memberId]: 'success' }));
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again later.");
    }
  };

  const handleFileDelete = async (memberId: string) => {
  try {
    const res = await fetch(`${API_URL}/api/documents/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ memberId }),
    });

    if (!res.ok) throw new Error("Failed to delete file");

    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[memberId];
      return updated;
    });

    // refetchMembers(); 
    selectedState === "All" ? refetchMembers() : filterByState(selectedState);
    alert("File deleted successfully.");
  } catch (err) {
    console.error("Error deleting file:", err);
    alert("Failed to delete file.");
  }
};

  const handleCommentUpload = async (memberId: string, comment: string) => {

    try {
      const response = await fetch(`${API_URL}/api/members/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberId, comment }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload comment.");
      }

      const data = await response.json();
      console.log("Comment uploaded:", data);

      // refetchMembers();
      selectedState === "All" ? refetchMembers() : filterByState(selectedState);

      // Reset state
      setActiveCommentId(null);
      setCommentText("");

      alert("Comment added successfully.");
    } catch (error) {
      console.error("Error uploading comment:", error);
      alert("Failed to add comment. Please try again later.");
    }
  }; 
  
  const handleMemberTypeChange = async (memberId: string, type: string) => {
    try {
      const res = await fetch(`${API_URL}/api/members/member-type`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberId, type }),
      });

      if (!res.ok) throw new Error("Failed to update member type");

      const data = await res.json();
      console.log("Member Type uploaded:", data);

      // refetchMembers();
      selectedState === "All" ? refetchMembers() : filterByState(selectedState);
    } catch (err) {
      console.error("Error updating member type:", err);
      alert("Failed to update member type.");
    }
  };  

  const handleStatusUpdate = async (memberId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`${API_URL}/api/members/status`, {
        method: "POST", // or PUT if you're using REST conventions
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ memberId, status }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      // refetchMembers();
      selectedState === "All" ? refetchMembers() : filterByState(selectedState);
      console.log("Updated status:", status);
      alert(`Status updated to ${status}.`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };  

  const handleStatusUpdaterefer = async (memberId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/members/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      
      // refetchMembers();
      selectedState === "All" ? refetchMembers() : filterByState(selectedState);
      console.log("Updated status:", status);
      alert(`Status updated to ${status}`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Could not update status. Please try again.");
    }
  };

  const filterByState = async (state: string) => {
    setSelectedState(state);

    if (state === "All") {
      setIsFiltering(false); // not filtering
      setFilteredMembers([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/members?state=${state}`);
      const data = await res.json();
      const safeMembers = Array.isArray(data.members) ? data.members : [];

      setFilteredMembers(safeMembers);
      setIsFiltering(true); // filtering now
    } catch (err) {
      console.error("Failed to filter members:", err);
      setFilteredMembers([]);
      setIsFiltering(true); // still in filter mode
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 rounded-lg shadow">
      {/* Filter and Export Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by AIB Chapter:</span>
          <Select
            value={selectedState}
            onValueChange={(state) => {
              setSelectedState(state);
              filterByState(state);
            }}
          >
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
        <Button 
        className="bg-blue-600 hover:bg-blue-700 text-white"
        onClick={exportMembersToExcel}>Export List</Button>
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
            {(isFiltering ? filteredMembers : members).length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No members found for the selected state.
                </TableCell>
              </TableRow>
            ) : (
              (isFiltering ? filteredMembers : members).map((member) => (
                <TableRow key={`${member.memberId}-${member.updated_at}`}>
                  {/* ... existing member cells ... */}
                <TableCell>
                <Select
                  value={member.status === "refer" ? "refer" : undefined}
                  onValueChange={(value) => handleStatusUpdaterefer(member.memberId, value)}
                >
                  <SelectTrigger className="w-[120px] text-xs font-medium rounded-full border">
                    <SelectValue placeholder={member.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refer">Refer</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
                <TableCell>
                  <div>{member.name}</div>
                  <div className="text-sm text-gray-500">{`ID: ${member.memberId}`}</div>
                </TableCell>
                <TableCell>{member.state}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`file-upload-${member.memberId}`} className="cursor-pointer text-blue-600 underline">
                      Upload Document
                    </label>
                    <input
                      id={`file-upload-${member.memberId}`}
                      type="file"
                      className="sr-only"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(member.memberId, file);
                      }}
                    />

                    {/* File name + X button */}
                    {uploadedFiles[member.memberId] && (
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <span>{uploadedFiles[member.memberId]}</span>
                        <button
                          className="text-red-500 hover:text-red-700 text-xs"
                          onClick={() => handleFileDelete(member.memberId)}
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Uploading Status */}
                    {uploadingStatus[member.memberId] === 'uploading' && (
                      <span className="text-sm text-yellow-500 animate-pulse">Uploading...</span>
                    )}
                    {uploadingStatus[member.memberId] === 'success' && (
                      <span className="text-sm text-green-600">✓</span>
                    )}
                    {uploadingStatus[member.memberId] === 'error' && (
                      <span className="text-sm text-red-500">Upload Failed</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DateTimePickerWithValidation memberId={member.memberId} />
                </TableCell>
                <TableCell>
                  {activeCommentId === member.memberId ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Type comment"
                        className="border p-1 rounded"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleCommentUpload(member.memberId, commentText)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-gray-700">
                        {member.comments ? member.comments : "No comment"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCommentText(member.comments || "");
                          setActiveCommentId(member.memberId);
                        }}
                      >
                        {member.comments ? "Edit" : "Add"} Comment
                      </Button>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right flex flex-col md:flex-row items-end md:items-center justify-end space-y-2 md:space-y-0 md:space-x-2">
                <Select value={member.memberType} onValueChange={(value) => handleMemberTypeChange(member.memberId, value)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select Member Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Member", "Associate", "Affiliate", "Fellow"].map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                    onClick={() => handleStatusUpdate(member.memberId, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    size="sm"
                    onClick={() => handleStatusUpdate(member.memberId, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
                </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

