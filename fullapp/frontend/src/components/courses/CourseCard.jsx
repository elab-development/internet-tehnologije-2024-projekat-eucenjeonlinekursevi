import { useEffect, useState } from 'react';
import { getPexelsThumb } from '../../utils/pexels';
import { FileText, Layers, Award } from 'lucide-react';

function gradientFromTitle(title = '') {
  const colors = [
    ['from-blue-500', 'to-indigo-600'],
    ['from-emerald-500', 'to-teal-600'],
    ['from-rose-500', 'to-pink-600'],
    ['from-amber-500', 'to-orange-600'],
    ['from-sky-500', 'to-cyan-600'],
    ['from-violet-500', 'to-fuchsia-600'],
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++)
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  return colors[hash % colors.length];
}

export default function CourseCard({ course, onOpen, certified = false }) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const src = await getPexelsThumb(course.title);
      if (alive) setImg(src);
    })();
    return () => {
      alive = false;
    };
  }, [course.title]);

  const [from, to] = gradientFromTitle(course.title);

  const handleClick = () => {
    if (certified) return;
    onOpen?.(course);
  };

  return (
    <div className='relative'>
      {/* Certified ribbon */}
      {certified && (
        <div className='absolute left-2 top-2 z-10 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white shadow'>
          <span className='inline-flex items-center gap-1'>
            <Award className='h-3.5 w-3.5' />
            Certified
          </span>
        </div>
      )}

      <button
        onClick={handleClick}
        className={[
          'text-left w-full rounded-xl bg-white shadow transition-shadow overflow-hidden',
          certified ? 'cursor-not-allowed opacity-90' : 'hover:shadow-lg',
        ].join(' ')}
        disabled={certified}
        title={
          certified
            ? 'You already have a certificate for this course'
            : undefined
        }
      >
        {/* Image / gradient */}
        {img ? (
          <img
            src={img}
            alt={course.title}
            className='h-40 w-full object-cover'
            loading='lazy'
          />
        ) : (
          <div className={`h-40 w-full bg-gradient-to-br ${from} ${to}`} />
        )}

        {/* Body */}
        <div className='p-4'>
          <h3 className='text-lg font-semibold text-gray-900 line-clamp-1'>
            {course.title}
          </h3>
          <p className='mt-1 text-sm text-gray-600 line-clamp-2'>
            {course.description || 'No description.'}
          </p>

          {/* Meta */}
          <div className='mt-3 flex items-center gap-4 text-sm text-gray-600'>
            <span className='inline-flex items-center gap-1'>
              <Layers className='h-4 w-4' /> {course.sections?.length ?? 0}{' '}
              sections
            </span>
            <span className='inline-flex items-center gap-1'>
              <FileText className='h-4 w-4' /> {course.resources?.length ?? 0}{' '}
              resources
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}