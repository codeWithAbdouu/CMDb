import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMe } from "../../services/app/userServices.js";

export function useDeleteMe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMe,

        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ["user"],
            });
        },
    });
}