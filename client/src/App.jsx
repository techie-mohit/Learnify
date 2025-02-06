
import Login from './pages/Login';
import HeroSection from './pages/student/HeroSection';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layout/mainLayout';
import Courses from './pages/student/Courses';
import MyLearning from './pages/student/MyLearning';
import Profile from './pages/student/Profile';
import Sidebar from './pages/admin/Sidebar';
import DashBoard from './pages/admin/DashBoard';
import CourseTable from './pages/admin/course/CourseTable';
import AddCourse from './pages/admin/course/AddCourse';
import EditCourse from './pages/admin/course/EditCourse';
import CreateLecture from './pages/admin/lecture/CreateLecture';
import EditLecture from './pages/admin/lecture/EditLecture';
import CourseDetail from './pages/student/CourseDetail';
import CourseProgress from './pages/student/CourseProgress';
import SearchPage from './pages/student/SearchPage';
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes';
import PurchaseCourseProtectedRoute from './components/PurchasedCourseProtectedRoute';
import { ThemeProvider } from './components/ThemeProvider';


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>

        ),
      },
      {
        path: "login",
        element: (
          <>
            <AuthenticatedUser><Login /></AuthenticatedUser>
          </>
        )

      },
      {
        path: "myLearning",
        element: <ProtectedRoute><MyLearning /></ProtectedRoute>

      },
      {
        path: "editProfile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>

      },
      {
        path: "course/search",
        element: <ProtectedRoute><SearchPage /></ProtectedRoute>

      },
      {
        path: "course-detail/:courseId",
        element: <ProtectedRoute><CourseDetail /></ProtectedRoute>

      },
      {
        path: "course-progress/:courseId",
        element: <ProtectedRoute><PurchaseCourseProtectedRoute><CourseProgress/></PurchaseCourseProtectedRoute></ProtectedRoute>

      },
      {
        path: "admin",
        element: <AdminRoute><Sidebar /></AdminRoute>,
        children: [
          {
            path: "dashBoard",
            element: <DashBoard />
          },
          {
            path: "course",
            element: <CourseTable />
          },
          {
            path:"course/create",
            element:<AddCourse/>
          },
          {
            path:"course/:courseId",
            element:<EditCourse/>
          },
          {
            path:"course/:courseId/lecture",
            element:<CreateLecture/>
          },
          {
            path:"course/:courseId/lecture/:lectureId",
            element:<EditLecture/>
          },
        ]
      }
    ],

  }
])

const App = () => {
  return (
    <main>
      <ThemeProvider>
          <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
