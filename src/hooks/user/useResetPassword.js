import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/app/userServices.js";

export function useResetPassword() {
    return useMutation({
        mutationFn: ({ token, passwordData }) =>
            resetPassword(token, passwordData),
    });
}