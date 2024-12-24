import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useProperty } from '../../../property/hooks/useProperty';
import { useRoom } from '../../../room/hooks/useRoom';
import { useProduct } from '../../../product/hooks/useProduct';

export const Breadcrumb: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, propertyId, roomId, productId } = useParams();
  const { data: property } = useProperty(id || propertyId);
  const { data: room } = useRoom(roomId);
  const { data: product } = useProduct(productId);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.reduce((acc: Array<{ path: string; label: string }>, segment, index) => {
    const currentPath = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    if ((segment === id || segment === propertyId) && property && acc.findIndex(b => b.label === property.name) === -1) {
      acc.push({ path: currentPath, label: property.name });
    } else if (segment === roomId && room && acc.findIndex(b => b.label === room.name) === -1) {
      acc.push({ path: currentPath, label: room.name });
    } else if (segment === productId && product && acc.findIndex(b => b.label === product.name) === -1) {
      acc.push({ path: currentPath, label: product.name });
    }
    
    return acc;
  }, []);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 px-4 py-3 bg-white border-b">
      <button
        onClick={() => navigate(-1)}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <ArrowLeft className="h-5 w-5 text-gray-600" />
      </button>
      <div className="flex items-center space-x-2">
        {breadcrumbs.map(({ path, label }, index) => (
          <React.Fragment key={path}>
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-900 font-medium">{label}</span>
            ) : (
              <button 
                onClick={() => navigate(path)}
                className="text-gray-600 hover:text-gray-900"
              >
                {label}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};