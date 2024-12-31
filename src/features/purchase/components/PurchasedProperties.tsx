import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useMyPurchases } from '../hooks/useMyPurchases';

export const PurchasedProperties: React.FC = () => {
  const { data, isLoading } = useMyPurchases();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!data?.transactions?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        購入済みの物件がありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.transactions.map((transaction) => (
        <div key={transaction.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">
                {transaction.property.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {transaction.property.prefecture}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                購入日: {new Date(transaction.purchaseDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                ¥{transaction.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to={`/property/${transaction.property.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center"
            >
              物件詳細を見る
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}; 