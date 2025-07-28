// portal_dashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/header';
import AddMemberForm from './addmemberform';
import TableSection from './table_section';

export default function PortalDashboard() {
  const [members, setMembers] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/members`);
      setMembers(res.data.members); // ✅ Only set the array, not the entire object
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  useEffect(() => {
    fetchMembers(); // Load on mount
  }, []);

  return (
    <>
      <Header />
      <main className="p-6 space-y-6">
        <AddMemberForm onMemberAdded={fetchMembers} />
        <TableSection members={members} refetchMembers={fetchMembers}/>
      </main>
    </>
  );
}
