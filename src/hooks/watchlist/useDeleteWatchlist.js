import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteWatchlist } from "../../services/app/watchlistServices.js";

export function useDeleteWatchlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tmdbId) => deleteWatchlist(tmdbId),

        onSuccess: (_, tmdbId) => {
            queryClient.invalidateQueries({
                queryKey: ["watchlists"],
            });

            queryClient.invalidateQueries({
                queryKey: ["watchlist", tmdbId],
            });

            toast.success("Removed from watchlist");
        },

        onError: (error) => {
            console.error("Failed to remove from watchlist:", error);
            toast.error("Failed to remove from watchlist. Please try again.");
        },
    });
}