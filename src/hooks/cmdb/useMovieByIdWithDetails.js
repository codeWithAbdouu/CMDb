import { useQuery } from "@tanstack/react-query";
import { getMovieByIdWithDetails } from "../../services/omdb/cmdbServices.js";

export function useMovieByIdWithDetails(movieId) {
    return useQuery({
        queryKey: ["movie-details", movieId],
        queryFn: () => getMovieByIdWithDetails(movieId),
        enabled: !!movieId,
    });
}