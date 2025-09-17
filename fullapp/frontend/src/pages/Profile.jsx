import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CertificateCard from '../components/profile/CertificateCard';
import { User2, Mail } from 'lucide-react';

export default function Profile() {
  const { user, initializing } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (initializing) return;

    let alive = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const c = await api.certificates.listMine();
        if (alive) setCerts(c?.items || []);
      } catch (e) {
        if (alive) setErr(e.message || 'Failed to load certificates');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [initializing]);

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-900 mb-4'>Profile</h1>

      {err && (
        <div className='mb-4 rounded-md bg-red-50 px-4 py-3 text-red-700 shadow-sm'>
          {err}
        </div>
      )}

      {/* User card */}
      <div className='mb-8 rounded-xl bg-white p-6 shadow'>
        <h2 className='text-lg font-semibold text-gray-900 mb-3'>User Info</h2>
        {initializing && !user ? (
          <div className='text-gray-600'>Loading…</div>
        ) : user ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
            <div className='inline-flex items-center gap-2'>
              <User2 className='h-4 w-4 text-gray-500' />
              <span className='text-gray-600'>Name:</span>
              <span className='font-medium text-gray-900'>{user.name}</span>
            </div>
            <div className='inline-flex items-center gap-2'>
              <Mail className='h-4 w-4 text-gray-500' />
              <span className='text-gray-600'>Email:</span>
              <span className='font-medium text-gray-900'>{user.email}</span>
            </div>
          </div>
        ) : (
          <div className='text-gray-600'>No user data.</div>
        )}
      </div>

      {/* Certificates */}
      <div className='rounded-xl bg-white p-6 shadow'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>Certificates</h2>
          <span className='text-sm text-gray-500'>{certs.length} total</span>
        </div>

        {loading || initializing ? (
          <div className='text-gray-600'>Loading…</div>
        ) : certs.length === 0 ? (
          <p className='text-sm text-gray-600'>You have no certificates yet.</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {certs.map((cert) => (
              <CertificateCard key={cert._id} cert={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}