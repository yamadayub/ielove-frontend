export interface PurchaseHistory {
  id: number;
  purchaseDate: string;
  totalAmount: number;
  listing: {
    id: number;
    title: string;
    price: number;
  };
  property: {
    id: number;
    name: string;
    prefecture: string;
  };
}

export interface PurchaseHistoryResponse {
  transactions: PurchaseHistory[];
} 