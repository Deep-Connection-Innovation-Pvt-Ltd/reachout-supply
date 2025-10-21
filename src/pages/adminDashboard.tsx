import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'; // Assuming you have a tabs component
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'; // Assuming you have a table component
import {
    Select,
    SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from '../components/ui/select'; // Assuming you have a select component

interface Application {
    order_id: number;
    name: string;
    email: string;
    phone: string;
    university: string | null;
    graduationYear: number | null;
    postUniversity: string | null;
    postGraduationYear: number | null;
    mastersPursuing: string | null;
    areaOfExpertise: string | null;
    programType: string;
    paymentAmount: number;
    rci: 'Yes' | 'No';
    cvUpload: string | null;
    status: string;
    created_at: string;
    updated_at: string | null;
}

// Helper function to export data to CSV
const exportToCsv = (data: any[], filename: string) => {
    if (!data.length) return;
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(field => 
                `"${String(row[field] || '').replace(/"/g, '""')}"`
            ).join(',')
        )
    ].join('\n');
    
    // Create download link with BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [newApplications, setNewApplications] = useState<Application[]>([]);
    const [updatedApplications, setUpdatedApplications] = useState<Application[]>([]);
    
    // Filter and search states
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    // Available program types
    const programTypes = [
        { value: 'all', label: 'All Programs' },
        { value: 'Foundational Impact Program', label: 'Foundational Impact Program' },
        { value: 'Elite Mentorship Program', label: 'Elite Mentorship Program' }
    ];
    
    // Available status options
    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'new', label: 'New' },
        { value: 'interviewed', label: 'Interviewed' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'completed', label: 'Completed' }
    ];
    
    
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (isLoggedIn !== 'true') {
            navigate('/admin'); // Redirect to login if not logged in
        }
        fetchApplications();
    }, [navigate]);

    const fetchApplications = async () => {
        try {
            // Fetch new applications
            const newResponse = await fetch('http://localhost/reachoutprof/backend/fetch_applications.php?status=new', {
            // const newResponse = await fetch('/professional/backend/fetch_applications.php?status=new', {
                credentials: 'include' // Include cookies for session
            });
            
            if (!newResponse.ok) {
                throw new Error(`HTTP error! status: ${newResponse.status}`);
            }
            
            const newAppData = await newResponse.json();
            console.log('New applications data:', newAppData); // Debug log
            
            if (newAppData.success) {
                setNewApplications(Array.isArray(newAppData.applications) ? newAppData.applications : []);
            } else {
                console.error('Error fetching new applications:', newAppData.message);
                setNewApplications([]);
            }

            // Fetch updated applications
            const updatedResponse = await fetch('http://localhost/reachoutprof/backend/fetch_applications.php?status=updated', {
            // const updatedResponse = await fetch('/professional/backend/fetch_applications.php?status=updated', {
                credentials: 'include' // Include cookies for session
            });
            
            if (!updatedResponse.ok) {
                throw new Error(`HTTP error! status: ${updatedResponse.status}`);
            }
            
            const updatedAppData = await updatedResponse.json();
            console.log('Updated applications data:', updatedAppData); // Debug log
            
            if (updatedAppData.success) {
                setUpdatedApplications(Array.isArray(updatedAppData.applications) ? updatedAppData.applications : []);
            } else {
                console.error('Error fetching updated applications:', updatedAppData.message);
                setUpdatedApplications([]);
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        }
    };

    const handleStatusChange = async (order_id: number, newStatus: string) => {
        // Optimistically update the UI
        setNewApplications(prev => 
            prev.map(app => 
                app.order_id === order_id 
                    ? { ...app, status: newStatus, updated_at: new Date().toISOString() }
                    : app
            )
        );
        
        setUpdatedApplications(prev => 
            prev.map(app => 
                app.order_id === order_id 
                    ? { ...app, status: newStatus, updated_at: new Date().toISOString() }
                    : app
            )
        );

        try {
            const response = await fetch('http://localhost/reachoutprof/backend/update_application_status.php', {
                        // const response = await fetch('/professional/backend/update_application_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_id, status: newStatus }),
                credentials: 'include',
            });
            
            const result = await response.json();
            
            if (!result.success) {
                console.error('Error updating status:', result.message);
                // If there's an error, refetch to restore correct state
                fetchApplications();
            } else {
                // Refresh the data in the background to ensure consistency
                // but don't wait for it to complete
                fetchApplications().catch(console.error);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            // If there's an error, refetch to restore correct state
            fetchApplications().catch(console.error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn'); // Clear login flag
        navigate('/admin'); // Redirect to login page
    };

    // Calculate statistics
    const totalApplications = newApplications.length + updatedApplications.length;
    const foundationalCount = [...newApplications, ...updatedApplications]
        .filter(app => app.programType === 'Foundational Impact Program').length;
    const eliteCount = [...newApplications, ...updatedApplications]
        .filter(app => app.programType === 'Elite Mentorship Program').length;
    const totalAmountRaised = [...newApplications, ...updatedApplications]
        .reduce((sum, app) => sum + (app.paymentAmount || 0), 0);

    // Prepare data for export
    const prepareExportData = (applications: Application[]) => {
        return applications.map(app => ({
            'Order ID': app.order_id,
            'Name': app.name,
            'Email': app.email,
            'Phone': app.phone,
            'University': app.university || 'N/A',
            'Graduation Year': app.graduationYear || 'N/A',
            'Program Type': app.programType,
            'Status': app.status,
            'Payment Amount': app.paymentAmount || 0,
            'RCI': app.rci,
            'Applied On': new Date(app.created_at).toLocaleString(),
            'Last Updated': app.updated_at ? new Date(app.updated_at).toLocaleString() : 'N/A'
        }));
    };

    const renderFilterControls = () => (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Name or Email
                </label>
                <input
                    type="text"
                    id="search"
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-full md:w-64">
                <label htmlFor="program-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Program Type
                </label>
                <select
                    id="program-filter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                >
                    {programTypes.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="w-full md:w-64">
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                </label>
                <select
                    id="status-filter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-end">
                <Button 
                    variant="outline" 
                    onClick={() => {
                        setSearchTerm('');
                        setProgramFilter('all');
                        setStatusFilter('all');
                    }}
                    className="h-[42px]"
                >
                    Clear Filters
                </Button>
            </div>
        </div>
    );

    const renderApplicationsTable = (applications: Application[], isNew: boolean) => (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{isNew ? 'New' : 'Updated'} Applications ({applications.length})</h2>
                <Button 
                    onClick={() => exportToCsv(prepareExportData(applications), `${isNew ? 'new' : 'updated'}_applications`)}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={applications.length === 0}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export to CSV
                </Button>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>University</TableHead>
                            <TableHead>Graduation Year</TableHead>
                            <TableHead>Post University</TableHead>
                            <TableHead>Post Graduation Year</TableHead>
                            <TableHead>Masters Pursuing</TableHead>
                            <TableHead>Area of Expertise</TableHead>
                            <TableHead>Program Type</TableHead>
                            <TableHead>Payment Amount</TableHead>
                            <TableHead>RCI</TableHead>
                            <TableHead>CV Upload</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Updated At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.order_id}>
                                <TableCell>{app.order_id}</TableCell>
                                <TableCell>{app.name}</TableCell>
                                <TableCell>{app.email}</TableCell>
                                <TableCell>{app.phone}</TableCell>
                                <TableCell>{app.university}</TableCell>
                                <TableCell>{app.graduationYear}</TableCell>
                                <TableCell>{app.postUniversity}</TableCell>
                                <TableCell>{app.postGraduationYear}</TableCell>
                                <TableCell>{app.mastersPursuing}</TableCell>
                                <TableCell>{app.areaOfExpertise}</TableCell>
                                <TableCell>{app.programType}</TableCell>
                                <TableCell>{app.paymentAmount}</TableCell>
                                <TableCell>{app.rci}</TableCell>
                                <TableCell>
                                    {app.cvUpload ? (
                                        <a href={`/professional/backend/${app.cvUpload}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            View CV
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        onValueChange={(value) => handleStatusChange(app.order_id, value)}
                                        value={app.status}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="interviewed">Interviewed</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>{new Date(app.created_at).toLocaleString()}</TableCell>
                                <TableCell>{app.updated_at ? new Date(app.updated_at).toLocaleString() : 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    const filteredNewApplications = newApplications.filter(app => {
        const nameAndEmail = `${app.name} ${app.email}`.toLowerCase();
        return (
            nameAndEmail.includes(searchTerm.toLowerCase()) &&
            (programFilter === 'all' || app.programType === programFilter) &&
            (statusFilter === 'all' || app.status === statusFilter)
        );
    });

    const filteredUpdatedApplications = updatedApplications.filter(app => {
        const nameAndEmail = `${app.name} ${app.email}`.toLowerCase();
        return (
            nameAndEmail.includes(searchTerm.toLowerCase()) &&
            (programFilter === 'all' || app.programType === programFilter) &&
            (statusFilter === 'all' || app.status === statusFilter)
        );
    });

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <Button 
                        onClick={fetchApplications} 
                        variant="outline" 
                        className="flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </Button>
                    <Button onClick={handleLogout} variant="outline">
                        Logout
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {/* Total Applications */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Applications</p>
                            <p className="text-2xl font-bold">{totalApplications}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* New Applications */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">New Applications</p>
                            <p className="text-2xl font-bold">{newApplications.length}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Updated Applications */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Updated Applications</p>
                            <p className="text-2xl font-bold">{updatedApplications.length}</p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Foundational Applications */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Foundational Program</p>
                            <p className="text-2xl font-bold">{foundationalCount}</p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Elite Applications */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Elite Program</p>
                            <p className="text-2xl font-bold">{eliteCount}</p>
                        </div>
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Total Amount Raised */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Amount Raised</p>
                            <p className="text-2xl font-bold">₹{totalAmountRaised.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Render filter controls */}
            {renderFilterControls()}

            <Tabs defaultValue="newApplications" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="newApplications">New Applications</TabsTrigger>
                    <TabsTrigger value="updatedApplications">Updated Applications</TabsTrigger>
                </TabsList>
                <TabsContent value="newApplications">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">New Applications</h2>
                        {filteredNewApplications.length > 0 ? (
                            renderApplicationsTable(filteredNewApplications, true)
                        ) : (
                            <p>No new applications.</p>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="updatedApplications">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Updated Applications</h2>
                        {filteredUpdatedApplications.length > 0 ? (
                            renderApplicationsTable(filteredUpdatedApplications, false)
                        ) : (
                            <p>No updated applications.</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
