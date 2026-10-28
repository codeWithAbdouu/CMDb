import cmdbApi from "./cmdbApi.js";

// const API_KEY = "743ce034";
const API_KEY = "20773ca5";

export const searchMovies = async (
    search,
    page = 1,
    type = "",
    year = ""
) => {
    const { data } = await cmdbApi.get("/", {
        params: {
            apikey: API_KEY,
            s: search,
            page,
            ...(type && { type }),
            ...(year && { y: year }),
        },
    });

    return data;
};

export const getMovieById = async (id) => {
    const { data } = await cmdbApi.get("/", {
        params: {
            apikey: API_KEY,
            i: id,
        },
    });

    return data;
};

export const getMovieByIdWithDetails = async (id) => {
    const { data } = await cmdbApi.get("/", {
        params: {
            apikey: API_KEY,
            i: id,
            plot: "full",
        },
    });

    return data;
};

export const getMovieByTitle = async (title) => {
    const { data } = await cmdbApi.get("/", {
        params: {
            apikey: API_KEY,
            t: title,
        },
    });

    return data;
};

export const getMovieByTitleWithDetails = async (title) => {
    const { data } = await cmdbApi.get("/", {
        params: {
            apikey: API_KEY,
            t: title,
            plot: "full",
        },
    });

    return data;
};