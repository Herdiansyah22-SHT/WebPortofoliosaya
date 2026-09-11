import { Suspense, lazy } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { GuestRoute, ProtectedRoute } from './routes/ProtectedRoute'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import { Skeleton } from './components/ui'

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Home = lazy(() => import('./pages/public/Home'))
const About = lazy(() => import('./pages/public/About'))
const Skills = lazy(() => import('./pages/public/Skills'))
const Projects = lazy(() => import('./pages/public/Projects'))
const ProjectDetail = lazy(() => import('./pages/public/ProjectDetail'))
const Experience = lazy(() => import('./pages/public/Experience'))
const Education = lazy(() => import('./pages/public/Education'))
const Certificates = lazy(() => import('./pages/public/Certificates'))
const Blog = lazy(() => import('./pages/public/Blog'))
const BlogDetail = lazy(() => import('./pages/public/BlogDetail'))
const Contact = lazy(() => import('./pages/public/Contact'))

const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Media = lazy(() => import('./pages/admin/Media'))
const Messages = lazy(() => import('./pages/admin/Messages'))
const Seo = lazy(() => import('./pages/admin/Seo'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const Profile = lazy(() => import('./pages/admin/Profile').then((m) => ({ default: m.Profile })))
const AdminProjects = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.Projects })))
const AdminSkills = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.Skills })))
const AdminExperience = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.Experience })))
const AdminEducation = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.Education })))
const AdminCertificates = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.Certificates })))
const AdminBlog = lazy(() => import('./pages/admin/ContentPages').then((m) => ({ default: m.Blog })))
const AdminCategories = lazy(() => import('./pages/admin/TaxonomyPages').then((m) => ({ default: m.Categories })))
const AdminTags = lazy(() => import('./pages/admin/TaxonomyPages').then((m) => ({ default: m.Tags })))

function Notfound() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-blue-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-slate-600">Halaman yang kamu cari tidak ada atau telah dipindahkan.</p>
      <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-slate-900 transition-colors hover:bg-blue-700">
        Kembali ke Home
      </Link>
    </section>
  )
}

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-64" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="experience" element={<Experience />} />
          <Route path="education" element={<Education />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route
          path="/admin/login"
          element={
            <GuestRoute>
              <AdminLogin />
            </GuestRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="media" element={<Media />} />
          <Route path="messages" element={<Messages />} />
          <Route path="seo" element={<Seo />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Notfound />} />
      </Routes>
    </Suspense>
  )
}