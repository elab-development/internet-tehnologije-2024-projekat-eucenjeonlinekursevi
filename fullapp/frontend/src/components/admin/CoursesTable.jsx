import { FilePlus2, Edit3, Trash2, ListChecks } from 'lucide-react';

export default function CoursesTable({
  items,
  onEdit,
  onDelete,
  onResources,
  onTests,
}) {
  return (
    <div className='overflow-hidden rounded-xl bg-white shadow'>
      <table className='min-w-full divide-y divide-gray-100'>
        <thead className='bg-gray-50'>
          <tr className='text-left text-sm text-gray-600'>
            <th className='px-4 py-3 font-medium'>Title</th>
            <th className='px-4 py-3 font-medium'>Published</th>
            <th className='px-4 py-3 font-medium'>Resources</th>
            <th className='px-4 py-3 font-medium'>Created</th>
            <th className='px-4 py-3 font-medium text-right'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className='px-4 py-8 text-center text-gray-500'>
                No courses found.
              </td>
            </tr>
          )}
          {items.map((c) => (
            <tr key={c._id} className='text-sm'>
              <td className='px-4 py-3 font-medium text-gray-900'>{c.title}</td>
              <td className='px-4 py-3'>
                {c.isPublished ? (
                  <span className='rounded-full bg-green-100 px-2 py-0.5 text-green-700'>
                    Yes
                  </span>
                ) : (
                  <span className='rounded-full bg-gray-100 px-2 py-0.5 text-gray-700'>
                    No
                  </span>
                )}
              </td>
              <td className='px-4 py-3 text-gray-700'>
                {c.resources?.length ?? 0}
              </td>
              <td className='px-4 py-3 text-gray-600'>
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className='px-4 py-3'>
                <div className='flex justify-end gap-2'>
                   <button
                    onClick={() => onTests(c)}
                    className='inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-gray-700 shadow-sm hover:shadow'
                    title='Manage tests'
                  >
                    <ListChecks className='h-4 w-4' />
                    Tests
                  </button>
                  <button
                    onClick={() => onResources(c)}
                    className='inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-gray-700 shadow-sm hover:shadow'
                    title='Manage resources'
                  >
                    <FilePlus2 className='h-4 w-4' />
                    Resources
                  </button>
                  <button
                    onClick={() => onEdit(c)}
                    className='inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-gray-700 shadow-sm hover:shadow'
                    title='Edit'
                  >
                    <Edit3 className='h-4 w-4' />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    className='inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-white shadow hover:bg-red-700'
                    title='Delete'
                  >
                    <Trash2 className='h-4 w-4' />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}