import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register(name, email, password);
      nav('/', { replace: true });
    } catch (error) {
      setErr(error.message || 'Registration failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-md bg-white shadow-xl rounded-xl p-8'>
        <h1 className='text-3xl font-bold text-center text-blue-700 mb-2'>
          Create Account
        </h1>
        <p className='text-center text-gray-500 mb-6'>
          Sign up to start learning
        </p>

        {err && <p className='text-red-600 text-sm mb-3'>{err}</p>}

        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Name
            </label>
            <input
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors'>
            Sign Up
          </button>
        </form>

        <p className='text-center text-sm text-gray-600 mt-6'>
          Already have an account?{' '}
          <Link className='text-blue-700 hover:underline' to='/login'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}