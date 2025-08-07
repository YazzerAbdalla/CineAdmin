import { AxiosError } from "axios";

export function apiErrorHandler(error: unknown) {
  if (error instanceof AxiosError && error.response) {
    throw error.response.data || error.message;
  } else {
    throw error;
  }
}
