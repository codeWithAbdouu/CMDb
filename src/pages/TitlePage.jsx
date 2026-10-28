import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {
    Heart,
    Bookmark,
    Calendar,
    Clock,
    Globe,
    Award,
    Tv,
    Film,
} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {Spinner} from "@/components/ui/spinner";

import {
    RatingBubble,
    CrewLine,
    SeasonsTab,
} from "@/features/TitlePageComponent.jsx";
import {ReviewsTab} from "@/features/ReviewsTab.jsx";

import {useMovieByIdWithDetails} from "@/hooks/cmdb/useMovieByIdWithDetails.js";

import {useAuth} from "@/context/AuthContext.jsx";

import {useFavorites} from "@/hooks/favorites/useFavorites.js";
import {useCreateFavorite} from "@/hooks/favorites/useCreateFavorite.js";

import {useWatchlists} from "@/hooks/watchlist/useWatchlists.js";
import {useCreateWatchlist} from "@/hooks/watchlist/useCreateWatchlist.js";

import {MOCK_MOVIES} from "@/features/data/index.js";
import {useDeleteFavorite} from "@/hooks/favorites/useDeleteFavorite.js";
import {useDeleteWatchlist} from "@/hooks/watchlist/useDeleteWatchlist.js";

function TitlePage() {
    const navigate = useNavigate();
    const {omdbId} = useParams();

    /*
     * =========================
     * AUTH
     * =========================
     */

    const {user} = useAuth();

    /*
     * =========================
     * MOVIE
     * =========================
     */

    const {
        data: movie,
        isLoading: isMovieLoading,
        error: movieError,
    } = useMovieByIdWithDetails(omdbId);

    /*
     * =========================
     * FAVORITES
     * =========================
     */

    const {
        data: favorites,
        isLoading: isFavoritesLoading
    } = useFavorites();


    const {
        mutate: createFavorite,
        isPending: isCreatingFavorite,
    } = useCreateFavorite();

    const {
        mutate: deleteFavorite,
        isPending: isDeleteFavorite,
    } = useDeleteFavorite();

    /*
     * =========================
     * WATCHLIST
     * =========================
     */

    const {
        data: watchlists,
        isLoading: isWatchlistsLoading
    } = useWatchlists();

    const {
        mutate: addToWatchlist,
        isPending: isAddingToWatchlist,
    } = useCreateWatchlist();

    const {
        mutate: removeToWatchlist,
        isPending: isRemovingToWatchlist,
    } = useDeleteWatchlist();

    /*
     * =========================
     * PAGE TITLE
     * =========================
     */

    useEffect(() => {
        if (movie?.Title) {
            document.title = `${movie.Title} · OMDb+`;
        }
    }, [movie?.Title]);


    /*
     * =========================
     * DATA
     * =========================
     */

    const t = movie || MOCK_MOVIES[0];

    const genres =
        t.Genre
            ?.split(",")
            .map((genre) => genre.trim())
            .filter(Boolean) ?? [];

    /*
     * =========================
     * CURRENT USER STATE
     * =========================
     */

    const favoriteItems = favorites?.data?.data ?? [];
    const watchlistItems = watchlists?.data?.data ?? [];

    /*
     * IMPORTANT:
     * Your backend field is called tmdbId,
     * but your actual IDs look like "tt1234567",
     * which are IMDb IDs.
     *
     * So we compare against t.imdbID.
     */

    const isFavorite = favoriteItems.some(
        (item) => item.tmdbId === t.imdbID
    );

    const isInWatchlist = watchlistItems.some(
        (item) => item.tmdbId === t.imdbID
    );

    /*
     * =========================
     * FAVORITE
     * =========================
     */

    const handleToggleFav = () => {
        if (!user) {
            navigate("/auth");
            return;
        }

        if (isFavorite) {
            deleteFavorite(omdbId);
        } else {
            createFavorite(omdbId);
        }
    };

    /*
     * =========================
     * WATCHLIST
     * =========================
     */

    const handleToggleWatch = () => {
        if (!user) {
            navigate("/auth");
            return;
        }

        if (isInWatchlist) {
            removeToWatchlist(omdbId);
        } else {
            addToWatchlist(omdbId);
        }
    };

    /*
     * =========================
     * LOADING / ERROR
     * =========================
     */

    if (isMovieLoading) {
        return (
            <div className="flex items-center justify-center mt-8">
                <Spinner className="size-8"/>
            </div>
        );
    }

    if (movieError) {
        return (
            <div className="p-8 text-center text-destructive">
                {movieError.message}
            </div>
        );
    }

    if (!movie) {
        return null;
    }


    /*
     * =========================
     * UI
     * =========================
     */

    return (
        <>
            {/* HERO */}

            <div
                className="relative h-[40vh] min-h-[260px] w-full overflow-hidden border-b border-border bg-muted"
                style={
                    t.Poster && t.Poster !== "N/A"
                        ? {
                            backgroundImage: `url(${t.Poster})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center 20%",
                        }
                        : undefined
                }
            >
                <div
                    className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30 backdrop-blur-2xl"/>
            </div>

            <div className="container-page -mt-48 relative grid grid-cols-1 gap-8 md:grid-cols-[240px,1fr] pb-16">

                {/* POSTER + ACTIONS */}

                <div>
                    <div
                        className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border shadow-2xl">
                        {t.Poster && t.Poster !== "N/A" ? (
                            <img
                                src={t.Poster}
                                alt={t.Title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="grid h-full w-full place-items-center text-muted-foreground">
                                {t.Type === "series" ? (
                                    <Tv className="h-12 w-12"/>
                                ) : (
                                    <Film className="h-12 w-12"/>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-col gap-2">

                        {/* FAVORITE */}

                        <Button
                            variant={isFavorite ? "default" : "outline"}
                            onClick={handleToggleFav}
                            disabled={
                                isCreatingFavorite ||
                                isFavoritesLoading ||
                                isDeleteFavorite
                            }
                            className="w-full"
                        >
                            <Heart
                                className={`h-4 w-4 mr-1.5 ${
                                    isFavorite ? "fill-current" : ""
                                }`}
                            />

                            {isCreatingFavorite || isDeleteFavorite
                                ? "Saving..."
                                : isFavorite
                                    ? "Favorited"
                                    : "Favorite"}
                        </Button>

                        {/* WATCHLIST */}

                        <Button
                            variant={
                                isInWatchlist
                                    ? "default"
                                    : "outline"
                            }
                            onClick={handleToggleWatch}
                            disabled={
                                isAddingToWatchlist ||
                                isRemovingToWatchlist ||
                                isWatchlistsLoading
                            }
                            className="w-full"
                        >
                            <Bookmark
                                className={`h-4 w-4 mr-1.5 ${
                                    isInWatchlist
                                        ? "fill-current"
                                        : ""
                                }`}
                            />

                            {isAddingToWatchlist || isRemovingToWatchlist
                                ? "Saving..."
                                : isInWatchlist
                                    ? "On watchlist"
                                    : "Watchlist"}
                        </Button>

                    </div>
                </div>

                {/* MOVIE DETAILS */}

                <div className="text-foreground">

                    <Badge
                        variant="outline"
                        className="mb-2 uppercase"
                    >
                        {t.Type === "series"
                            ? "TV Series"
                            : "Movie"}
                    </Badge>

                    <h1 className="font-display text-3xl font-bold md:text-5xl text-balance">
                        {t.Title}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">

                        {t.Year && (
                            <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5"/>
                                {t.Year}
                            </span>
                        )}

                        {t.Runtime &&
                            t.Runtime !== "N/A" && (
                                <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5"/>
                                    {t.Runtime}
                                </span>
                            )}

                        {t.Rated &&
                            t.Rated !== "N/A" && (
                                <Badge variant="secondary">
                                    {t.Rated}
                                </Badge>
                            )}

                        {t.Country &&
                            t.Country !== "N/A" && (
                                <span className="inline-flex items-center gap-1">
                                    <Globe className="h-3.5 w-3.5"/>
                                    {t.Country}
                                </span>
                            )}

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {genres.map((genre) => (
                            <Badge
                                key={genre}
                                variant="outline"
                            >
                                {genre}
                            </Badge>
                        ))}
                    </div>

                    {/* RATINGS */}

                    <div className="mt-6 flex flex-wrap gap-4">

                        {t.imdbRating &&
                            t.imdbRating !== "N/A" && (
                                <RatingBubble
                                    label="IMDb"
                                    value={t.imdbRating}
                                />
                            )}

                        {t.Metascore &&
                            t.Metascore !== "N/A" && (
                                <RatingBubble
                                    label="Metascore"
                                    value={t.Metascore}
                                    max="/100"
                                />
                            )}

                        {t.Ratings?.find((rating) =>
                            rating.Source.includes("Rotten")
                        ) && (
                            <RatingBubble
                                label="Rotten Tomatoes"
                                value={
                                    t.Ratings.find((rating) =>
                                        rating.Source.includes("Rotten")
                                    ).Value
                                }
                            />
                        )}

                    </div>

                    {/* PLOT */}

                    {t.Plot &&
                        t.Plot !== "N/A" && (
                            <p className="mt-6 max-w-3xl text-balance leading-relaxed text-muted-foreground">
                                {t.Plot}
                            </p>
                        )}

                    {/* AWARDS */}

                    {t.Awards &&
                        t.Awards !== "N/A" && (
                            <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                                <Award className="h-4 w-4 text-primary"/>
                                {t.Awards}
                            </p>
                        )}

                    {/* TABS */}

                    <Tabs
                        defaultValue="cast"
                        className="mt-8"
                    >
                        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">

                            <TabsTrigger value="cast">
                                Cast & crew
                            </TabsTrigger>

                            {t.Type === "series" && (
                                <TabsTrigger value="seasons">
                                    Seasons
                                </TabsTrigger>
                            )}

                            <TabsTrigger value="reviews">
                                Reviews
                            </TabsTrigger>

                        </TabsList>

                        {/* CAST */}

                        <TabsContent
                            value="cast"
                            className="mt-6 space-y-4 focus-visible:ring-0"
                        >
                            <CrewLine
                                label="Director"
                                value={t.Director}
                            />

                            <CrewLine
                                label="Writer"
                                value={t.Writer}
                            />

                            <CrewLine
                                label="Cast"
                                value={t.Actors}
                            />

                            <CrewLine
                                label="Language"
                                value={t.Language}
                            />

                            {t.BoxOffice &&
                                t.BoxOffice !== "N/A" && (
                                    <CrewLine
                                        label="Box office"
                                        value={t.BoxOffice}
                                    />
                                )}
                        </TabsContent>

                        {/* SEASONS */}

                        {t.Type === "series" && (
                            <TabsContent
                                value="seasons"
                                className="mt-6 focus-visible:ring-0"
                            >
                                <SeasonsTab
                                    totalSeasons={
                                        t.totalSeasons
                                            ? parseInt(
                                                t.totalSeasons,
                                                10
                                            )
                                            : 1
                                    }
                                />
                            </TabsContent>
                        )}

                        {/* REVIEWS */}

                        <TabsContent
                            value="reviews"
                            className="mt-6 focus-visible:ring-0"
                        >
                            <ReviewsTab
                                user={user}
                                onSignIn={() => navigate("/auth")}
                                omdbId={omdbId}
                            />
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
        </>
    );
}

export default TitlePage;
