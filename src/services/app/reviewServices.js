import api from "./api.js";

export const getAllReviewsPerMovie = async (tmdbId) => {
    const {data} = await api.get(`/reviews/${tmdbId}`);

    return data;
};

export const getAllReviewsMe = async () => {
    const {data} = await api.get(`/reviews/me`);

    return data;
};

export const createReview = async (tmdbId, reviewData) => {
    const {data} = await api.post(`/reviews/${tmdbId}`, reviewData);

    return data;
};

export const updateReview = async (tmdbId, reviewData) => {
    const {data} = await api.patch(`/reviews/${tmdbId}`, reviewData);

    return data;
};

export const deleteReview = async (tmdbId) => {
    const {data} = await api.delete(`/reviews/${tmdbId}`);

    return data;
};

export const getMyReview = async (tmdbId) => {
    const {data} = await api.get(`/reviews/${tmdbId}/me`);

    return data;
};