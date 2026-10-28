import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/services/app/userServices.js";

export function useUpdatePassword() {
    return useMutation({
        mutationFn: updatePassword,
    });
}