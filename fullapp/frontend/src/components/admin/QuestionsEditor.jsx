import { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function QuestionsEditor({ value = [], onChange }) {
  const [questions, setQuestions] = useState(value);

  const commit = (next) => {
    setQuestions(next);
    onChange?.(next);
  };
  const addQuestion = () =>
    commit([
      ...questions,
      { prompt: '', options: ['', ''], correctIndex: 0, points: 1 },
    ]);
  const updateQuestion = (idx, patch) =>
    commit(questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  const removeQuestion = (idx) => commit(questions.filter((_, i) => i !== idx));

  const setOption = (qi, oi, val) => {
    const opts = [...questions[qi].options];
    opts[oi] = val;
    updateQuestion(qi, { options: opts });
  };
  const addOption = (qi) =>
    updateQuestion(qi, { options: [...questions[qi].options, ''] });
  const removeOption = (qi, oi) => {
    const opts = questions[qi].options.filter((_, i) => i !== oi);
    updateQuestion(qi, { options: opts.length < 2 ? ['', ''] : opts });
  };

  return (
    <div className='space-y-4 max-h-[52vh] overflow-y-auto pr-1'>
      <div className='flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur z-10 py-1'>
        <h3 className='text-sm font-semibold text-gray-900'>Questions</h3>
        <button
          type='button'
          onClick={addQuestion}
          className='inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-white shadow hover:bg-blue-700'
        >
          <Plus className='h-4 w-4' /> Add question
        </button>
      </div>

      {questions.length === 0 && (
        <p className='text-sm text-gray-500'>No questions yet.</p>
      )}

      {questions.map((q, qi) => (
        <div key={qi} className='rounded-xl bg-white p-4 shadow-sm'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-700'>
              <CheckCircle2 className='h-4 w-4' />
              <span className='text-xs font-medium'>Question #{qi + 1}</span>
            </div>
            <button
              type='button'
              onClick={() => removeQuestion(qi)}
              className='inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs text-white shadow hover:bg-red-700'
            >
              <Trash2 className='h-3 w-3' />
              Remove
            </button>
          </div>

          <label className='block text-xs font-medium text-gray-700 mb-1'>
            Prompt
          </label>
          <input
            value={q.prompt}
            onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
            className='mb-3 w-full rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter question text'
          />

          <div className='space-y-2'>
            <label className='block text-xs font-medium text-gray-700'>
              Options
            </label>
            {q.options.map((opt, oi) => (
              <div key={oi} className='flex items-center gap-2'>
                <input
                  type='radio'
                  name={`correct-${qi}`}
                  checked={q.correctIndex === oi}
                  onChange={() => updateQuestion(qi, { correctIndex: oi })}
                  className='h-4 w-4'
                  title='Mark as correct'
                />
                <input
                  value={opt}
                  onChange={(e) => setOption(qi, oi, e.target.value)}
                  className='flex-1 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder={`Option ${oi + 1}`}
                />
                <button
                  type='button'
                  onClick={() => removeOption(qi, oi)}
                  className='rounded-md px-2 py-1 text-xs shadow-sm hover:shadow'
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={() => addOption(qi)}
              className='rounded-md px-3 py-1.5 text-xs shadow-sm hover:shadow'
            >
              Add option
            </button>
          </div>

          <div className='mt-3'>
            <label className='block text-xs font-medium text-gray-700 mb-1'>
              Points
            </label>
            <input
              type='number'
              min={0}
              value={q.points ?? 1}
              onChange={(e) =>
                updateQuestion(qi, { points: Number(e.target.value) })
              }
              className='w-24 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      ))}
    </div>
  );
}