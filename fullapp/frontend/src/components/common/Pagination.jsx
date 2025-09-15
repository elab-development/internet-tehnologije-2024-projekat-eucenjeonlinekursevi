export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;

  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(pages, page + 1));

  return (
    <div className='mt-4 flex items-center justify-between'>
      <button
        onClick={prev}
        disabled={page === 1}
        className='rounded-md px-3 py-1.5 text-sm shadow-sm hover:shadow disabled:opacity-50'
      >
        Prev
      </button>
      <span className='text-sm text-gray-600'>
        Page {page} of {pages}
      </span>
      <button
        onClick={next}
        disabled={page === pages}
        className='rounded-md px-3 py-1.5 text-sm shadow-sm hover:shadow disabled:opacity-50'
      >
        Next
      </button>
    </div>
  );
}