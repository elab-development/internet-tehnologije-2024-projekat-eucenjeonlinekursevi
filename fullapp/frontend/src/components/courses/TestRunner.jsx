import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import Modal from '../common/Modal';

export default function TestRunner({ testId, open, onClose, onPassed }) {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]); // number | null per question
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState(null); // { passed, score, totalPoints, certificate? }

  useEffect(() => {
    if (!open || !testId) return;
    (async () => {
      setLoading(true);
      setErr('');
      setResult(null);
      try {
        const data = await api.tests.get(testId); // sanitized for user (no correctIndex)
        const t = data?.test || data; // controller returns { test }
        setTest(t);
        setAnswers((t.questions || []).map(() => null));
      } catch (e) {
        setErr(e.message || 'Failed to load test');
      } finally {
        setLoading(false);
      }
    })();
  }, [open, testId]);

  const choose = (qi, idx) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = idx;
      return next;
    });
  };

  const canSubmit = test && answers.every((a) => a !== null);

  const submit = async () => {
    if (!test?._id) return;
    setSubmitting(true);
    setErr('');
    try {
      const resp = await api.tests.submit(test._id, answers);
      setResult(resp);
      if (resp?.passed && onPassed) onPassed(resp.certificate || null, resp);
    } catch (e) {
      setErr(e.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const footer = result ? (
    <div className='flex items-center justify-between'>
      <div
        className={`text-sm ${
          result.passed ? 'text-emerald-700' : 'text-rose-700'
        }`}
      >
        {result.passed ? 'Passed!' : 'Not passed'} — Score:{' '}
        <b>{result.score}</b> / {result.totalPoints}
      </div>
      <button
        onClick={onClose}
        className='rounded-md px-4 py-2 shadow-sm hover:shadow'
      >
        Close
      </button>
    </div>
  ) : (
    <div className='flex items-center justify-end gap-2'>
      <button
        onClick={onClose}
        className='rounded-md px-4 py-2 shadow-sm hover:shadow'
      >
        Cancel
      </button>
      <button
        disabled={!canSubmit || submitting}
        onClick={submit}
        className='rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-60'
      >
        {submitting ? 'Submitting…' : 'Submit answers'}
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={test?.title || 'Test'}
      footer={footer}
    >
      {loading ? (
        <div className='grid place-items-center h-40 text-gray-600'>
          Loading…
        </div>
      ) : err ? (
        <div className='rounded-md bg-red-50 px-4 py-3 text-red-700 shadow-sm'>
          {err}
        </div>
      ) : (
        <div className='space-y-5'>
          {test?.durationMinutes ? (
            <div className='text-sm text-gray-600'>
              Duration: {test.durationMinutes} min • Passing:{' '}
              {test.passingScorePercent}% • Total: {test.totalPoints}
            </div>
          ) : (
            <div className='text-sm text-gray-600'>
              Passing: {test.passingScorePercent}% • Total: {test.totalPoints}
            </div>
          )}

          <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-1'>
            {(test?.questions || []).map((q, qi) => (
              <div key={qi} className='rounded-xl bg-white p-4 shadow-sm'>
                <p className='font-medium text-gray-900 mb-2'>
                  {qi + 1}. {q.prompt}
                </p>
                <div className='space-y-2'>
                  {q.options.map((opt, oi) => (
                    <label key={oi} className='flex items-center gap-2 text-sm'>
                      <input
                        type='radio'
                        className='h-4 w-4'
                        name={`q-${qi}`}
                        checked={answers[qi] === oi}
                        onChange={() => choose(qi, oi)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {result?.certificate?.certificateId && (
            <div className='rounded-xl bg-emerald-50 p-4 shadow-sm'>
              <p className='font-semibold text-emerald-800'>
                🎉 Certificate issued!
              </p>
              <p className='text-sm text-emerald-700'>
                ID: <b>{result.certificate.certificateId}</b>
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}