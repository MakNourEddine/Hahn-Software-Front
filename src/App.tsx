import {createBrowserRouter, RouterProvider, Link, Outlet, NavLink} from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import NotFound from './pages/NotFound';
import DentistsPage from './pages/admin/DentistsPage';
import PatientsPage from './pages/admin/PatientsPage';
import ServicesPage from './pages/admin/ServicesPage';

const router = createBrowserRouter([
    {
        path: '/', element: <Shell/>, children: [
            {index: true, element: <BookingPage/>},
            {path: 'admin/dentists', element: <DentistsPage/>},
            {path: 'admin/patients', element: <PatientsPage/>},
            {path: 'admin/services', element: <ServicesPage/>},
        ]
    },
    {path: '*', element: <NotFound/>},
]);

function Shell() {
    const api = import.meta.env.VITE_API_URL;

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="mx-auto w-full max-w-6xl p-6 space-y-6">
                <header className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold">🦷 Dentist Booking</Link>
                    <span className="text-sm text-slate-400">API: <code className="text-sky-400">{api}</code></span>
                </header>

                <nav className="flex gap-4 text-sm">
                    <NavLink to="/" end
                             className={({isActive}) => isActive ? 'text-sky-400' : 'text-slate-300 hover:text-slate-100'}>Booking</NavLink>
                    <NavLink to="/admin/dentists"
                             className={({isActive}) => isActive ? 'text-sky-400' : 'text-slate-300 hover:text-slate-100'}>Dentists</NavLink>
                    <NavLink to="/admin/patients"
                             className={({isActive}) => isActive ? 'text-sky-400' : 'text-slate-300 hover:text-slate-100'}>Patients</NavLink>
                    <NavLink to="/admin/services"
                             className={({isActive}) => isActive ? 'text-sky-400' : 'text-slate-300 hover:text-slate-100'}>Services</NavLink>
                </nav>

                <Outlet/>
            </div>
        </div>
    );
}

export default function App() {
    return <RouterProvider router={router}/>;
}
