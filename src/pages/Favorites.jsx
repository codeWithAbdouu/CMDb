import {useEffect} from "react";
import {Link} from "react-router-dom";
import {CircleX, Heart} from "lucide-react";

import MovieCard from "@/components/cutomeUI/MovieCard.jsx";
import EmptyState from "@/components/cutomeUI/EmptyState.jsx";
import PageHeader from "@/components/Layouts/PageHeader.jsx";
import {Button} from "@/components/ui/button";

import {useFavorites} from "@/hooks/favorites/useFavorites.js";
import {useAuth} from "@/context/AuthContext.jsx";
import {Spinner} from "@/components/ui/spinner.jsx";

function FavoritesPage() {
    useEffect(() => {
        document.title = "Favorites · OMDb+";
    }, []);

    const {user} = useAuth();

    const {
        data: favorites,
        isLoading,
        error,
    } = useFavorites();

    if (!user) {
        return (
            <div className="container-page mt-8 pb-16">
                <PageHeader
                    title="Favorites"
                    subtitle="Titles you love."
                />

                <EmptyState
                    title="Sign in to save favorites"
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
                    title="Favorites"
                    subtitle="Titles you love."
                />

                <EmptyState
                    title="Failed to load favorites."
                    icon={<CircleX className="h-8 w-8"/>}
                />
            </div>
        )
    }

    const items = favorites?.data?.data ?? [];

    if (items.length === 0) {
        return (
            <div className="container-page mt-8 pb-16">
                <PageHeader
                    title="Favorites"
                    subtitle="Titles you love."
                />

                <EmptyState
                    icon={<Heart className="h-8 w-8"/>}
                    title="No favorites yet"
                    description="Heart any title to save it here."
                    action={
                        <Button asChild>
                            <Link to="/search">Browse</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="container-page mt-8 pb-16">
            <PageHeader
                title="Favorites"
                subtitle="Titles you love."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {items.map((item) => (
                    <MovieCard
                        key={item._id}
                        omdbId={item.tmdbId}
                        className="w-full"
                    />
                ))}
            </div>
        </div>
    );
}

export default FavoritesPage;