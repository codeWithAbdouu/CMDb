import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../services/omdb/cmdbServices.js";

export function useSearchMovies(search, page = 1, type = "", year = "") {
    return useQuery({
        queryKey: ["searchMovies", search, page, type, year],
        queryFn: () => searchMovies(search, page, type, year),
        enabled: !!search,
    });
}