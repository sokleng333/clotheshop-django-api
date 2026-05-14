// context/WishlistContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Swal from 'sweetalert2';

const WishlistContext = createContext();

// Action types
const WISHLIST_ACTIONS = {
  ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  LOAD_WISHLIST: 'LOAD_WISHLIST'
};

// Reducer function
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.ADD_TO_WISHLIST:
      // Check if item already exists in wishlist
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // Item already in wishlist, do nothing
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, addedAt: new Date().toISOString() }]
      };

    case WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        items: []
      };

    case WISHLIST_ACTIONS.LOAD_WISHLIST:
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: []
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlistItems = JSON.parse(savedWishlist);
        dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: wishlistItems });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items]);

  // Actions
  const addToWishlist = (product) => {
    const alreadyInWishlist = state.items.some(item => item.id === product.id);
    
    if (alreadyInWishlist) {
      // Show info alert if already in wishlist
      Swal.fire({
        title: 'Already in favorite! 💖',
        html: `
          <div class="flex items-center gap-3">
            <img src="${product.image}" alt="${product.name}" class="w-10 h-10 rounded-lg object-cover">
            <div class="text-left">
              <p class="font-semibold text-gray-800">${product.name}</p>
              <p class="text-sm text-gray-600">This item is already in your favorite</p>
            </div>
          </div>
        `,
        icon: 'info',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: '#fef7ff',
        customClass: {
          popup: 'rounded-xl shadow-xl border border-purple-200'
        }
      });
      return; // Don't add duplicate
    }

    dispatch({
      type: WISHLIST_ACTIONS.ADD_TO_WISHLIST,
      payload: product
    });

    // Show success alert for new item
    Swal.fire({
      title: 'Added to favorite! 💖',
      html: `
        <div class="flex items-center gap-3">
          <img src="${product.image}" alt="${product.name}" class="w-10 h-10 rounded-lg object-cover">
          <div class="text-left">
            <p class="font-semibold text-gray-800">${product.name}</p>
            <p class="text-sm text-gray-600">Successfully added to favorite</p>
          </div>
        </div>
      `,
      icon: 'success',
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      background: '#fef7ff',
      customClass: {
        popup: 'rounded-xl shadow-xl border border-purple-200'
      }
    });
  };

  const removeFromWishlist = (productId) => {
    const product = state.items.find(item => item.id === productId);
    
    dispatch({
      type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST,
      payload: productId
    });

    // Show removed alert
    if (product) {
      Swal.fire({
        title: 'Removed from favorite! 💔',
        html: `
          <div class="flex items-center gap-3">
            <img src="${product.image}" alt="${product.name}" class="w-10 h-10 rounded-lg object-cover">
            <div class="text-left">
              <p class="font-semibold text-gray-800">${product.name}</p>
              <p class="text-sm text-gray-600">Removed from your favorite</p>
            </div>
          </div>
        `,
        icon: 'info',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        background: '#fef7ff',
        customClass: {
          popup: 'rounded-xl shadow-xl border border-purple-200'
        }
      });
    }
  };

  const clearWishlist = () => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getWishlistItemsCount = () => {
    return state.items.length;
  };

  const getWishlistItems = () => {
    return state.items;
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const value = {
    items: state.items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistItemsCount,
    getWishlistItems,
    toggleWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
