import React from 'react';
import TopSlider from 'react-slick';
import { Button } from '@nextui-org/react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Sample products similar to BusinessAllproducts
const sampleProducts = [
  {
    title: 'Hiking Adventure',
    description: 'Explore scenic mountain trails. Guide and equipment included.',
    price: 1500,
    imageUrl: 'https://via.placeholder.com/200',
    rating: 4,
    type: 'Hiking',
  },
  {
    title: 'Luxury Mountain Cabin',
    description: 'Stay in a cozy cabin with scenic views and modern amenities.',
    price: 5000,
    imageUrl: 'https://via.placeholder.com/200',
    rating: 5,
    type: 'Cabins',
  },
  {
    title: 'Coastal Seafood Feast',
    description: 'Indulge in fresh seafood dishes by the shore.',
    price: 1500,
    imageUrl: 'https://via.placeholder.com/200',
    rating: 4,
    type: 'Buffet',
  },
  // Add more sample products as needed
];

// Carousel settings
const carouselSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 3, // Default for large screens
  slidesToScroll: 1,
  arrows: true, // Ensure arrows are enabled
  responsive: [
    {
      breakpoint: 1024, // Medium screens
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true, // Ensure arrows are enabled for medium screens
      }
    },
    {
      breakpoint: 768, // Small screens
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true, // Ensure arrows are enabled for small screens
      }
    }
  ]
};

const TopRated = () => {
  return (
    <div className='container mx-auto mt-8 mb-6 p-4'>
      <h1 className='text-xl font-semibold mb-4'>Top Rated Offered Activities, Accomodations, Services, & Products in the Province of Sorsogon</h1>
      <TopSlider {...carouselSettings}>
        {sampleProducts.map((product, index) => (
          <div key={index} className='p-2'>
            <div className='shadow-lg rounded-lg overflow-hidden bg-white'>
              <img src={product.imageUrl} alt={product.title} className='w-full h-48 object-cover' />
              <div className='p-4'>
                <h3 className='text-lg font-semibold text-gray-800'>{product.title}</h3>
                <p className='text-sm text-gray-600 mt-1'>{product.description}</p>
                <div className='flex items-center mt-2'>
                  <span className='text-yellow-500'>
                    {'★'.repeat(product.rating)}
                    {'☆'.repeat(5 - product.rating)}
                  </span>
                  <span className='ml-2 text-sm text-gray-600'>{product.rating}</span>
                </div>
                <div className='flex justify-between'>
                  <p className='mt-2 font-bold text-gray-800'>₱{product.price.toFixed(2)}</p>
                  <Button color='primary' className='hover:bg-color2'>View</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </TopSlider>
    </div>
  );
};

export default TopRated;