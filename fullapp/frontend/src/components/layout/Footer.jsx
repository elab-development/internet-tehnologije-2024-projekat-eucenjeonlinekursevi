export default function Footer() {
  return (
    <footer className='mt-auto bg-white'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-500 flex justify-between'>
        <p>© {new Date().getFullYear()} eLearn</p>
        <p className='hidden sm:block'>Built with MERN</p>
      </div>
    </footer>
  );
}