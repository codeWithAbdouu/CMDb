import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {logout} from "@/services/app/userServices.js";

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,

        onSuccess: () => {
            queryClient.setQueryData(["user"], null);
            toast.success("Signed out successfully");
        },

        onError: (error) => {
            console.error("Logout error:", error);
            toast.error("Failed to sign out. Please try again.");
        },
    });
};