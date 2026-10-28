const CARD_SIZES = {
    sm: "w-32",
    md: "w-40",
    lg: "w-48",
};

function MovieCardSkeleton({size = "md"}) {
    const widthClass = CARD_SIZES[size] || CARD_SIZES.md;

    return (
        <div className={`shrink-0 ${widthClass}`}>
            <div className="aspect-[2/3] animate-pulse rounded-lg bg-muted"/>
            <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-muted"/>
            <div className="mt-1 h-3 w-1/3 animate-pulse rounded bg-muted"/>
        </div>
    );
}

export default MovieCardSkeleton;