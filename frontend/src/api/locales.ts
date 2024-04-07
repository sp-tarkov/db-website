import axios from "axios";
import { ApiError } from "@src/utils/ApiError";
import { errorHandler } from "@src/utils/AxiosErrorHandler";

const client = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
});

export const getLocaleList = async (onFailure?: (error: ApiError) => void): Promise<string[]> => {
  try {
    return (await client.get<string[]>("/locales")).data;
  } catch(err) {
    return await errorHandler(err, onFailure);
  }
};
