import axios from "axios";
import { setApiInstance } from "./instance";

let _accessToken: string | null = null;

export const getAccessToken = () => _accessToken;
export const setAccessToken = (token: string) => {
  _accessToken = token;
};
export const clearAccessToken = () => {
  _accessToken = null;
};

export function createApiClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  client.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      if (
        error.response?.status === 401 &&
        !original._retry &&
        !original.url?.includes("/auth/refresh")
      ) {
        original._retry = true;
        try {
          const { data } = await axios.post(
            `${baseURL}/auth/refresh`,
            {},
            { withCredentials: true },
          );
          setAccessToken(data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return client(original);
        } catch {
          clearAccessToken();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    },
  );

  setApiInstance(client);
  return client;
}
