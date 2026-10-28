import axios from "axios";

const cmdbApi = axios.create({
    baseURL: "https://www.omdbapi.com/",
});

export default cmdbApi;