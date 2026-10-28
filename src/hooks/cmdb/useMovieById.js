import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "@/services/omdb/cmdbServices.js";

export function useMovieById(movieId) {
    return useQuery({
        queryKey: ["movie", movieId],
        queryFn: () => getMovieById(movieId),
        enabled: !!movieId,
    });
}