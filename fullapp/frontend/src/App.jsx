import { Routes, Route, BrowserRouter } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import PublicOnlyRoute from './routes/PublicOnlyRoute';
import Layout from './components/layout/Layout';

import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import AdminCourses from './pages/admin/AdminCourses';
import AdminDashboard from './pages/admin/AdminDashboard';

import Login from './pages/Login';
import Register from './pages/Register';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/courses/:id' element={<CourseDetails />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/admin/courses' element={<AdminCourses />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}