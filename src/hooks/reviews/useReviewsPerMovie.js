import { useQuery } from "@tanstack/react-query";
import { getAllReviewsPerMovie } from "@/services/app/reviewServices.js";

export function useReviewsPerMovie(tmdbId) {
    return useQuery({
        queryKey: ["reviews", tmdbId],
        queryFn: () => getAllReviewsPerMovie(tmdbId),
        enabled: !!tmdbId,
    });
}