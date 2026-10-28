import {Link} from "react-router-dom";
import {Film, Star, Tv} from "lucide-react";
import {useMovieById} from "#/src/hooks/cmdb/useMovieById.js";

const DEFAULT_MOCK_ITEM = {
    imdbID: "mock-id",
    Title: "Placeholder Media Title",
    Year: "2026",
    Poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    Type: "movie",
    imdbRating: "8.5",
};

const CARD_SIZES = {
    sm: "w-32",
    md: "w-40",
    lg: "w-48",
};

function MovieCard({omdbId, size = "md", className="" }) {
    const {data, isLoading, error} = useMovieById(omdbId);

    if (isLoading) {
        return (
            <div className={`${CARD_SIZES[size]} shrink-0 ${className}`}>
                <div className="aspect-[2/3] animate-pulse rounded-lg bg-muted"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${CARD_SIZES[size]} text-sm text-red-500 ${className}`}>
                Failed to load movie.
            </div>
        );
    }

    const mediaItem = data || DEFAULT_MOCK_ITEM;

    const {
        Poster,
        Title,
        Type,
        imdbID,
        imdbRating,
        Year,
    } = mediaItem;

    const widthClass = CARD_SIZES[size] || CARD_SIZES.md;
    const isSeries = Type === "series";

    const hasValidPoster =
        Poster &&
        Poster !== "N/A" &&
        typeof Poster === "string";

    return (
        <Link
            to={`/title/${imdbID}`}
            className={`group block shrink-0 ${widthClass} ${className}`}
        >
            <div className="poster-hover relative aspect-[2/3] overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                {hasValidPoster ? (
                    <img
                        src={Poster}
                        alt={Title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        {isSeries ? (
                            <Tv className="h-10 w-10"/>
                        ) : (
                            <Film className="h-10 w-10"/>
                        )}
                    </div>
                )}

                {imdbRating && imdbRating !== "N/A" && (
                    <div
                        className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/85 px-1.5 py-0.5 text-xs font-medium backdrop-blur">
                        <Star className="h-3 w-3 fill-primary text-primary"/>
                        {imdbRating}
                    </div>
                )}

                <div
                    className="absolute left-2 top-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground backdrop-blur">
                    {isSeries ? "TV" : "Movie"}
                </div>
            </div>

            <div className="mt-2 line-clamp-2 text-sm font-medium leading-tight">
                {Title}
            </div>

            <div className="text-xs text-muted-foreground">
                {Year}
            </div>
        </Link>
    );
}

export default MovieCard;