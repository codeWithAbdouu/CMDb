import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteFavorite } from "../../services/app/favoritesServices.js";

export function useDeleteFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tmdbId) => deleteFavorite(tmdbId),

        onSuccess: (_, tmdbId) => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"],
            });

            queryClient.invalidateQueries({
                queryKey: ["favorite", tmdbId],
            });

            toast.success("Removed from favorites");
        },

        onError: (error) => {
            console.error("Failed to remove from favorites:", error);
            toast.error("Failed to remove from favorites. Please try again.");
        },
    });
}