import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/services/app/userServices.js";

export function useUpdateMe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMe,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user"],
            });
        },
    });
}