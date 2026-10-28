import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/app/userServices.js";

export function useMe() {
    return useQuery({
        queryKey: ["user"],
        queryFn: getMe,
    });
}