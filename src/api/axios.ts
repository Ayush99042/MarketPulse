import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v1",
  params: {
    access_key: "5a8841ac311ce916e252d1ed3bb9ff52",
  },
});
