import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();


  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="breadcrumb" style={{ margin: '10px 0' }}>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '5px' }}>
        <li>
          <Link to="/">Početna</Link>
          {pathnames.length > 0 && " / "}
        </li>
        {pathnames.map((name, index) => {
          const routeTo = '/' + pathnames.slice(0, index + 1).join('/');
          const isLast = index === pathnames.length - 1;
          const displayName = decodeURIComponent(name);

          return (
            <li key={routeTo}>
              {isLast ? (
                <span>{displayName}</span>
              ) : (
                <>
                  <Link to={routeTo}>{displayName}</Link> /{' '}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
