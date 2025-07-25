import Header from '../components/header';
import AddMemberForm from './addmemberform';
import TableSection from './table_section';




export default function PortalDashboard() {

    return (
        <>
            <Header />
            <main className='p-6 space-y-6'>
                <AddMemberForm />
                <TableSection />
            </main>
            
        </>
  )
}