import axios from "axios";
import { ApiError } from "@src/utils/ApiError";

export const errorHandler = async (err: unknown, onFailure?: (error: ApiError) => void): Promise<never> => {
  const apiError = new ApiError(-2, JSON.stringify(err, null, "\t"));

  if(axios.isAxiosError(err)) {
    if (err.response) {
      apiError.status = err.response.status;
      apiError.message = err.response.statusText;
    } else if(err.message) {
      apiError.status = -1;
      apiError.message = err.message;
    }
  }

  if(onFailure) {
    onFailure(apiError);
  }

  console.error(apiError.status, apiError.message);

  throw apiError;
};
