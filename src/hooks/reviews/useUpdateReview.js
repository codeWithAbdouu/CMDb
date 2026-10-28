import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {updateReview} from "@/services/app/reviewServices.js";

export function useUpdateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({tmdbId, reviewData}) =>
            updateReview(tmdbId, reviewData),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["reviews", variables.tmdbId],
            });

            queryClient.invalidateQueries({
                queryKey: ["review", variables.tmdbId],
            });

            toast.success("Review updated successfully");
        },

        onError: (error) => {
            console.error("Failed to update review:", error);
            toast.error("Failed to update review. Please try again.");
        },
    });
}