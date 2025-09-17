export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/40 p-4'>
      <div className='w-full max-w-3xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between px-6 py-4 sticky top-0 bg-white/90 backdrop-blur rounded-t-xl'>
          <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          <button
            onClick={onClose}
            className='rounded-md px-2 py-1 shadow-sm hover:shadow'
            aria-label='Close'
          >
            ✕
          </button>
        </div>
        <div className='px-6 pb-6 pt-2'>{children}</div>
        {footer && (
          <div className='px-6 py-4 sticky bottom-0 bg-white/90 backdrop-blur rounded-b-xl'>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}