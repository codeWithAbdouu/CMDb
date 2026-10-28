import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {createReview} from "@/services/app/reviewServices.js";

export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({tmdbId, reviewData}) =>
            createReview(tmdbId, reviewData),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["reviews", variables.tmdbId],
            });

            queryClient.invalidateQueries({
                queryKey: ["review", variables.tmdbId],
            });

            toast.success("Review posted successfully");
        },

        onError: (error) => {
            console.error("Failed to post review:", error);
            toast.error("Failed to post review. Please try again.");
        },
    });
}