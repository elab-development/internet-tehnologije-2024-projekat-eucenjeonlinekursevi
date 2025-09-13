import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
      end
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const common = (
    <>
      <NavItem to='/'>Home</NavItem>
      {!isAdmin && <NavItem to='/courses'>Courses</NavItem>}
      {!isAdmin && <NavItem to='/profile'>Profile</NavItem>}

      {isAdmin && <NavItem to='/admin/courses'>Manage Courses</NavItem>}
      {isAdmin && <NavItem to='/admin/dashboard'>Dashboard</NavItem>}
    </>
  );

  return (
    <header className='shadow-md bg-white'>
      <nav className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Brand */}
          <div className='flex items-center gap-3'>
            <Link to='/' className='text-xl font-extrabold text-blue-700'>
              eLearn
            </Link>
          </div>

          {/* Desktop links */}
          <div className='hidden md:flex items-center gap-2'>
            {common}
            <span className='mx-2 text-gray-300'>|</span>
            <span className='text-sm text-gray-600 mr-2'>
              Hi, <b>{user?.name}</b>
            </span>
            <button
              onClick={logout}
              className='px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:opacity-90'
            >
              Logout
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className='md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100'
            onClick={() => setOpen((v) => !v)}
            aria-label='Toggle menu'
          >
            <svg
              className='h-6 w-6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className='md:hidden pb-4 border-t'>
            <div className='flex flex-col gap-2 pt-3'>
              {common}
              <button
                onClick={logout}
                className='mt-2 px-3 py-2 text-left text-sm rounded-md bg-gray-900 text-white hover:opacity-90'
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}