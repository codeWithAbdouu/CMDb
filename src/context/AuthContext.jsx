import {createContext, useContext} from "react";
import {useMe} from "@/hooks/user/useMe.js";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const {
        data: meData,
        isLoading,
        isError,
    } = useMe();

    const user = meData?.data?.data;

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}