import { GraduationCap, Layers, Award } from 'lucide-react';
import HeroImg from '../assets/hero.png';

export default function Home() {
  return (
    <div className='space-y-12'>
      {/* Hero */}
      <section className='rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 shadow text-white'>
        <h1 className='text-3xl font-bold mb-3'>
          Welcome to the E-Learning Platform
        </h1>
        <p className='max-w-2xl text-lg'>
          A simple, modern MERN-based application for managing courses, taking
          tests, and earning certificates.
        </p>
      </section>

      <section>
        <img
          src={HeroImg}
          alt='E-Learning illustration'
          className='w-full rounded-xl'
        />
      </section>

      {/* Features */}
      <section>
        <h2 className='text-2xl font-semibold text-gray-900 mb-6 text-center'>
          What you can do here
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='rounded-xl bg-white p-6 shadow hover:shadow-lg transition-shadow'>
            <div className='flex items-center gap-3 mb-3'>
              <Layers className='h-6 w-6 text-blue-600' />
              <h3 className='text-lg font-semibold text-gray-900'>
                Browse Courses
              </h3>
            </div>
            <p className='text-gray-600 text-sm'>
              Explore available courses and view sections and resources in an
              easy-to-read format.
            </p>
          </div>

          <div className='rounded-xl bg-white p-6 shadow hover:shadow-lg transition-shadow'>
            <div className='flex items-center gap-3 mb-3'>
              <GraduationCap className='h-6 w-6 text-blue-600' />
              <h3 className='text-lg font-semibold text-gray-900'>
                Take Tests
              </h3>
            </div>
            <p className='text-gray-600 text-sm'>
              After finishing a course, test your knowledge directly within the
              app using our test runner.
            </p>
          </div>

          <div className='rounded-xl bg-white p-6 shadow hover:shadow-lg transition-shadow'>
            <div className='flex items-center gap-3 mb-3'>
              <Award className='h-6 w-6 text-blue-600' />
              <h3 className='text-lg font-semibold text-gray-900'>
                Earn Certificates
              </h3>
            </div>
            <p className='text-gray-600 text-sm'>
              Successfully passing tests automatically issues a digital
              certificate which you can view or verify.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}