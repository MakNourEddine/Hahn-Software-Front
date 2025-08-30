import {useEffect} from "react";
import {createBrowserRouter, RouterProvider, Link, Outlet, NavLink} from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import NotFound from "./pages/NotFound";
import {useSettingsStore} from "./store/settings";

const router = createBrowserRouter([
    {path: "/", element: <Shell/>, children: [{index: true, element: <BookingPage/>}]},
    {path: "*", element: <NotFound/>},
]);

export default function App() {
    return <RouterProvider router={router}/>;
}

function Shell() {
    const api = import.meta.env.VITE_API_URL;

    const hydrate = useSettingsStore((s) => s.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return (
        <div className="mx-auto max-w-5xl p-6 space-y-6">
            <header className="flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold">🦷 Dentist Booking</Link>
                <span className="text-sm text-slate-400">API: <code className="text-sky-400">{api}</code></span>
            </header>

            <nav className="flex gap-3 text-sm">
                <NavLink to="/" end
                         className={({isActive}) => isActive ? "text-sky-400" : "text-slate-300 hover:text-slate-100"}>
                    Booking
                </NavLink>
            </nav>

            <Outlet/>
        </div>
    );
}
