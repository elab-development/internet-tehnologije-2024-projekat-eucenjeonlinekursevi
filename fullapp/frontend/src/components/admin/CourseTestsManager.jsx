import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { Plus, X, Edit3, Trash2 } from 'lucide-react';
import TestForm from './TestForm';

export default function CourseTestsManager({ course, onClose }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await api.tests.listByCourse({
        courseId: course._id,
        all: true,
      });
      setTests(data.items || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); /* eslint-disable-line */
  }, [course?._id]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (t) => {
    setEditing(t);
    setShowForm(true);
  };

  const onSubmit = async (payload) => {
    if (editing?._id) await api.tests.update(editing._id, payload);
    else await api.tests.create(payload);
    setShowForm(false);
    setEditing(null);
    await load();
  };

  const onDelete = async (test) => {
    if (!window.confirm(`Delete test "${test.title}"?`)) return;
    await api.tests.remove(test._id);
    await load();
  };

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/40 p-4'>
      <div className='w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Manage Tests — {course.title}
          </h2>
          <button
            onClick={() => onClose(true)}
            className='rounded-md p-2 hover:shadow'
            title='Close'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {err && <p className='text-red-600 text-sm mb-3'>{err}</p>}

        <div className='mb-4 rounded-xl bg-white p-4 shadow-sm'>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-sm font-semibold text-gray-900'>
              Existing Tests
            </h3>
            <button
              onClick={openCreate}
              className='inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-white shadow hover:bg-blue-700'
            >
              <Plus className='h-4 w-4' /> New test
            </button>
          </div>

          {loading ? (
            <div className='grid place-items-center h-20 text-gray-600'>
              Loading…
            </div>
          ) : tests.length === 0 ? (
            <p className='text-sm text-gray-500'>No tests yet.</p>
          ) : (
            <ul className='space-y-2'>
              {tests.map((t) => (
                <li
                  key={t._id}
                  className='flex items-center justify-between rounded-md px-3 py-2 shadow-sm'
                >
                  <div>
                    <p className='font-medium text-gray-900'>{t.title}</p>
                    <p className='text-xs text-gray-600'>
                      {t.isActive ? 'Active' : 'Inactive'} • total points:{' '}
                      {t.totalPoints} • pass: {t.passingScorePercent}%
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => openEdit(t)}
                      className='inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-gray-700 shadow-sm hover:shadow'
                    >
                      <Edit3 className='h-4 w-4' /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(t)}
                      className='inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-white shadow hover:bg-red-700'
                    >
                      <Trash2 className='h-4 w-4' /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showForm && (
          <div className='rounded-xl bg-white p-4 shadow-sm'>
            <div className='mb-3 flex items-center justify-between'>
              <h3 className='text-sm font-semibold text-gray-900'>
                {editing ? 'Edit Test' : 'Create Test'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className='rounded-md px-2 py-1 shadow-sm hover:shadow'
              >
                Close
              </button>
            </div>
            <TestForm
              initialData={editing}
              courseId={course._id}
              onSubmit={onSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}