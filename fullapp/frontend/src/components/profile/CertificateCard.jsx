import { Award, CalendarDays, GraduationCap, ExternalLink } from 'lucide-react';

export default function CertificateCard({ cert }) {
  const courseTitle = cert?.course?.title || 'Course';
  const issued = cert?.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString()
    : '—';
  const certId = cert?.certificateId;
  const verifyUrl = certId ? `/api/certificates/${certId}` : '#';

  return (
    <div className='rounded-xl bg-white p-4 shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-2'>
          <Award className='h-5 w-5 text-emerald-600' />
          <h4 className='font-semibold text-gray-900'>{courseTitle}</h4>
        </div>
        {certId && (
          <a
            href={verifyUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 text-xs text-blue-700 hover:underline'
            title='Open public verification'
          >
            View <ExternalLink className='h-3.5 w-3.5' />
          </a>
        )}
      </div>

      <div className='mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700'>
        <div className='inline-flex items-center gap-2'>
          <GraduationCap className='h-4 w-4 text-gray-500' />
          <span className='truncate'>
            ID: <b className='font-mono'>{certId || '—'}</b>
          </span>
        </div>
        <div className='inline-flex items-center gap-2'>
          <CalendarDays className='h-4 w-4 text-gray-500' />
          <span>Issued: {issued}</span>
        </div>
        <div className='inline-flex items-center gap-2'>
          <span className='text-gray-500'>Score:</span>
          <span>{cert?.score ?? 0}</span>
        </div>
      </div>
    </div>
  );
}