import { useQuery } from "@tanstack/react-query";
import { getMovieWatchlists } from "../../services/app/watchlistServices.js";

export function useWatchlist(tmdbId) {
    return useQuery({
        queryKey: ["watchlist", tmdbId],
        queryFn: () => getMovieWatchlists(tmdbId),
        enabled: !!tmdbId,
    });
}