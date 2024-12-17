import { create } from 'zustand';
import { Store } from '../types';

export const useStore = create<Store>((set, get) => ({
  user: {
    id: 'u1',
    name: '',
    email: '',
    purchasedPropertyIds: [],
    purchaseHistory: [],
  },
  
  completePurchase: (propertyId) => {
    set((state) => {
      // Check if property is already purchased
      if (state.user.purchasedPropertyIds.includes(propertyId)) {
        return state;
      }

      const newPurchase = {
        id: `ph${Date.now()}`,
        propertyId,
        purchaseDate: new Date().toISOString(),
        totalAmount: 3000, // Fixed price for specifications
      };

      return {
        user: {
          ...state.user,
          purchasedPropertyIds: [...state.user.purchasedPropertyIds, propertyId],
          purchaseHistory: [...state.user.purchaseHistory, newPurchase],
        },
      };
    });
  },

  isPropertyPurchased: (propertyId) => {
    return get().user.purchasedPropertyIds.includes(propertyId);
  },

  updateUserProfile: (name, email) => {
    set((state) => ({
      user: {
        ...state.user,
        name,
        email,
      },
    }));
  },

  // clearCart関数を追加
  clearCart: () => {
    set(() => ({
      cart: [], // カートを空にする
    }));
  },

}));