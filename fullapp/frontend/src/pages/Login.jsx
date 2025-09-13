import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      nav(from, { replace: true });
    } catch (error) {
      setErr(error.message || 'Login failed');
    }
  };

  return (
    <div className='min-h-screen grid place-items-center p-4'>
      <form
        onSubmit={onSubmit}
        className='w-full max-w-sm space-y-4 bg-white p-6 rounded shadow'
      >
        <h1 className='text-2xl font-bold'>Login</h1>
        {err && <p className='text-red-600 text-sm'>{err}</p>}
        <div>
          <label className='block text-sm mb-1'>Email</label>
          <input
            className='w-full border rounded px-3 py-2'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='block text-sm mb-1'>Password</label>
          <input
            className='w-full border rounded px-3 py-2'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='w-full rounded bg-gray-900 text-white py-2'>
          Sign in
        </button>
        <p className='text-sm text-gray-600'>
          No account?{' '}
          <Link className='text-gray-900 underline' to='/register'>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}