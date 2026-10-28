import { useQuery } from "@tanstack/react-query";
import { getMovieByTitle } from "../../services/omdb/cmdbServices.js";

export function useMovieByTitle(title) {
    return useQuery({
        queryKey: ["movie-title", title],
        queryFn: () => getMovieByTitle(title),
        enabled: !!title,
    });
}