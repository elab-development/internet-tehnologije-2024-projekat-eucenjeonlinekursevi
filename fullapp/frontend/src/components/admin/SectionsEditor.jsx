import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function SectionsEditor({ value = [], onChange }) {
  const [sections, setSections] = useState(value);

  const commit = (next) => {
    setSections(next);
    onChange?.(next);
  };

  const add = () => commit([...sections, { title: '', content: '' }]);

  const update = (idx, patch) => {
    const next = sections.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    commit(next);
  };

  const remove = (idx) => {
    const next = sections.filter((_, i) => i !== idx);
    commit(next);
  };

  const move = (from, to) => {
    if (to < 0 || to >= sections.length) return;
    const copy = [...sections];
    const [spliced] = copy.splice(from, 1);
    copy.splice(to, 0, spliced);
    commit(copy);
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-gray-900'>Text Sections</h3>
        <button
          type='button'
          onClick={add}
          className='inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-white shadow hover:bg-blue-700'
        >
          <Plus className='h-4 w-4' /> Add section
        </button>
      </div>

      {sections.length === 0 && (
        <p className='text-sm text-gray-500'>No sections yet.</p>
      )}

      {sections.map((sec, i) => (
        <div key={i} className='rounded-lg bg-white p-3 shadow-sm'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-2 text-gray-500'>
              <GripVertical className='h-4 w-4' />
              <span className='text-xs'>#{i + 1}</span>
            </div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => move(i, i - 1)}
                className='rounded-md px-2 py-1 text-xs shadow-sm hover:shadow'
              >
                Up
              </button>
              <button
                type='button'
                onClick={() => move(i, i + 1)}
                className='rounded-md px-2 py-1 text-xs shadow-sm hover:shadow'
              >
                Down
              </button>
              <button
                type='button'
                onClick={() => remove(i)}
                className='inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs text-white shadow hover:bg-red-700'
                title='Remove'
              >
                <Trash2 className='h-3 w-3' />
                Remove
              </button>
            </div>
          </div>

          <label className='block text-xs font-medium text-gray-700 mb-1'>
            Title
          </label>
          <input
            value={sec.title}
            onChange={(e) => update(i, { title: e.target.value })}
            className='mb-2 w-full rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Section title'
          />

          <label className='block text-xs font-medium text-gray-700 mb-1'>
            Content
          </label>
          <textarea
            value={sec.content}
            onChange={(e) => update(i, { content: e.target.value })}
            rows={4}
            className='w-full rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Markdown or plain text'
          />
        </div>
      ))}
    </div>
  );
}