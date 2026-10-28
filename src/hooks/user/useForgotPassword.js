import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/app/userServices.js";

export function useForgotPassword() {
    return useMutation({
        mutationFn: forgotPassword,
    });
}