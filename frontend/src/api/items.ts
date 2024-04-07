import axios from "axios";
import { ApiError } from "@src/utils/ApiError";
import { errorHandler } from "@src/utils/AxiosErrorHandler";
import { ItemComplete } from "@src/dto/ItemComplete";
import { ItemHierarchy } from "@src/dto/ItemHierarchy";
import { ItemData } from "@src/dto/ItemData";

const client = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
});

export const searchItem = async (query: string, locale?: string, onFailure?: (error: ApiError) => void) => {
  try {
    return (await client.post<{ items: ItemComplete[] } | undefined>("/search", {
      query: query,
      locale: locale ?? "en"
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })).data?.items ?? [];
  } catch(err) {
    return await errorHandler(err, onFailure);
  }
};

export const getItem = async (id: string, locale?: string, onFailure?: (error: ApiError) => void) => {
  try {
    return (await client.get<ItemComplete | undefined>("/item", {
      params: {
        id: id,
        locale: locale ?? "en"
      }
    })).data;
  } catch(err) {
    return await errorHandler(err, onFailure);
  }
};

export const getItemHierarchy = async (itemData: ItemData, locale?: string, onFailure?: (error: ApiError) => void) => {
  try {
    return (await client.get<ItemHierarchy | undefined>("/item/hierarchy", {
      params: {
        id: itemData._id,
        locale: locale ?? "en"
      }
    })).data;
  } catch(err) {
    return await errorHandler(err, onFailure);
  }
};
