export default function AdminPageHeader({ title, ctaLabel, onCta }) {
  return (
    <div className='mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
      <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
      {ctaLabel && (
        <button
          onClick={onCta}
          className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700'
        >
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 4v16m8-8H4'
            />
          </svg>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}