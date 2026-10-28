import { useQuery } from "@tanstack/react-query";
import { getAllFavorites } from "@/services/app/favoritesServices.js";

export function useFavorites() {
    return useQuery({
        queryKey: ["favorites"],
        queryFn: getAllFavorites,
    });
}