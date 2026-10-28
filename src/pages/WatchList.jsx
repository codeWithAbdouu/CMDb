import {useEffect} from "react";
import {Link} from "react-router-dom";
import {Bookmark, CircleX} from "lucide-react";

import MovieCard from "@/components/cutomeUI/MovieCard.jsx";
import EmptyState from "@/components/cutomeUI/EmptyState.jsx";
import PageHeader from "@/components/Layouts/PageHeader.jsx";
import {Button} from "@/components/ui/button";

import {useWatchlists} from "@/hooks/watchlist/useWatchlists.js";
import {useAuth} from "@/context/AuthContext.jsx";
import {Spinner} from "@/components/ui/spinner.jsx";

function WatchlistPage() {
    useEffect(() => {
        document.title = "Watchlist · OMDb+";
    }, []);

    const {user} = useAuth();

    const {
        data: watchlists,
        isLoading,
        error,
    } = useWatchlists();

    if (!user) {
        return (
            <div className="container-page mt-8 pb-16">
                <PageHeader
                    title="Watchlist"
                    subtitle="Things to watch next."
                />

                <EmptyState
                    title="Sign in to use the watchlist"
                    action={
                        <Button asChild>
                            <Link to="/auth">Sign in</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={"min-h-screen w-full flex justify-center items-center"}>
                <Spinner className={"size-16"} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-page mt-8 pb-16">
                <PageHeader
                    title="Watchlist"
                    subtitle="Things to watch next."
                />

                <EmptyState
                    title="Failed to load watchlist."
                    icon={<CircleX className="h-8 w-8"/>}
                />
            </div>
        )
    }

    const items = watchlists?.data?.data ?? [];

    if (items.length === 0) {
        return (
            <div className="container-page mt-8 pb-16">
                <PageHeader
                    title="Watchlist"
                    subtitle="Things to watch next."
                />

                <EmptyState
                    icon={<Bookmark className="h-8 w-8"/>}
                    title="Your watchlist is empty"
                    action={
                        <Button asChild>
                            <Link to="/search">Find something</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="container-page mt-8 pb-16">
            <PageHeader
                title="Watchlist"
                subtitle="Things to watch next."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {items.map((item) => (
                    <MovieCard
                        omdbId={item.tmdbId}
                        className={"w-full"}
                    />
                ))}
            </div>
        </div>
    );
}

export default WatchlistPage;