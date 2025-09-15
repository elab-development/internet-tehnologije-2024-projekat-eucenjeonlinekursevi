import { useEffect, useState } from 'react';
import { Timer, Award } from 'lucide-react';
import QuestionsEditor from './QuestionsEditor';

export default function TestForm({
  initialData,
  courseId,
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [questions, setQuestions] = useState(initialData?.questions || []);
  const [passingScorePercent, setPassingScorePercent] = useState(
    initialData?.passingScorePercent ?? 60
  );
  const [durationMinutes, setDurationMinutes] = useState(
    initialData?.durationMinutes ?? 0
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(initialData?.title || '');
    setQuestions(initialData?.questions || []);
    setPassingScorePercent(initialData?.passingScorePercent ?? 60);
    setDurationMinutes(initialData?.durationMinutes ?? 0);
    setIsActive(initialData?.isActive ?? true);
  }, [initialData]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        course: courseId,
        title,
        questions,
        passingScorePercent,
        durationMinutes,
        isActive,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className='space-y-6 max-h-[70vh] overflow-y-auto pr-1'
    >
      <div className='rounded-xl bg-white p-4 shadow-sm sticky top-0 z-10'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className='mb-3 w-full rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <div className='rounded-lg p-3 shadow-sm'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-1'>
              <Award className='h-4 w-4' /> Passing %
            </label>
            <input
              type='number'
              min={0}
              max={100}
              value={passingScorePercent}
              onChange={(e) => setPassingScorePercent(Number(e.target.value))}
              className='w-full rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className='rounded-lg p-3 shadow-sm'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-1'>
              <Timer className='h-4 w-4' /> Duration (min, 0 = unlimited)
            </label>
            <input
              type='number'
              min={0}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className='w-full rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className='flex items-end'>
            <label className='inline-flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className='h-4 w-4'
              />
              Active
            </label>
          </div>
        </div>
      </div>

      <div className='rounded-xl bg-white p-4 shadow-sm'>
        <QuestionsEditor value={questions} onChange={setQuestions} />
      </div>

      <div className='flex justify-end gap-2 sticky bottom-0 bg-white/80 backdrop-blur p-2 rounded-lg shadow-sm'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-md px-4 py-2 shadow-sm hover:shadow'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={saving}
          className='rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-60'
        >
          {initialData?._id ? 'Save changes' : 'Create test'}
        </button>
      </div>
    </form>
  );
}