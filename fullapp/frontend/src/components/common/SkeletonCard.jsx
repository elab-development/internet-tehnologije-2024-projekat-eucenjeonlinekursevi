export default function SkeletonCard() {
  return (
    <div className='rounded-xl bg-white shadow overflow-hidden animate-pulse'>
      <div className='h-40 bg-gray-200' />
      <div className='p-4 space-y-2'>
        <div className='h-4 bg-gray-200 rounded w-2/3' />
        <div className='h-3 bg-gray-200 rounded w-1/3' />
        <div className='h-3 bg-gray-200 rounded w-1/2' />
      </div>
    </div>
  );
}