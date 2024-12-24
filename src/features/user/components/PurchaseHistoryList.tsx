import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import type { Purchase } from '../../../types/types';
import { MOCK_PROPERTIES } from '../../../utils/mockData';

interface PurchaseHistoryListProps {
  purchaseHistory: Purchase[];
}

export const PurchaseHistoryList: React.FC<PurchaseHistoryListProps> = ({ purchaseHistory }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <Clock className="h-8 w-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">購入履歴</h2>
        </div>
      </div>

      {purchaseHistory.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          購入履歴はありません
        </div>
      ) : (
        <div className="divide-y">
          {purchaseHistory.map((purchase) => {
            const property = MOCK_PROPERTIES.find(p => p.id === purchase.propertyId);
            if (!property) return null;

            const formattedDate = new Date(purchase.purchaseDate).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            const formattedPrice = new Intl.NumberFormat('ja-JP', {
              style: 'currency',
              currency: 'JPY',
              minimumFractionDigits: 0,
            }).format(purchase.totalAmount);

            return (
              <div key={purchase.id} className="p-6">
                <Link
                  to={`/property/${property.id}`}
                  className="flex items-center justify-between hover:bg-gray-50 -m-6 p-6"
                >
                  <div className="flex space-x-4">
                    <img
                      src={property.thumbnail}
                      alt={property.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{property.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{formattedDate}</p>
                      <p className="text-sm font-medium text-gray-900 mt-2">
                        {formattedPrice}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};