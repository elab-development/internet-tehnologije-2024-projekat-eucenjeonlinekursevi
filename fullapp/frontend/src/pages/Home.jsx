import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-bold mb-4'>Home (Protected)</h1>
      <p className='mb-6'>
        Hello, <span className='font-semibold'>{user?.name}</span>!
      </p>
      <button
        onClick={logout}
        className='px-4 py-2 rounded bg-gray-900 text-white hover:opacity-90'
      >
        Logout
      </button>
    </div>
  );
}