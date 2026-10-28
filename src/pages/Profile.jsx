import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Heart, Bookmark, CircleX} from "lucide-react";

// Independent subcomponents
import {Button} from "@/components/ui/button";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import MovieCard from "@/components/cutomeUI/MovieCard.jsx";
import EmptyState from "@/components/cutomeUI/EmptyState.jsx";

import {useAuth} from "@/context/AuthContext.jsx";
import {useMe} from "@/hooks/user/useMe.js";
import {formatDate} from "@/lib/utils.js";
import {Spinner} from "@/components/ui/spinner.jsx";
import PageHeader from "@/components/Layouts/PageHeader.jsx";
import {useLogout} from "@/hooks/user/useLogout.js";
import {useWatchlists} from "@/hooks/watchlist/useWatchlists.js";
import {useFavorites} from "@/hooks/favorites/useFavorites.js";
import {useMyReviews} from "@/hooks/reviews/useGetMyReviews.js";
import Review from "@/components/cutomeUI/Review.jsx";

function ProfilePage() {
    const {user} = useAuth();
    const {
        data: meDataRes,
        isLoading,
        error,
    } = useMe();

    const meData = meDataRes?.data?.data;

    const {
        data: watchlistsData,
        isLoading: isWatchlistsLoading
    } = useWatchlists();

    const watchlists = watchlistsData?.data?.data ?? [];

    const {
        data: favoritesData,
        isLoading: isFavoriteLoading
    } = useFavorites();

    const favorites = favoritesData?.data?.data ?? [];

    const {data: reviewsData, isLoading: isReviewsLoading} = useMyReviews();

    const reviews = reviewsData?.data?.data ?? [];

    // Sandbox parameter fallback config (simulates browsing path: /profile/johndoe)
    const username = user?.name || "johndoe";

    useEffect(() => {
        if (username) {
            document.title = `@${username} · OMDb+`;
        } else {
            document.title = "Profile · OMDb+";
        }
    }, [username]);

    const {
        mutateAsync: logout,
        isPending: isLoggingOut,
    } = useLogout();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            console.error("LOGOUT ERROR:", err);
        }
    };

    if (!user) {
        return (
            <div className="container-page mt-12">
                <PageHeader
                    title="Profile"
                    subtitle="User not found."
                />

                <EmptyState
                    title="This user does not exist."
                    icon={<CircleX className="h-8 w-8" />}
                />
            </div>
        );
    }

    if (isLoading || isWatchlistsLoading || isFavoriteLoading || isReviewsLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Spinner className="size-16" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-page mt-8 pb-16">
                <PageHeader
                    title="Profile"
                    subtitle="Manage your account and personal information."
                />

                <EmptyState
                    title="Failed to load profile."
                    icon={<CircleX className="h-8 w-8" />}
                />
            </div>
        );
    }

    return (
        <div className="container-page mt-8 pb-16">
            {/* Profile Info Card Header Group */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground select-none sm:h-20 sm:w-20 sm:text-3xl">
                    {meData.name.slice(0, 1).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                    <h1 className="break-words font-display text-xl font-bold sm:text-2xl">
                        @{meData.name}
                    </h1>

                    {meData.bio && (
                        <p className="mt-1 break-words text-sm text-muted-foreground">
                            {meData.bio}
                        </p>
                    )}

                    <p className="mt-1 text-xs text-muted-foreground">
                        Joined {formatDate(meData.createdAt)}
                    </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link to="/settings">Edit profile</Link>
                    </Button>

                    <Button variant="destructive" className="w-full sm:w-auto" onClick={handleLogout}>
                        {isLoggingOut ? "Sign Out..." : "Sign Out" }
                    </Button>
                </div>
            </div>

            {/* Profile Views Tab Panels System */}
            <Tabs defaultValue="reviews" className="mt-8">
                <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
                    <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                    <TabsTrigger value="favs">Favorites ({favorites.length})</TabsTrigger>
                    <TabsTrigger value="watch">Watchlist ({watchlists.length})</TabsTrigger>
                </TabsList>

                {/* Reviews Content Grid */}
                <TabsContent value="reviews" className="mt-6 space-y-3 focus-visible:ring-0">
                    {reviews.length === 0 ? (
                        <EmptyState title="No reviews yet"/>
                    ) : (
                        reviews.map((r) => (
                            <Review key={r.id} omdbId={r.tmdbId} rating={r.rating} body={r.review} />
                        ))
                    )}
                </TabsContent>

                {/* Favorites Grid Panel */}
                <TabsContent value="favs" className="mt-6 focus-visible:ring-0">
                    {favorites.length === 0 ? (
                        <EmptyState icon={<Heart className="h-8 w-8"/>} title="No favorites yet"/>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {favorites.map((t) => (
                                <MovieCard key={t.tmdbId} omdbId={t.tmdbId} className={"w-full"}/>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Personal Watchlist Grid Panel */}
                <TabsContent value="watch" className="mt-6 focus-visible:ring-0">
                    {watchlists.length === 0 ? (
                        <EmptyState icon={<Bookmark className="h-8 w-8"/>} title="Watchlist is empty"/>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
                            {watchlists.map((t) => (
                                <MovieCard key={t.tmdbId} omdbId={t.tmdbId} className={"w-full"}/>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ProfilePage;