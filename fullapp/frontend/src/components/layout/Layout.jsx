import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />
      <main className='flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6'>
          <Outlet />
      </main>
      <Footer />
    </div>
  );
}