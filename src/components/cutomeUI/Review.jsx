import {Link} from "react-router-dom";
import {useMovieById} from "@/hooks/cmdb/useMovieById.js";

function Review({omdbId, rating, body}) {
    const {data, isLoading} = useMovieById(omdbId);
    const title = data?.Title;

    if (isLoading) return null;

    return (
        <Link
            to={`/title/${omdbId}`}
            className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
        >
            <div className="flex items-center justify-between">
                <strong className="text-sm font-semibold">{title}</strong>
                <span className="text-xs font-semibold text-primary">{rating}/10</span>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{body}</p>
        </Link>
    )
}

export default Review
