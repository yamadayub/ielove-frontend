import React from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { MOCK_PROPERTIES, MOCK_ROOMS } from '../../utils/mockData';

export const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbs = () => {
    const breadcrumbs = [];

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      let path = `/${pathSegments.slice(0, i + 1).join('/')}`;
      let label = '';

      switch (segment) {
        case 'property':
          if (pathSegments[i + 1]) {
            const property = MOCK_PROPERTIES.find(p => p.id === pathSegments[i + 1]);
            if (property) {
              path = `/property/${property.id}`;
              label = property.name;
              i++; // Skip the ID segment
            }
          }
          break;
        case 'room':
          if (pathSegments[i + 1]) {
            const room = MOCK_ROOMS.find(r => r.id === pathSegments[i + 1]);
            if (room) {
              path = `/property/${room.propertyId}/room/${room.id}`;
              label = room.name;
              i++; // Skip the ID segment
            }
          }
          break;
        case 'post':
          label = '投稿';
          break;
        case 'search':
          label = '検索';
          break;
        case 'favorites':
          label = 'お気に入り';
          break;
        case 'mypage':
          label = 'マイページ';
          break;
        case 'checkout':
          label = '購入手続き';
          break;
        case 'complete':
          label = '購入完了';
          break;
        default:
          continue;
      }

      if (label) {
        breadcrumbs.push({ path, label });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-2">
        <div className="h-10 md:h-14 flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="前のページに戻る"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
          </button>
          <nav className="flex items-center space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide">
            <Link to="/" className="text-xs md:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap">
              ホーム
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-gray-400 flex-shrink-0" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-xs md:text-sm text-gray-900 font-medium whitespace-nowrap">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    to={crumb.path} 
                    className="text-xs md:text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};