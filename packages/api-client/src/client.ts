// packages/api-client/src/client.ts
import axios from "axios"

export const apiClient = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // pour le cookie refresh token
})

// Intercepteur request — injecte l'access token
apiClient.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Intercepteur response — refresh token automatique
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true
            try {
                const { data } = await axios.post("/api/auth/refresh", {}, {
                    withCredentials: true,
                })
                setAccessToken(data.accessToken)
                original.headers.Authorization = `Bearer ${data.accessToken}`
                return apiClient(original)
            } catch {
                clearAccessToken()
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

// Gestion de l'access token en mémoire
let _accessToken: string | null = null

export const getAccessToken = () => _accessToken
export const setAccessToken = (token: string) => { _accessToken = token }
export const clearAccessToken = () => { _accessToken = null }
