import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../../services/app/userServices.js";

export function useSignup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: signup,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user"],
            });
        },
    });
}