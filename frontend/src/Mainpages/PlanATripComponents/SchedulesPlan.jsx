import React, { useState, useEffect } from 'react';
import { Accordion, AccordionItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Textarea } from "@nextui-org/react";
import { FaPlus, FaSearch, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import AddItemModal from './AddItemModal';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import MapFeature from '../../LeafletMap/MapFeature';

const SchedulesPlan = ({ startDate, endDate }) => {
    console.log('SchedulesPlan Dates:', startDate, endDate);

    const { isOpen: isLocationOpen, onOpen: onLocationOpen, onClose: onLocationClose } = useDisclosure();
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    
    // Utility function to generate dates between startDate and endDate
    const generateDateRange = (start, end) => {
        const dateArray = [];
        let currentDate = new Date(start);
        const endDate = new Date(end);

        while (currentDate <= endDate) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    };

    // Initialize itineraryItems with dates between startDate and endDate
    const [itineraryItems, setItineraryItems] = useState(() => {
        const dates = generateDateRange(startDate, endDate);
        const initialItems = {};
        dates.forEach(date => {
            const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            initialItems[formattedDate] = []; // Initialize with empty array or default items
        });
        return initialItems;
    });

    const [currentDate, setCurrentDate] = useState("Tuesday, Oct 15");
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSideUIVisible, setIsSideUIVisible] = useState(false);

    const [editItemIndex, setEditItemIndex] = useState(null);
    const [editItemDetails, setEditItemDetails] = useState({ title: '', time: '', isBooked: false, notes: '' });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [currentLocation, setCurrentLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [selectedLocations, setSelectedLocations] = useState({});

    const locations = [
        { name: 'Bulusan' },
        { name: 'Bulan' },
        { name: 'Barcelona' },
        { name: 'Casiguran' },
        { name: 'Castilla' },
        { name: 'Donsol' },
        { name: 'Gubat' },
        { name: 'Irosin' },
        { name: 'Juban' },
        { name: 'Magallanes' },
        { name: 'Matnog' },
        { name: 'Pilar' },
        { name: 'Prieto Diaz' },
        { name: 'Sta. Magdalena' },
        { name: 'Sorsogon City' },
    ];

    const addItemToItinerary = (date, item) => {
        setItineraryItems(prevItems => ({
            ...prevItems,
            [date]: [...prevItems[date], item]
        }));
    };

    const handleAdd = (date) => {
        onAddOpen();
        setCurrentDate(date);
        setSelectedItem(null);
    };

    const formatTime = (time) => {
        if (!time || time.trim() === '') return 'None';
        const [hour, minute] = time.split(':');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute || '00'} ${ampm}`;
    };

    const handleDelete = (date, index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this item?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0BDA51',
            cancelButtonColor: '#D33736',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setItineraryItems(prevItems => {
                    const updatedItems = { ...prevItems };
                    updatedItems[date].splice(index, 1);
                    return updatedItems;
                });
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your item has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#0BDA51'
                });
            }
        });
    };

    const handleEdit = (date, index) => {
        const item = itineraryItems[date][index];
        setEditItemIndex(index);
        setEditItemDetails(item);
    };

    const handleUpdate = (date) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to update this item?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0BDA51',
            cancelButtonColor: '#D33736',
            confirmButtonText: 'Yes, update it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setItineraryItems(prevItems => {
                    const updatedItems = { ...prevItems };
                    updatedItems[date][editItemIndex] = editItemDetails;
                    return updatedItems;
                });
                setEditItemIndex(null);
                Swal.fire({
                    title: 'Updated!',
                    text: 'Your item has been updated.',
                    icon: 'success',
                    confirmButtonColor: '#0BDA51'
                });
            }
        });
    };

    const handleCancelEdit = () => {
        setEditItemIndex(null);
    };

    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditItemDetails(prevDetails => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim()) {
            performSearch(value);
        } else {
            setSearchResults([]);
        }
    };

    const performSearch = (query) => {
        const results = locations.filter(location =>
            location.name.toLowerCase().startsWith(query.toLowerCase())
        );
        setSearchResults(results);
    };

    const clearSearchField = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleLocationClick = (locationName) => {
        setSelectedLocations(prevLocations => ({
            ...prevLocations,
            [currentDate]: locationName
        }));
        onLocationClose(); // Close the modal after selection
    };

    return (
        <div className='w-full p-4'>
            <Accordion selectionMode="multiple">
                {Object.keys(itineraryItems).map(date => (
                    <AccordionItem 
                      className='max-h-[700px] h-full overflow-auto scrollbar-custom'
                      key={date} 
                      title={date} 
                      subtitle={
                          <Button size='sm' onClick={() => { onLocationOpen(); setCurrentDate(date); }}>
                              {selectedLocations[date] || 'Select Location'}
                          </Button>
                      }
                    >
                        <div className='flex justify-end mb-4'>
                            <Button className='border-1 m-2 border-color1 rounded-full text-lg p-3 hover:bg-color2 bg-white hover:text-white duration-300 min-w-11' onClick={() => handleAdd(date)}>
                                <FaPlus/> Add
                            </Button>
                        </div>
                        <div className='mx-auto max-h-screen'>
                            {itineraryItems[date].map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start mb-6 bg-white p-4 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-2/3 mx-auto">
                                    <div className="flex-shrink-0 w-12 text-center">
                                        <div className="bg-color1 text-white rounded-full w-10 h-10 flex items-center justify-center mb-2">
                                            {index + 1}
                                        </div>
                                        <div className="h-full border-l-2 border-gray-300"></div>
                                    </div>
                                    <div className="ml-0 sm:ml-6 w-full">
                                        {editItemIndex === index ? (
                                            <div className="space-y-4">
                                                <input type="time" name="time" value={editItemDetails.time} onChange={handleEditInputChange} className="w-full p-2 border rounded-md" />
                                                <Checkbox
                                                    isSelected={editItemDetails.isBooked}
                                                    onChange={() => setEditItemDetails(prevDetails => ({ ...prevDetails, isBooked: !prevDetails.isBooked }))}
                                                    color="primary"
                                                >
                                                    Yes, I have booked this
                                                </Checkbox>
                                                <Textarea
                                                    name="notes"
                                                    value={editItemDetails.notes}
                                                    onChange={handleEditInputChange}
                                                    placeholder="Enter any notes here..."
                                                    fullWidth
                                                />
                                                <div className="flex space-x-2">
                                                    <Button size="sm" onClick={() => handleUpdate(date)} className="bg-green-500 text-white">Update</Button>
                                                    <Button size="sm" onClick={handleCancelEdit} className="bg-red-500 text-white">Cancel</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                                                    <h3 className="font-semibold text-xl">{item.title}</h3>
                                                    <span className="text-sm text-gray-500"> <span className='text-black font-medium'>Time of Visit:</span> {formatTime(item.time)}</span>
                                                </div>
                                                <img src={item.imageUrl || 'https://via.placeholder.com/300'} alt={item.title} className="w-full h-56 object-cover rounded-md mb-4" />                                    
                                                <p className="text-sm mb-2"><strong>Booked:</strong> {item.isBooked ? 'Yes' : 'No'}</p>
                                                <p className="text-sm mb-4"><strong>Notes:</strong> {item.notes}</p>
                                                <div className='w-full mb-2'>
                                                    <Link to='/business' target='_blank'>
                                                        <Button color='primary' className='w-full hover:bg-color2'>Explore</Button>
                                                    </Link>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button size="sm" color="danger" className="w-full" onClick={() => handleDelete(date, index)}>Delete</Button>
                                                    <Button size="sm" className="w-full" onClick={() => handleEdit(date, index)}>Edit</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>

            <Modal hideCloseButton isOpen={isLocationOpen} onClose={() => {}}>
                <ModalContent>
                    <ModalHeader>
                        <h2 className="text-xl font-semibold">Set Location</h2>
                    </ModalHeader>
                    <ModalBody>
                        <div className="mb-4 relative">
                            <div className="flex items-center w-full mb-2">
                                <FaSearch className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search for locations"
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    className="flex-grow p-2 border-b border-gray-300 focus:outline-none"
                                />
                                {searchQuery && (
                                    <FaTimes
                                        onClick={clearSearchField}
                                        className="text-gray-500 cursor-pointer ml-2"
                                    />
                                )}
                            </div>
                            <div className="absolute w-full max-h-[200px] z-50 overflow-y-auto scrollbar-custom bg-white shadow-lg rounded-lg">
                                {searchResults.map((result, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleLocationClick(result.name)}
                                    >
                                        <FaMapMarkerAlt className="w-8 h-8 text-gray-500 mr-3" />
                                        <div>
                                            <h3 className="text-md font-semibold">{result.name}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 relative z-10">
                            <MapFeature
                                currentLocation={currentLocation}
                                destination={destination}
                                setCurrentLocation={setCurrentLocation}
                                setDestination={setDestination}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onLocationClose} className="bg-red-500 text-white">Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AddItemModal 
                isOpen={isAddOpen || isSideUIVisible} 
                onClose={() => { onAddClose(); setIsSideUIVisible(false); }} 
                onAddItem={(item) => {
                    addItemToItinerary(currentDate, item);
                    setIsSideUIVisible(false);
                }} 
                selectedItem={selectedItem}
            />
        </div>
    );
}

export default SchedulesPlan;