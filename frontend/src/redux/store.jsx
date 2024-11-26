import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './businessSlice';
import activitiesReducer from './activitiesSlice';
import accommodationReducer from './accomodationSlice';
import restaurantServicesReducer from './restaurantServicesSlice';
import shopReducer from './shopSlice';
import activityDealsReducer from './activityDealsSlice';
import accommodationDealsReducer from './accommodationDealsSlice'
import restaurantDealsReducer from './restaurantDealsSlice'
import shopDealsReducer from './shopDealsSlice'
import bookingsReducer from './bookingSlice';






const store = configureStore({
  reducer: {
    business: businessReducer,  // Existing business reducer
    activities: activitiesReducer,
    accommodations: accommodationReducer, 
    restaurantServices : restaurantServicesReducer,
    shop: shopReducer,
    activityDeals: activityDealsReducer,
    accommodationDeals: accommodationDealsReducer,
    restaurantDeals: restaurantDealsReducer, 
    shopDeals: shopDealsReducer,
    bookings: bookingsReducer,
  
  },

});

export default store;
