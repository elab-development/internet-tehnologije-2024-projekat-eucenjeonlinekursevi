import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import SkeletonCard from '../components/common/SkeletonCard';
import CourseCard from '../components/courses/CourseCard';

export default function Courses() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const limit = 12;

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const data = await api.courses.list({ page, limit, q, all: false });
      setItems(data.items || []);
      setPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (e) {
      setErr(e.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [page, q]);

  const onOpenCourse = (course) => {
    console.log('open course', course);
  };

  return (
    <div>
      <div className='mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
        <h1 className='text-2xl font-bold text-gray-900'>Courses</h1>
        <div className='sm:ml-auto w-full sm:w-auto'>
          <input
            placeholder='Search courses…'
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            className='w-full sm:w-80 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {err && (
        <div className='mb-4 rounded-md bg-red-50 px-4 py-3 text-red-700 shadow-sm'>
          {err}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className='text-gray-600'>No courses found.</div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {items.map((c) => (
              <CourseCard key={c._id} course={c} onOpen={onOpenCourse} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className='mt-6 flex items-center justify-center gap-2'>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className='rounded-md px-3 py-2 text-sm shadow-sm hover:shadow disabled:opacity-50'
              >
                Prev
              </button>
              <span className='text-sm text-gray-600'>
                Page {page} of {pages} • {total} total
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className='rounded-md px-3 py-2 text-sm shadow-sm hover:shadow disabled:opacity-50'
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}