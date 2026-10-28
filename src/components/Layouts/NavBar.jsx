import {useEffect, useState} from "react";
import {Link, NavLink, useNavigate, useLocation} from "react-router-dom";
import {
    Film,
    Search,
    Heart,
    Bookmark,
    User,
    Settings as SettingsIcon,
    Sun,
    Moon,
    LogOut,
    Menu,
    X,
    Command,
} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import {useTheme} from "next-themes";
import {useAuth} from "@/context/AuthContext.jsx";
import {useLogout} from "@/hooks/user/useLogout.js";

const NAV = [
    {to: "/", label: "Home", icon: Film},
    {to: "/search", label: "Search", icon: Search},
    {to: "/watchlist", label: "Watchlist", icon: Bookmark},
    {to: "/favorites", label: "Favorites", icon: Heart},
];

export default function Navbar() {
    const {theme, setTheme} = useTheme();
    const {pathname} = useLocation();
    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);

    const {
        mutateAsync: logout,
        isPending: isLoggingOut,
    } = useLogout();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const setCommandOpen = (value) => {
        console.log("command", value);
    };

    const {
        user,
        isLoading,
    } = useAuth();

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                navigate("/search");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            console.error("LOGOUT ERROR:", err);
        }
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="container-page flex h-16 items-center gap-2">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 font-display text-xl font-bold"
                >
                    <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
                        <Film className="h-4 w-4"/>
                    </span>

                    CMDb<span className="text-primary">+</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="ml-6 hidden items-center gap-1 md:flex">
                    {NAV.map((n) => (
                        <NavLink
                            key={n.to}
                            to={n.to}
                            end={n.to === "/"}
                            className={({isActive}) =>
                                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                                    isActive
                                        ? "bg-muted text-foreground"
                                        : "text-muted-foreground"
                                }`
                            }
                        >
                            {n.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2">

                    {/* Desktop Search */}
                    <Link to="/search">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden gap-2 md:flex"
                        >
                            <Search className="h-4 w-4"/>

                            <span className="text-muted-foreground">
                                Search…
                            </span>

                            <kbd
                                className="ml-2 inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground"
                            >
                                <Command className="h-3 w-3"/>
                                K
                            </kbd>
                        </Button>
                    </Link>

                    {/* Mobile Search */}
                    <Link to={"search"}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setCommandOpen(true)}
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4"/>
                        </Button>
                    </Link>

                    {/* Theme */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="h-4 w-4"/>
                        ) : (
                            <Moon className="h-4 w-4"/>
                        )}
                    </Button>

                    {/* Authentication */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Account"
                                >
                                    <div
                                        className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                                    >
                                        {user?.name?.slice(0, 1).toUpperCase() || "U"}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-56"
                            >
                                <DropdownMenuLabel
                                    className="text-sm font-semibold text-black"
                                >
                                    @{user?.name || "user"}
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator/>

                                {/* Profile */}
                                <DropdownMenuItem
                                    onClick={() =>
                                        navigate("/profile/")
                                    }
                                >
                                    <User className="mr-2 h-4 w-4"/>
                                    Profile
                                </DropdownMenuItem>

                                {/* Settings */}
                                <DropdownMenuItem
                                    onClick={() => navigate("/settings")}
                                >
                                    <SettingsIcon className="mr-2 h-4 w-4"/>
                                    Settings
                                </DropdownMenuItem>

                                <DropdownMenuSeparator/>

                                {/* Logout */}
                                <DropdownMenuItem
                                    disabled={isLoggingOut}
                                    onClick={handleLogout}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4"/>

                                    {isLoggingOut
                                        ? "Signing out..."
                                        : "Sign out"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/auth">
                            <Button size="sm">
                                Sign in
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Menu */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        {mobileOpen ? (
                            <X className="h-4 w-4"/>
                        ) : (
                            <Menu className="h-4 w-4"/>
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileOpen && (
                <div className="border-t border-border md:hidden">
                    <nav className="container-page flex flex-col py-2">
                        {NAV.map((n) => (
                            <NavLink
                                key={n.to}
                                to={n.to}
                                end={n.to === "/"}
                                className={({isActive}) =>
                                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${
                                        isActive
                                            ? "bg-muted text-foreground"
                                            : "text-muted-foreground"
                                    }`
                                }
                            >
                                <n.icon className="h-4 w-4"/>
                                {n.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}