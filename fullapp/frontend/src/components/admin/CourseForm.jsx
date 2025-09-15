import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import SectionsEditor from './SectionsEditor';

export default function CourseForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [isPublished, setIsPublished] = useState(!!initialData?.isPublished);
  const [sections, setSections] = useState(initialData?.sections || []);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initialData?._id);

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setIsPublished(!!initialData?.isPublished);
    setSections(initialData?.sections || []);
  }, [initialData]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ title, description, isPublished, sections });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className='space-y-6'>
      {/* Details */}
      <div className='rounded-xl bg-white p-4 shadow-sm'>
        <h3 className='mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900'>
          <FileText className='h-4 w-4' />
          Details
        </h3>

        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className='mb-3 w-full rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className='mb-3 w-full rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <label className='inline-flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className='h-4 w-4'
          />
          Published
        </label>
      </div>

      {/* Text Sections */}
      <div className='rounded-xl bg-white p-4 shadow-sm'>
        <SectionsEditor value={sections} onChange={setSections} />
      </div>

      <div className='flex justify-end gap-2'>
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
          {isEdit ? 'Save changes' : 'Create course'}
        </button>
      </div>
    </form>
  );
}