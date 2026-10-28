import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createWatchlist } from "../../services/app/watchlistServices.js";

export function useCreateWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tmdbId) => createWatchlist(tmdbId),

        onSuccess: (_, tmdbId) => {
            queryClient.invalidateQueries({
                queryKey: ["watchlists"],
            });

            queryClient.invalidateQueries({
                queryKey: ["watchlist", tmdbId],
            });

            toast.success("Added to watchlist");
        },

        onError: (error) => {
            console.error("Failed to add to watchlist:", error);
            toast.error("Failed to add to watchlist. Please try again.");
        },
    });
}