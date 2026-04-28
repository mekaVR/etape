import type { AxiosInstance } from "axios";

let _instance: AxiosInstance | null = null;

export function setApiInstance(instance: AxiosInstance) {
  _instance = instance;
}

export function getApiInstance(): AxiosInstance {
  if (!_instance) {
    throw new Error("API client not initialized. Call initApiClient first.");
  }
  return _instance;
}
