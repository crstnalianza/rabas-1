import React, { useState } from 'react';
import SuperAdminSidebar from './superadmincomponents/superadminsidebar';
import SearchBar from './superadmincomponents/SearchBar';
import { Bar } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Tooltip, ModalContent, useDisclosure } from '@nextui-org/react';
import { FaEye, FaTrashAlt } from 'react-icons/fa';

// Summary Card Component
const SummaryCard = ({ title, count, color }) => (
  <div className={`${color} text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}>
    <h2 className="text-lg mb-2 font-semibold">{title}</h2>
    <p className="text-4xl font-bold">{count}</p>
  </div>
);

// Table Component with Action Column
const Table = ({ title, headers, data, requestSort, handleSearch, onViewDetails, onForceDelete }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-left">{title}</h2>
      <SearchBar placeholder="Search by name..." onSearch={handleSearch} />
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-3 px-6 text-center cursor-pointer hover:bg-gray-300 transition"
                onClick={() => requestSort(index)}
              >
                {header}
              </th>
            ))}
            <th className="py-3 px-6 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 transition duration-300">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-3 px-6 text-center">{cell}</td>
              ))}
              <td className="py-3 px-6 flex justify-center space-x-2">
                <Tooltip content="View Details">
                  <button className="text-blue-500 px-4 py-2 rounded" onClick={() => onViewDetails(row)}>
                    <FaEye />
                  </button>
                </Tooltip>
                <Tooltip content="Force Delete">
                  <button className="text-red-500 px-4 py-2 rounded" onClick={() => onForceDelete(row)}>
                    <FaTrashAlt />
                  </button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Super Admin Reports Component
const SuperAdminReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedReport, setSelectedReport] = useState(null);
  const [deletedAccounts, setDeletedAccounts] = useState([]);

  // Summary Data
  const summaryData = [
    { title: 'Deactivated Accounts', count: 1, color: 'bg-red-400' },
    { title: 'Reported Tourist', count: 0, color: 'bg-teal-400' },
    { title: 'Reported Business Owner', count: 3, color: 'bg-purple-400' },
    { title: 'Total Reports', count: 3, color: 'bg-pink-400' },
  ];

  // Data for Pending Reports and Deactivated Accounts
  const pendingReportsHeaders = ['Name', 'Type of Users', 'No. Reports'];
  const pendingReportsData = [
    ['Lorem Ipsum', 'Business Owner', 10],
    ['Lorem Ipsum', 'Business Owner', 9],
    ['Lorem Ipsum', 'Business Owner', 8],
  ];

  const deactivatedAccountsHeaders = ['Name', 'Type of Users', 'Days Deactivated'];
  const deactivatedAccountsData = [
    ['Lorem Ipsum', 'Tourists', '0 days ago'],
  ];

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredData = (data) => data.filter((row) => row[0].toLowerCase().includes(searchTerm));

  // Graph Data for Summary
  const barData = {
    labels: ['Deactivated Accounts', 'Reported Tourists', 'Reported Business Owners', 'Total Reports'],
    datasets: [{
      label: '# of Reports',
      data: [1, 0, 3, 3],
      backgroundColor: ['#f87171', '#2dd4bf', '#a78bfa', '#f472b6']
    }]
  };

  const handleViewDetails = (report) => {
    setSelectedReport({
      id: report[0], // Assuming the first column is ID
      name: report[1], // Assuming the second column is Name
      status: report[2], // Assuming the third column is Status
      description: "Sample description for the report", // Add more details as needed
      reportType: "Sample Report Type" // Add report type details
    });
    onOpen();
  };

  const handleForceDelete = (report) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will permanently delete the account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0BDA51',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletedAccounts((prevDeletedAccounts) => [...prevDeletedAccounts, report]);

        Swal.fire({
          title: 'Deleted!',
          text: 'The account has been deleted.',
          icon: 'success',
          confirmButtonColor: '#0BDA51',
        });
        // Implement the deletion logic here
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SuperAdminSidebar />

      <div className="flex-1 p-8 max-h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>

        <div className="grid grid-cols-4 gap-6 mb-8 text-center">
          {summaryData.map((item, index) => (
            <SummaryCard key={index} title={item.title} count={item.count} color={item.color} />
          ))}
        </div>

        {/* Graphical Representation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Reports Summary</h2>
          <Bar data={barData} />
        </div>

        {/* Pending Reports Table */}
        <Table
          title="Pending Reports"
          headers={pendingReportsHeaders}
          data={sortedData(filteredData(pendingReportsData))}
          requestSort={requestSort}
          handleSearch={handleSearch}
          onViewDetails={handleViewDetails}
          onForceDelete={handleForceDelete}
        />

        {/* Deactivated Accounts Table */}
        <Table
          title="Deactivated Accounts"
          headers={deactivatedAccountsHeaders}
          data={sortedData(filteredData(deactivatedAccountsData))}
          requestSort={requestSort}
          handleSearch={handleSearch}
          onViewDetails={handleViewDetails}
          onForceDelete={handleForceDelete}
        />

        {/* Deleted Accounts Table */}
        <Table
          title="Deleted Accounts"
          headers={deactivatedAccountsHeaders}
          data={sortedData(filteredData(deletedAccounts))}
          requestSort={requestSort}
          handleSearch={handleSearch}
          onViewDetails={handleViewDetails}
          onForceDelete={() => {}} // No further deletion needed
        />

        {/* Modal for Viewing Details */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Report Details</ModalHeader>
                <ModalBody>
                  {selectedReport && (
                    <div className="space-y-4">
                      <p><strong>ID:</strong> {selectedReport.id}</p>
                      <p><strong>Name:</strong> {selectedReport.name}</p>
                      <p><strong>Status:</strong> {selectedReport.status}</p>
                      <p><strong>Description:</strong> {selectedReport.description}</p>
                      <p><strong>Report Type:</strong> {selectedReport.reportType}</p>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default SuperAdminReports;
