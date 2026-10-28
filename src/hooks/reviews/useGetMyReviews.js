import {useQuery} from "@tanstack/react-query";
import {getAllReviewsMe} from "@/services/app/reviewServices.js";

export function useMyReviews() {
    return useQuery({
        queryFn: () => getAllReviewsMe(),
    });
}