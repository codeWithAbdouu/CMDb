import { useQuery } from "@tanstack/react-query";
import { getMovieByTitleWithDetails } from "../../services/omdb/cmdbServices.js";

export function useMovieByTitleWithDetails(title) {
    return useQuery({
        queryKey: ["movie-title-details", title],
        queryFn: () => getMovieByTitleWithDetails(title),
        enabled: !!title,
    });
}