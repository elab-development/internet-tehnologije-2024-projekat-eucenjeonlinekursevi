import { useState } from 'react';
import { api } from '../../utils/api';
import { Upload, X, FileText, Trash2 } from 'lucide-react';

export default function CourseResourcesManager({ course, onClose }) {
  const [resources, setResources] = useState(course.resources || []);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const upload = async () => {
    if (!files.length) return;
    setLoading(true);
    setErr('');
    try {
      const data = await api.courses.uploadResources(course._id, files);
      setResources(data.resources);
      setFiles([]);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (url) => {
    setLoading(true);
    setErr('');
    try {
      await api.courses.removeResource(course._id, url);
      setResources((r) => r.filter((res) => res.url !== url));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/40 p-4'>
      <div className='w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Manage Resources — {course.title}
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

        <div className='space-y-3 max-h-60 overflow-auto mb-4'>
          {resources.length === 0 && (
            <p className='text-sm text-gray-500'>No resources uploaded yet.</p>
          )}
          {resources.map((r) => (
            <div
              key={r.url}
              className='flex items-center justify-between rounded-md px-3 py-2 shadow-sm'
            >
              <a
                href={r.url}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 text-blue-700 text-sm truncate'
              >
                <FileText className='h-4 w-4' />
                <span className='truncate'>{r.name}</span>
              </a>
              <button
                onClick={() => remove(r.url)}
                className='inline-flex items-center gap-1 text-xs text-red-600 hover:underline'
                title='Remove'
              >
                <Trash2 className='h-3 w-3' />
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className='space-y-2'>
          <input
            type='file'
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            className='w-full text-sm'
          />
          <button
            onClick={upload}
            disabled={loading || !files.length}
            className='w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-60'
          >
            <Upload className='h-4 w-4' />
            {loading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}