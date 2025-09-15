import { useEffect, useMemo, useState } from 'react';
import { api } from '../../utils/api';

import AdminPageHeader from '../../components/admin/AdminPageHeader';
import CoursesTable from '../../components/admin/CoursesTable';
import CourseForm from '../../components/admin/CourseForm';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import CourseResourcesManager from '../../components/admin/CourseResourcesManager';

export default function AdminCourses() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [resourceCourse, setResourceCourse] = useState(null);

  const headerTitle = useMemo(() => 'Manage Courses', []);

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const data = await api.courses.list({ page, limit, q, all: true });
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
    load(); // eslint-disable-next-line
  }, [page, q]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setShowForm(true);
  };

  const onSubmit = async (payload) => {
    if (editing?._id) {
      await api.courses.update(editing._id, payload);
    } else {
      await api.courses.create(payload);
      setPage(1);
    }
    setShowForm(false);
    setEditing(null);
    await load();
  };

  const onAskDelete = (course) => {
    setToDelete(course);
    setConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!toDelete?._id) return;
    await api.courses.remove(toDelete._id);
    setConfirmOpen(false);
    setToDelete(null);
    if (items.length === 1 && page > 1) setPage((p) => p - 1);
    await load();
  };

  return (
    <div>
      <AdminPageHeader
        title={headerTitle}
        ctaLabel='New Course'
        onCta={openCreate}
      />

      {/* Search bar */}
      <div className='mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
        <input
          placeholder='Search courses…'
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          className='w-full sm:max-w-sm rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <div className='text-sm text-gray-500 sm:ml-auto'>
          Total: <b>{total}</b>
        </div>
      </div>

      {err && (
        <div className='mb-4 rounded-md bg-red-50 px-4 py-3 text-red-700 shadow-sm'>
          {err}
        </div>
      )}
      {loading ? (
        <div className='grid place-items-center h-40 text-gray-600'>
          Loading…
        </div>
      ) : (
        <>
          <CoursesTable
            items={items}
            onEdit={openEdit}
            onDelete={onAskDelete}
            onResources={(c) => setResourceCourse(c)}
          />
          <Pagination page={page} pages={pages} onPage={setPage} />
        </>
      )}

      {/* Modal: Form (details + text sections) */}
      {showForm && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/40 p-4'>
          <div className='w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>
                {editing ? 'Edit Course' : 'Create Course'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className='rounded-md p-2 hover:shadow'
                aria-label='Close'
              >
                ✕
              </button>
            </div>
            <CourseForm
              initialData={editing}
              onSubmit={onSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Modal: Confirm delete */}
      <ConfirmDialog
        open={confirmOpen}
        title='Delete course?'
        message={
          toDelete ? `This will permanently delete "${toDelete.title}".` : ''
        }
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Modal: Manage resources */}
      {resourceCourse && (
        <CourseResourcesManager
          course={resourceCourse}
          onClose={async (refresh) => {
            setResourceCourse(null);
            if (refresh) await load();
          }}
        />
      )}
    </div>
  );
}