import { useQuery } from "@tanstack/react-query";
import { getAllWatchlists } from "@/services/app/watchlistServices.js";

export function useWatchlists() {
    return useQuery({
        queryKey: ["watchlists"],
        queryFn: getAllWatchlists,
    });
}