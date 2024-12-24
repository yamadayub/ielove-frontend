import { create } from 'zustand';
import type { User } from '../features/user/types/user_types';

interface PurchaseHistory {
  id: string;
  propertyId: string;
  purchaseDate: string;
  totalAmount: number;
}

interface Store {
  user: User & {
    purchasedPropertyIds: string[];
    purchaseHistory: PurchaseHistory[];
  };
  cart: any[]; // TODO: カートの型を定義
  completePurchase: (propertyId: string) => void;
  isPropertyPurchased: (propertyId: string) => boolean;
  updateUserProfile: (name: string, email: string) => void;
  clearCart: () => void;
}

export const useStore = create<Store>((set, get) => ({
  user: {
    id: 'u1',
    name: '',
    email: '',
    user_type: 'individual',
    role: 'buyer',
    is_active: true,
    purchasedPropertyIds: [],
    purchaseHistory: [],
  },
  
  cart: [],

  completePurchase: (propertyId) => {
    set((state) => {
      // Check if property is already purchased
      if (state.user.purchasedPropertyIds.includes(propertyId)) {
        return state;
      }

      const newPurchase: PurchaseHistory = {
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

  clearCart: () => {
    set(() => ({
      cart: [],
    }));
  },
}));