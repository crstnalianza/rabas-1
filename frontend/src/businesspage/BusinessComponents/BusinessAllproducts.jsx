import React, { useState, useEffect, useCallback } from 'react';
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Select,
  SelectItem,
  Slider,
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import { MdRateReview } from 'react-icons/md';
import { AiFillStar } from 'react-icons/ai';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import AccommodationBookingForm from './bookingFormModal/AccommodationBookingForm';
import TableReservationForm from './bookingFormModal/TableReservationForm';
import AttractionActivitiesBookingForm from './bookingFormModal/AttractionActivitiesBookingForm';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Swal from 'sweetalert2';

// SweetAlert functions
const showSuccessAlert = (message) => {
  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#0BDA51', // Green color for confirmation
    cancelButtonColor: '#D33736',  // Red color for cancellation
  });
};

const showErrorAlert = (message) => {
  Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonText: 'Try Again',
    confirmButtonColor: '#0BDA51', // Green color for confirmation
    cancelButtonText: 'Close',
    cancelButtonColor: '#D33736',  // Red color for cancellation
  });
};

// Review Modal Component
const ReviewModal = ({ isOpen, onClose, product, isLoggedIn }) => {
  // console.log('isloggin', isLoggedIn);
  const [userData, setUserData] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-userData', {
        method: 'GET',
        credentials: 'include' // Include cookies
      });
      const data = await response.json();
      setUserData(data.userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchReviewsAndRatings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getAllReviewsAndRatings`);
        
        if (response.data.success) {
          const reviews = response.data.reviewsAndRatings.filter(review => review.product_id === parseInt(product.product_id));
          console.log('Filtered Reviews:', reviews);
          setReviews(reviews);
        } else {
          console.error('Failed to fetch reviews and ratings:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching reviews and ratings:', error);
      }
    };

    if (isOpen) {
      fetchReviewsAndRatings();
    }
  }, [isOpen, product.product_id]);

  const handleReviewSubmit = async () => {
    if (newReview && newRating > 0) {
      try {
        const response = await fetch(`http://localhost:5000/addReviewsAndRatings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userData.user_id,
            product_id: product.product_id,
            rating: newRating,
            comment: newReview
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Add the new review to the existing list of reviews
          setReviews([...reviews, {
            username: userData.username, // Or fetch the username from session if available
            ratings: newRating,
            comment: newReview
          }]);
          clearReview();
        } else {
          showErrorAlert('Failed to submit review:', data.message);
          console.error('Failed to submit review:', data.message);
        }
      } catch (error) {
        showErrorAlert('Error submitting review:', error);
        console.error('Error submitting review:', error);
      }
    }
  };

  const clearReview = () => {
    setNewReview('');
    setNewRating(0);
  };

  const handleClose = () => {
    clearReview();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-full md:max-w-2xl">
      <ModalContent className="p-4">
        <ModalHeader>
          <h2 className="text-xl font-semibold">Write a Review for {product.title}</h2>
        </ModalHeader>
        <ModalBody className="py-4">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-bold mb-2">Your Rating</h3>
              <div className="flex gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((num) => (
                  <AiFillStar
                    key={num}
                    className={num <= newRating ? 'text-yellow-500' : 'text-gray-300'}
                    onClick={() => setNewRating(num)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">Your Review</h3>
              <Textarea
                placeholder="Write your review here..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-bold mb-2">Reviews</h3>
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="font-bold">{review.username}</div>
                      <div className="flex ml-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <AiFillStar
                            key={num}
                            className={num <= review.ratings ? 'text-yellow-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={review.comment ? "text-gray-700 p-2 border-t border-gray-300 mt-2" : "text-gray-400 italic p-2 border-t border-gray-300 bg-gray-100 mt-2"}>
                      {review.comment ? review.comment : 'No comment'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-600">No reviews available</div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end">
          <Button 
            onClick={() => {
              if (isLoggedIn) {
                handleReviewSubmit();
              } else {
                showErrorAlert('Please log in to submit a review.');
              }
            }} 
            color="primary" 
            disabled={!newReview || newRating === 0}
          >
            Submit Review
          </Button>
          <Button color="danger" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Product Card Component
const ProductCard = ({ product, openBookingModal, onOpen, isLoggedIn }) => {
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  const openReviewModal = () => setReviewModalOpen(true);
  const closeReviewModal = () => setReviewModalOpen(false);

  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

  // Create a separate handler for the View Images button
  const handleViewImages = (e) => {
    e.preventDefault(); // Prevent default button behavior
    onOpen(product); // Pass the product object directly
  };

  return (
    <Card variant="shadow" className="border-0 rounded-lg mb-4 overflow-hidden">
      <CardBody className="flex flex-col">
        <div className="relative w-full h-[250px] md:h-[300px]">
          {product.images.length > 0 ?(
            <img
              src={
                product.images.length > 0 && product.images[0].path
                  ? `http://localhost:5000/${product.images[0].path}`
                  : product.fileUrl || ''
              }
              alt={product.images.length > 0 ? product.images[0].title : product.name}
              className="object-cover w-full h-full rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-t-lg bg-gray-100 text-gray-500">
              No images available
            </div>
          )}
          
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}
          <Button 
            size="sm" 
            className="absolute bottom-2 right-2 text-white bg-color1" 
            onClick={handleViewImages} // Use the new handler
          >
            View Images
          </Button>
        </div>
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="font-bold text-lg mb-1">{product.name}</div>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-black font-semibold">{product.rating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <AiFillStar
                    key={star}
                    className={star <= product.rating ? 'text-yellow-500' : 'text-gray-300'}
                  />
                ))}
              </div>
              <Tooltip content="Write a Review">
                <Button size="sm" className="bg-transparent" onClick={openReviewModal}>
                  <MdRateReview className="text-lg cursor-pointer" />
                </Button>
              </Tooltip>
            </div>
            <div className="text-gray-700 mb-4">{product.description}</div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <div className="text-lg font-semibold">
              {product.discount > 0 ? (
                <>
                  <span className="line-through text-gray-500">₱{product.price}</span>
                  <span className="text-red-500 ml-2">₱{discountedPrice}</span>
                  {product.expiration && (
                    <p className="text-xs text-red-500 mt-1">
                      Discount expires on:{" "}
                      {new Date(product.expiration).toLocaleString("en-US", {
                        weekday: "long",  // optional: includes the weekday (e.g., 'Monday')
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,  // to get AM/PM format
                      })}
                    </p>
                  )}
                </>
              ) : (
                `₱${product.price}`
              )}
              
              <div className="flex mt-4 gap-2">
                <Button color="primary">Inquire</Button>
                {product.product_category !== 'shop' && (
                  <Button
                    color="success"
                    className="text-white"
                    onClick={() => {
                      if (isLoggedIn) {
                        openBookingModal(product);
                      } else {
                        showErrorAlert('Please log in to book this product.');
                      }
                    }}
                  >
                    {product.product_category === 'restaurant' ? 'Reserve Table' : 
                     product.product_category === 'activity' ? 'Book Activity' : 
                     product.product_category === 'accommodation' ? 'Book Stay' : 
                     'Book'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <ReviewModal isOpen={isReviewModalOpen} onClose={closeReviewModal} product={product} isLoggedIn={isLoggedIn} />
    </Card>
  );
};

// Filter Component
const Filters = ({ activeTab, setSelectedType, setRatingFilter, budgetRange, setBudgetRange, ratingFilter }) => {
  const handleRatingClick = (rating) => {
    if (rating === 'All') {
      setRatingFilter([]); // Clear all ratings
    } else {
      setRatingFilter((prev) =>
        prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
      );
    }
  };

  let filterOptions = [];

  switch (activeTab) {
    case 'activities':
      filterOptions = ['All', 'Hiking', 'Water Sports', 'Sightseeing'];
      break;
    case 'accommodations':
      filterOptions = ['All', 'Cabins', 'Hotel Rooms', 'Resorts'];
      break;
    case 'restaurant':
      filterOptions = ['All', 'Local Cuisine', 'Buffet', 'Fine Dining'];
      break;
    case 'shop':
      filterOptions = ['All', 'Souvenirs', 'Local Crafts', 'Clothing'];
      break;
    case 'all':
    default:
      filterOptions = ['All', 'Hiking', 'Water Sports', 'Sightseeing', 'Cabins', 'Resorts', 'Local Cuisine', 'Fine Dining', 'Souvenirs', 'Local Crafts'];
      break;
  }

  return (
    <>
      <div className="font-bold text-lg text-gray-700 mb-4">Filter by Type</div>
      <Select
        placeholder="Select Type"
        onChange={(e) => setSelectedType(e.target.value)}
        defaultValue="All"
        className="mb-4"
      >
        {filterOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </Select>

      {/* Ratings Filter */}
      <div className="font-bold text-lg text-gray-700 mb-4">Ratings</div>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            label="Ratings"
            onChange={() => handleRatingClick('All')}
            checked={ratingFilter.length === 0}
            className="form-checkbox text-color2"
          />
          <span className="ml-2 text-sm">All Ratings</span>
        </label>
        {[5, 4, 3, 2, 1].map((star) => (
          <label key={star} className="flex items-center">
            <input
              type="checkbox"
              label="start"
              onChange={() => handleRatingClick(star)}
              checked={ratingFilter.includes(star)}
              className="form-checkbox text-color2"
            />
            <span className="ml-2 text-sm flex items-center">
              {'★'.repeat(star)}{'☆'.repeat(5 - star)}
              <span className="ml-1">{star} Star{star > 1 ? 's' : ''}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="font-bold text-lg text-gray-700 mb-4">Filter by Budget</div>
      <Slider
        label="Price Range"
        step={100}
        minValue={0}
        maxValue={10000}
        value={budgetRange}
        onChange={setBudgetRange}
        formatOptions={{ style: 'currency', currency: 'PHP' }}
        className="max-w-md"
      />
      <p>Selected Budget: ₱{budgetRange[0]} - {budgetRange[1] === 10000 ? '₱10,000+' : `₱${budgetRange[1]}`}</p>
    </>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

// Main Business All Products Component
const BusinessAllproducts = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize login status
  const [mockData, setMockData] = useState({
    activities: [],
    accommodations: [],
    restaurant: [],
    shop: []
  });

  const { businessId: encryptedBusinessId } = useParams();

  const [allProducts, setAllProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedType, setSelectedType] = useState('All');
  const [ratingFilter, setRatingFilter] = useState([]);
  const [budgetRange, setBudgetRange] = useState([0, 10000]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen: originalOnOpen, onOpenChange } = useDisclosure();

  // Function to decrypt the business_id
  const decryptId = (encryptedId) => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  const categories = ['activity', 'accommodation', 'restaurant', 'shop'];

  // Function to check login status
  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/check-login', {
        method: 'GET',
        credentials: 'include' // Include cookies
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn); // Set login status
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Fetch data for each category from the backend
  useEffect(() => {
    const fetchCategoryData = async (category) => {
      try {
        const decryptedBusinessId = decryptId(encryptedBusinessId);
        const response = await fetch(`http://localhost:5000/getAllBusinessProduct?category=${category}`);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();

          // console.log('Products: ', data);

          if (data.success) {
            // Filter products based on their category and decrypted business_id
            const filteredProducts = data.businessProducts.filter((product) => {
              return product.product_category === category && product.business_id === parseInt(decryptedBusinessId);
            });

            // Map backend categories to state keys
            const categoryKey = category === 'activity' ? 'activities' :
                                category === 'accommodation' ? 'accommodations' :
                                category === 'restaurant' ? 'restaurant' : 'shop';

            setMockData((prevData) => ({
              ...prevData,
              [categoryKey]: filteredProducts,
            }));
          } else {
            console.error(`Failed to fetch ${category} data:`, data.message);
          }
        } else {
          console.error(`Unexpected response format for ${category}:`, response);
        }
      } catch (error) {
        console.error(`Error fetching ${category} data:`, error);
      }
    };

    // Initiate data fetching for each category
    categories.forEach((category) => {
      fetchCategoryData(category);
    });
  }, [encryptedBusinessId]);

   // Update `allProducts` whenever category data changes
  useEffect(() => {
    setAllProducts([
      ...mockData.activities,
      ...mockData.accommodations,
      ...mockData.restaurant,
      ...mockData.shop,
    ]);
  }, [mockData.activities, mockData.accommodations, mockData.restaurant, mockData.shop]);

  // console.log('All products', mockData);

  const openBookingModal = (product) => {
    console.log('Opening booking modal for product:', product);
    if (product.product_category === 'accommodation') {
      setActiveModal({ type: 'accommodation', product });
    } else if (product.product_category === 'restaurant') {
      setActiveModal({ type: 'restaurant', product });
    } else if (product.product_category === 'activity') {
      setActiveModal({ type: 'activities', product });
    } else {
      console.warn('Product type not recognized:', product.type);
    }
  };

  const closeBookingModal = () => {
    // console.log('Closing booking modal');
    setActiveModal(null);
  };

  useEffect(() => {
    setLoading(true);
    let data;
    switch (activeTab) {
      case 'activities':
        data = mockData.activities;
        break;
      case 'accommodations':
        data = mockData.accommodations;
        break;
      case 'restaurant':
        data = mockData.restaurant;
        break;
      case 'shop':
        data = mockData.shop;
        break;
      default:
        data = allProducts;
    }

    // Apply Type Filter
    if (selectedType !== 'All') {
      data = data.filter((item) => item.type === selectedType);
    }

    // Apply Rating Filter
    if (ratingFilter.length > 0) {
      data = data.filter((item) => ratingFilter.includes(item.rating));
    }

    // Apply Budget Filter
    data = data.filter((item) =>
      budgetRange[1] === 10000 ? item.price >= budgetRange[0] : item.price >= budgetRange[0] && item.price <= budgetRange[1]
    );

    // Sort by Price from Highest to Lowest
    data = data.sort((a, b) => b.price - a.price);

    setFilteredData(data);
    setLoading(false);
  }, [activeTab, selectedType, ratingFilter, budgetRange, allProducts]);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleThumbnailClick = (index) => {
    if (selectedProduct && selectedProduct.images && selectedProduct.images[index]) {
      setPreviewImage(`http://localhost:5000/${selectedProduct.images[index].path}`);
      setPreviewIndex(index);
      setIsPreviewOpen(true);
    }
  };

  const goToPrevImage = () => {
    if (selectedProduct && previewIndex > 0) {
      const newIndex = previewIndex - 1;
      setPreviewIndex(newIndex);
      setPreviewImage(`http://localhost:5000/${selectedProduct.images[newIndex].path}`);
    }
  };

  const goToNextImage = () => {
    if (selectedProduct && selectedProduct.images && previewIndex < selectedProduct.images.length - 1) {
      const newIndex = previewIndex + 1;
      setPreviewIndex(newIndex);
      setPreviewImage(`http://localhost:5000/${selectedProduct.images[newIndex].path}`);
    }
  };

  const closePreview = () => {
    setPreviewImage(null);
    setPreviewIndex(null);
    setIsPreviewOpen(false);
  };

  const onOpen = (product) => {
    // console.log('Selected Product:', product);
    // console.log('Product Images:', product?.images);
    
    if (product && Array.isArray(product.images)) {
      setSelectedProduct(product);
      originalOnOpen();
    } else {
      console.warn('Invalid product data or missing images:', product);
    }
  };

  if (loading) {
    return <Spinner className='flex justify-center items-center h-screen' size='lg' label="Loading..." color="primary" />;
  }

  return (
    <div className="min-h-screen container mx-auto p-4 bg-white  rounded-md shadow-md mb-4">
      <div className="text-3xl font-semibold mb-6 text-gray-800">What We Offer</div>

      <div className="flex flex-col lg:flex-row gap-2">
        {/* Filter Section */}
        <div className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md">
          <Filters
            activeTab={activeTab}
            setSelectedType={setSelectedType}
            setRatingFilter={setRatingFilter}
            budgetRange={budgetRange}
            setBudgetRange={setBudgetRange}
            ratingFilter={ratingFilter}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col w-full bg-white  p-5 rounded-lg shadow-md">
          {/* Tabs */}
          <Tabs
            aria-label="Business Offerings"
            variant="underlined"
            className="mb-4"
            onSelectionChange={(key) => setActiveTab(key)}
            selectedKey={activeTab}
          >
            <Tab key="all" title="All Products" />
            <Tab key="activities" title="Activities" />
            <Tab key="accommodations" title="Accommodations" />
            <Tab key="restaurant" title="Restaurant Service" />
            <Tab key="shop" title="Shop" />
          </Tabs>

          {/* Content */}
          <div className="p-2 max-h-[800px] overflow-y-auto  scrollbar-custom">
            {loading ? (
              <LoadingSpinner />
            ) : filteredData.length > 0 ? (
              filteredData.map((product) => (
                <ProductCard 
                  key={product.product_id}
                  product={product} 
                  openBookingModal={openBookingModal} 
                  onOpen={onOpen} 
                  isLoggedIn={isLoggedIn} 
                />
              ))
            ) : (
              <div className="text-center text-gray-500">No results found</div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="5xl"
        className='max-h-[100%]'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Image Gallery</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 cursor-pointer">
                  {console.log('Modal Selected Product:', selectedProduct)}
                  {console.log('Modal Images:', selectedProduct?.images)}
                  {selectedProduct && selectedProduct.images && selectedProduct.images.length > 0 ? (
                    selectedProduct.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group overflow-hidden rounded-lg shadow-md"
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <img
                          src={`http://localhost:5000/${image.path}`}
                          alt={image.title || `Gallery image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded-t-lg bg-gray-100 text-gray-500">
                      No images available
                    </div>
                  )}
                </div>
              
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} color='danger'>Close</Button>
              </ModalFooter>

               {/* Single Image Preview Modal */}
                <Modal 
                  isOpen={isPreviewOpen} 
                  onOpenChange={setIsPreviewOpen}
                  hideCloseButton
                  size="full"
                  className='z-50 bg-black bg-opacity-75'
                >
                  <ModalContent className="relative w-full h-full flex justify-center items-center">
                    <ModalBody className="relative w-full h-full flex justify-center items-center bg-transparent p-4">
                      <div className="relative max-w-[90vw] max-h-[85vh] flex justify-center items-center">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-md"
                          style={{
                            minWidth: '300px',  // Minimum width for very small images
                            minHeight: '200px', // Minimum height for very small images
                          }}
                        />
                      </div>
                      {previewIndex !== null && selectedProduct?.images[previewIndex] && (
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-xl font-semibold py-2 bg-black bg-opacity-50">
                          {selectedProduct.images[previewIndex].title || `Image ${previewIndex + 1}`}
                        </div>
                      )}
                      {previewIndex > 0 && (
                        <button
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 transition-all duration-300"
                          onClick={goToPrevImage}
                          aria-label="Previous image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                      {selectedProduct?.images && previewIndex < selectedProduct.images.length - 1 && (
                        <button
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 transition-all duration-300"
                          onClick={goToNextImage}
                          aria-label="Next image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        className="absolute top-4 right-4 bg-red-500 bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 transition-all duration-300"
                        onClick={closePreview}
                        aria-label="Close preview"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </ModalBody>
                  </ModalContent>
                </Modal>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Conditionally Render Modals */}
      {activeModal?.type === 'accommodation' && (
        <AccommodationBookingForm isOpen={true} onClose={closeBookingModal} product={activeModal.product} />
      )}
      {activeModal?.type === 'restaurant' && (
        <TableReservationForm isOpen={true} onClose={closeBookingModal} product={activeModal.product} />
      )}
      {activeModal?.type === 'activities' && (
        <AttractionActivitiesBookingForm isOpen={true} onClose={closeBookingModal} product={activeModal.product} />
      )}
    </div>
  );
};

export default BusinessAllproducts;
