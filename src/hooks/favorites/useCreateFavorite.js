import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFavorite } from "../../services/app/favoritesServices.js";

export function useCreateFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tmdbId) => createFavorite(tmdbId),

        onSuccess: (_, tmdbId) => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"],
            });

            queryClient.invalidateQueries({
                queryKey: ["favorite", tmdbId],
            });

            toast.success("Added to favorites");
        },

        onError: (error) => {
            console.error("Failed to add to favorites:", error);
            toast.error("Failed to add to favorites. Please try again.");
        },
    });
}