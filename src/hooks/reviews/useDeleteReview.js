import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {deleteReview} from "@/services/app/reviewServices.js";

export function useDeleteReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tmdbId) => deleteReview(tmdbId),

        onSuccess: (_, tmdbId) => {
            queryClient.invalidateQueries({
                queryKey: ["reviews", tmdbId],
            });

            queryClient.invalidateQueries({
                queryKey: ["review", tmdbId],
            });

            toast.success("Review deleted successfully");
        },

        onError: (error) => {
            console.error("Failed to delete review:", error);
            toast.error("Failed to delete review. Please try again.");
        },
    });
}