import {Outlet} from "react-router-dom";
import NavBar from "#src/components/Layouts/NavBar.jsx";
import { Toaster } from "sonner";

function Layout() {

    return (
        <div className="min-h-screen bg-background text-foreground font-Inter">
            <NavBar/>
            <main className="pb-16">
                <Outlet/>
            </main>
            <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
                OMDb+ · Frontend demo · Data from{" "}
                <a
                    className="underline hover:text-foreground"
                    href="https://www.omdbapi.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    OMDb API
                </a>
            </footer>
            <Toaster position="top-right" richColors />
        </div>
    )
}

export default Layout;
