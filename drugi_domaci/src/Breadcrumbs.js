import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="breadcrumb" style={{ margin: '10px 0' }}>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '5px' }}>
        {/* Home link uvek */}
        <li>
          <Link to="/" style={{ color: 'white', textDecoration: 'underline', fontWeight: '600' }}>
            Home
          </Link>
          {pathnames.length > 0 && ' / '}
        </li>

        {/* Ostale stavke */}
        {pathnames.map((name, index) => {
          const routeTo = '/' + pathnames.slice(0, index + 1).join('/');
          const displayName = decodeURIComponent(name);

          return (
            <li key={routeTo}>
              <Link
                to={routeTo}
                style={{ color: 'white', textDecoration: 'underline', fontWeight: '600' }}
              >
                {displayName}
              </Link>
              {index < pathnames.length - 1 && ' / '}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
