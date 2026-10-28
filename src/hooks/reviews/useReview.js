import {useQuery} from "@tanstack/react-query";
import {getMyReview} from "@/services/app/reviewServices.js";

export function useReview(tmdbId) {
    return useQuery({
        queryKey: ["review", tmdbId],
        queryFn: () => getMyReview(tmdbId),
        enabled: !!tmdbId,
    });
}