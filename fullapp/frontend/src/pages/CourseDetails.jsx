import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import TestRunner from '../components/courses/TestRunner';
import { FileText, Download } from 'lucide-react';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [runTestId, setRunTestId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const c = await api.courses.get(id);
        setCourse(c?.course || c); // in case controller returns { course }
        const t = await api.tests.listByCourse({ courseId: id, all: false });
        setTests(t?.items || []);
      } catch (e) {
        setErr(e.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onPassed = (certificate, result) => {
    const cid = certificate?.certificateId;
    setSuccessMsg(
      cid ? `Success! Certificate ID: ${cid}` : 'Success! Certificate issued.'
    );
  };

  return (
    <div>
      <div className='mb-6 flex items-center gap-3'>
        <button
          onClick={() => navigate(-1)}
          className='rounded-md px-3 py-2 text-sm shadow-sm hover:shadow'
        >
          ← Back
        </button>
        <h1 className='text-2xl font-bold text-gray-900'>Course details</h1>
      </div>

      {loading ? (
        <div className='grid place-items-center h-40 text-gray-600'>
          Loading…
        </div>
      ) : err ? (
        <div className='rounded-md bg-red-50 px-4 py-3 text-red-700 shadow-sm'>
          {err}
        </div>
      ) : !course ? (
        <div className='text-gray-600'>Course not found.</div>
      ) : (
        <div className='space-y-8'>
          {/* Header */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <h2 className='text-xl font-semibold text-gray-900'>
              {course.title}
            </h2>
            {course.description && (
              <p className='mt-2 text-gray-700'>{course.description}</p>
            )}
          </div>

          {/* Sections */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Sections
            </h3>
            {!course.sections || course.sections.length === 0 ? (
              <p className='text-gray-600 text-sm'>No sections.</p>
            ) : (
              <ol className='space-y-4'>
                {course.sections.map((s, i) => (
                  <li key={i} className='rounded-lg bg-white p-4 shadow-sm'>
                    <div className='flex items-center gap-2 mb-2'>
                      <FileText className='h-4 w-4 text-gray-600' />
                      <p className='font-medium text-gray-900'>{s.title}</p>
                    </div>
                    <div className='text-gray-700 whitespace-pre-wrap'>
                      {s.content}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Resources */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Resources
            </h3>
            {!course.resources || course.resources.length === 0 ? (
              <p className='text-gray-600 text-sm'>No resources.</p>
            ) : (
              <ul className='space-y-2'>
                {course.resources.map((r) => (
                  <li
                    key={r.url}
                    className='flex items-center justify-between rounded-md px-3 py-2 shadow-sm'
                  >
                    <div className='truncate'>
                      <p className='font-medium text-gray-900 truncate'>
                        {r.name}
                      </p>
                      <p className='text-xs text-gray-600'>
                        {r.mimeType} • {(r.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <a
                      href={r.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-gray-700 shadow-sm hover:shadow'
                    >
                      <Download className='h-4 w-4' /> Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tests */}
          <div className='rounded-xl bg-white p-6 shadow'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Tests</h3>
            {tests.length === 0 ? (
              <p className='text-gray-600 text-sm'>No tests available.</p>
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
                        {t.isActive ? 'Active' : 'Inactive'} • total:{' '}
                        {t.totalPoints} • pass: {t.passingScorePercent}%
                        {t.durationMinutes
                          ? ` • duration: ${t.durationMinutes} min`
                          : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setRunTestId(t._id)}
                      className='rounded-md bg-blue-600 px-3 py-1.5 text-white shadow hover:bg-blue-700 disabled:opacity-60'
                      disabled={!t.isActive}
                    >
                      Start
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {successMsg && (
            <div className='rounded-xl bg-emerald-50 p-4 shadow'>
              <p className='text-emerald-800'>{successMsg}</p>
            </div>
          )}
        </div>
      )}

      {/* Test Runner Modal */}
      <TestRunner
        testId={runTestId}
        open={!!runTestId}
        onClose={() => setRunTestId(null)}
        onPassed={onPassed}
      />
    </div>
  );
}