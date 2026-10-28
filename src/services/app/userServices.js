import api from "./api.js";

export const signup = async (data) => {
    const res = await api.post("/users/signup", data);
    return res.data;
};

export const login = async (data) => {
    const res = await api.post("/users/login", data);
    return res.data;
};

export const logout = async () => {
    const res = await api.post("/users/logout");

    return res.data;
};

export const forgotPassword = async (email) => {
    const res = await api.post("/users/forgetPassword", {
        email,
    });
    return res.data;
};

export const resetPassword = async (token, data) => {
    const res = await api.patch(`/users/resetPassword/${token}`, data);
    return res.data;
};

export const getMe = async () => {
    const res = await api.get("/users/me");
    return res.data;
};

export const updateMe = async (data) => {
    const res = await api.patch("/users/updateMe", data);
    return res.data;
};

export const updatePassword = async (data) => {
    const res = await api.patch("/users/updatePassword", data);
    return res.data;
};

export const deleteMe = async () => {
    const res = await api.delete("/users/deleteMe");
    return res.data;
};