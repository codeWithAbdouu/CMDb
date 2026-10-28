import api from "./api";

export const createFavorite = async (tmdbId) => {
    const {data} = await api.post(`/favorites/${tmdbId}`);

    return data;
};

export const deleteFavorite = async (tmdbId) => {
    const {data} = await api.delete(`/favorites/${tmdbId}`);

    return data;
};

export const getMovieFavorites = async (tmdbId) => {
    const {data} = await api.get(`/favorites/${tmdbId}/me`);

    return data;
};

export const getAllFavorites = async () => {
    const {data} = await api.get("/favorites/me");

    return data;
};