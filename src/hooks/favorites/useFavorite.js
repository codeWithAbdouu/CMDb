import { useQuery } from "@tanstack/react-query";
import { getMovieFavorites } from "../../services/app/favoritesServices.js";

export function useFavorite(tmdbId) {
    return useQuery({
        queryKey: ["favorite", tmdbId],
        queryFn: () => getMovieFavorites(tmdbId),
        enabled: !!tmdbId,
    });
}