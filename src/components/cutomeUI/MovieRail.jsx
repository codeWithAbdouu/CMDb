import MovieCard from "@/components/cutomeUI/MovieCard.jsx";

function Rail({children}) {
    return (
        <div className="scrollbar-none -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
            {children}
        </div>
    );
}

function MovieRail({items = []}) {
    // If no items are explicitly passed, fallback to the global mockup array
    const displayItems = items.length > 0 ? items : null;

    return (
        <Rail>
            {displayItems.map((movieId) => (
                <MovieCard
                    key={movieId}
                    omdbId={movieId}
                />
            ))}
        </Rail>
    );
}

export default MovieRail;