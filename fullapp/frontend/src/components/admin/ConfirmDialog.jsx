import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 grid place-items-center bg-black/40 p-4'>
      <div className='w-full max-w-md rounded-xl bg-white p-6 shadow-xl'>
        <div className='mb-2 flex items-center gap-2'>
          <AlertTriangle className='h-5 w-5 text-red-600' />
          <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
        </div>
        {message && <p className='mt-1 text-sm text-gray-600'>{message}</p>}
        <div className='mt-6 flex justify-end gap-2'>
          <button
            onClick={onCancel}
            className='rounded-md px-4 py-2 shadow-sm hover:shadow'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}