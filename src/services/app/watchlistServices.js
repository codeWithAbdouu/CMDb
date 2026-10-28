import api from "./api";

export const createWatchlist = async (tmdbId) => {
    const {data} = await api.post(`/watchlist/${tmdbId}`);

    return data;
};

export const deleteWatchlist = async (tmdbId) => {
    const {data} = await api.delete(`/watchlist/${tmdbId}`);

    return data;
};

export const getMovieWatchlists = async (tmdbId) => {
    const {data} = await api.get(`/watchlist/${tmdbId}/me`);

    return data;
};

export const getAllWatchlists = async () => {
    const {data} = await api.get("/watchlist/me");

    return data;
};