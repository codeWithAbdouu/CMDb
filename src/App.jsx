import {createBrowserRouter, RouterProvider} from "react-router-dom";

import "./App.css"

import {ThemeProvider} from "@/components/ui/theme-provider.jsx";
import {AuthProvider} from "@/context/AuthContext.jsx";

// Import Components
import Error from "./pages/Error.jsx";
import Layout from "@/pages/Layout.jsx";
import Home from "@/pages/Home.jsx";
import Search from "@/pages/Search.jsx";
import WatchlistPage from "@/pages/WatchList.jsx";
import FavoritesPage from "@/pages/Favorites.jsx";
import SettingsPage from "@/pages/Settings.jsx";
import ProfilePage from "@/pages/Profile.jsx";
import AuthPage from "@/pages/Auth.jsx";
import TitlePage from "@/pages/TitlePage.jsx";
import PageNotFound from "@/pages/PageNotFound.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";
import ForgotPassword from "@/pages/ForgotPassword.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,

        children: [
            {
                index: true,
                element: <Home/>,
                errorElement: <Error/>,
            },

            {
                path: "search",
                element: <Search/>,
                errorElement: <Error/>,
            },
            {
                path: "watchlist",
                element: <WatchlistPage/>,
                errorElement: <Error/>,
            },
            {
                path: "favorites",
                element: <FavoritesPage/>,
                errorElement: <Error/>,
            },
            {
                path: "auth",
                element: <AuthPage/>,
                errorElement: <Error/>,
            },
            {
                path: "settings",
                element: <SettingsPage/>,
                errorElement: <Error/>,
            },
            {
                path: "reset-password/:token",
                element: <ResetPassword/>,
                errorElement: <Error/>,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>,
                errorElement: <Error/>,
            },
            {
                path: "profile",
                element: <ProfilePage/>,
                errorElement: <Error/>,
            },
            {
                path: "title/:omdbId",
                element: <TitlePage/>,
                errorElement: <Error/>,
            },
            {
                path: "*",
                element: <PageNotFound/>,
                errorElement: <Error/>,
            }
        ],
    },
]);

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;

